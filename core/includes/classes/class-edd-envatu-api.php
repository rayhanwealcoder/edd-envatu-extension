<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;


/**
 * Class Edd_Envatu_Extension_Run
 *
 * Thats where we bring the plugin to life
 *
 * @package		EDDENVATUE
 * @subpackage	Classes/Edd_Envatu_Extension_Run
 * @author		Rayhan
 * @since		1.0
 */
class Edd_Envatu_Rest_Api{

	public $sale_api = 'https://api.envato.com/v3/market/author/sale';
	
	public $lic_table = 'edd_licenses';
	/**
	 * Our Edd_Envatu_Extension_Run constructor 
	 * to run the plugin logic.
	 *
	 * @since 1.0
	 */
	 function __construct(){
		$this->add_hooks();

	}

	/**
	 * Registers all WordPress and plugin related hooks
	 *
	 * @access	private
	 * @since	1.0
	 * @return	void
	 */
	private function add_hooks(){
		add_action( 'rest_api_init', [ $this , 'wcf_register_rest_api' ] );
		add_action('edd_deactivate_site' ,[ $this , 'edd_deactivate_site' ] );
		
	}
	
	function edd_deactivate_site(){
		error_log('deactivate_method run');
	}
	function wcf_create_edd_order($envato_purchase_key, $customer_email, $download_id) {
	
		$product = get_post( $download_id );			
		$products[] = $product;	
		$cart_details = array();	
		// Add each download to the order.
		foreach ( $products as $key => $download ) {
		
			if ( ! $download instanceof WP_Post ) {
				continue;
			}

			$options         = array();
			$final_downloads = array();

			$item_number = array(
				'id'       => $download->ID,
				'quantity' => 1,
				'options'  => $options,
			);

			$cart_details[ 0 ] = array(
				'name'        => edd_get_download_name( $download->ID ),
				'id'          => $download->ID,
				'item_number' => $item_number,
				'item_price'  => 0.0,
				'subtotal'    => 0.0,
				'price'       => 0.0,
				'quantity'    => 1,
				'discount'    => 0,
				'tax'         => 0,
			);

			$final_downloads[ 0 ] = $item_number;	
			
		}
		
		$user_info = array(
				'id'         => 0,
				'email'      => $customer_email,
				'first_name' => $customer_email,
				'last_name'  => 'n/a',
				'discount'   => 'none',
			);

            $purchase_data = array(
			'price'        => 0,
			'tax'          => 0,
			'purchase_key' => $envato_purchase_key,
			'user_email'   => $customer_email,
			'user_info'    => $user_info,
			'currency'     => '$',
			'downloads'    => $final_downloads,
			'cart_details' => $cart_details,
			'status'       => 'completed',
		);

		if ( ! empty( $timestring ) ) {
			$purchase_data['date_created'] = $timestring;
		}

		$order_id = edd_build_order( $purchase_data );
		
		return $order_id;
			   
	}
	
	function customer_get_validation() {
		
		if( !isset( $_REQUEST[ 'email' ] ) ){
			return rest_ensure_response( [ 'code' => 404, 'msg' => 'Provide email' ] );
		}
		
		if ( !filter_var($_REQUEST[ 'email' ], FILTER_VALIDATE_EMAIL ) ) {
			return rest_ensure_response( ['code' => 403, 'msg' => 'Invalid email'] );
		}
		
		$customer = $this->get_customer($_REQUEST['email']);		
		
	    if( isset($customer[ 'user_id' ]) && $customer[ 'user_id' ] !='' )
	    {
	    
			if( $cust = $this->is_license_already_registered($_REQUEST['code'])){
				return rest_ensure_response( [ 'code' => 200, 'msg' => 'License registered', 'customer' => $cust , 'next_step' => 'activate_license' ] );
			}	
			
			return rest_ensure_response( ['code' => 201 , 'msg' => 'New customer found', 'customer' => $customer , 'next_step'=>'license_varification'] );
	    }
		return rest_ensure_response( ['code' => 200 , 'msg' => 'Customer found', 'customer' => $customer , 'next_step' => 'order'] );
	}
	
	public function get_customer($email){
	
		$customer = new EDD_Customer($email);		

		if( ! $customer->id ){
			$customer_id = EDD()->customers->add(array(
				'email' => $_REQUEST['email'],
				'name'  => $_REQUEST['email'], 
			));
		} else {
			$customer_id = $customer->id;
		}
		
		return [ 'user_id' => $customer->user_id, 'customer_id' => $customer_id , 'email' => $customer->email ];
	}
	
	function check_edd_order_exists_by_purchase_key( $purchase_key ) {
		// Query EDD payments by the purchase key
	    $payments = $this->is_license_already_registered($purchase_key);
		if ( ! empty( $payments ) ) {			
			return $payments;
		}	
		return false;
	}
	
	
	public function wcf_create_customer_order(){
		
		if(isset($_REQUEST['email']) && isset($_REQUEST['code']) && isset($_REQUEST['download_id'])){
		
			if (!filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
			
				return rest_ensure_response( [ 'code' => 403, 'msg' => 'Invalid email' ] );
			}					
			
			if($res = $this->check_edd_order_exists_by_purchase_key($_REQUEST['code'])){
				return rest_ensure_response( [ 'code' => 200, 'msg' => $res , 'next_step' => 'activate_license' ] );
			}
			
			if($order_id = $this->wcf_create_edd_order($_REQUEST[ 'purchase_code' ],$_REQUEST[ 'email' ],$_REQUEST[ 'download_id' ])){
				$customer = $this->get_customer($_REQUEST['email']);		
				$customer['order_id'] = $order_id;
				return rest_ensure_response( [ 'code' => 200 , 'msg' => 'License processing' , 'customer' => $customer, 'next_step' => 'attach' ] );
			}else{
				return rest_ensure_response( [ 'code' => 403 , 'msg' => 'License infomation wrong' , 'next_step' => 'done' ] );
			} 				
			
		}
		
		return rest_ensure_response( [ 'code' => 404 , 'msg' => 'Provide license code , email and other secure data' , 'next_step' => 'done' ] );
	}
	/* 
	* provide license code and email | ID
	*/
	public function envatu_license_varification(){	
		
		if( isset( $_REQUEST[ 'code' ] ) && isset($_REQUEST['email'])){
			
			
			if( $cus = $this->is_license_already_registered($_REQUEST[ 'code' ] ) )
			{	
				$customer = $this->get_customer($cus[ 'email' ]);		
					return rest_ensure_response( [ 
						'code' => 200, 
						'msg' => 'Already resgistered with '. $customer[ 'email' ], 
						'customer' => $customer , 
						'next_step' => 'activate_license' 
						]); 
					
		    }
		    
		    $lic_valid = $this->IsPurchaseCodeValid($_REQUEST[ 'code' ] );	
			$customer = $this->get_customer($_REQUEST['email']);		
		    if( isset( $lic_valid[ 'code' ] ) && $lic_valid[ 'code' ] == 200 )
		    {
				return rest_ensure_response( [ 'code' => 200 , 'msg' => isset($lic_valid[ 'msg' ]) ? $lic_valid[ 'msg' ] : 'Valid license', 'customer' => $customer, 'next_step' => 'order' ] );
		    }
		    
		    return rest_ensure_response( [ 'code' => 403 , 'msg' => isset($lic_valid[ 'msg' ]) ? $lic_valid[ 'msg' ] : 'Provide valid license', 'customer' => $customer, 'next_step' => 'done' ] );
		
		}
		
		return rest_ensure_response( [ 'code' => 403 , 'msg' => 'Provide license code', 'next_step' => 'done' ] );
	}
	
	public function is_license_already_registered($license){
	
		global $wpdb;
		
		$licenses_db = edd_software_licensing()->licenses_db;	  
		
		$results = $wpdb->get_results(
			$wpdb->prepare("SELECT * FROM $licenses_db->table_name WHERE license_key = %s limit 1", $license), ARRAY_A
		);
		
		if( is_wp_error( $results ) ){
		
			return false;
		}	
		
		if(is_array($results ) && !empty($results)){		
			$results            = $results[0]; 			
			$customer           = new EDD_Customer($results['customer_id']);	
			$results['email']   = $customer->email;
			return $results;
		}
		
		return false;
	}	
	
	public function new_license_create( $lic, $download_id, $order_id=0, $email =null){
	
		global $wpdb;
		$licenses_db     = edd_software_licensing()->licenses_db;
		$customer        = new EDD_Customer($email);	
		if(isset( $customer->id )){
		
			$license_data = array(
				'id'           => null,
				'license_key'  => $lic,
				'status'       => 'inactive',
				'download_id'  => false !== $download_id ? $download_id : 0,
				'price_id'     => null,
				'payment_id'   => $order_id,
				'cart_index'   => 0,
				'date_created' => current_time('mysql'),
				'expiration'   => 0,
				'parent'       => 0,
				'customer_id'  => $customer->id,
				'user_id'      => $customer->user_id,
			);
	
			$column_formats = $licenses_db->get_columns();
			$inserted       = $wpdb->insert( $licenses_db->table_name, $license_data, $column_formats );
			
			if ( false !== $inserted ) {			
				$new_license_id = $wpdb->insert_id;			
				return ['user_id' => $customer->user_id, 'customer_id' => $customer->id, 'order_id' =>$order_id, 'license_key' => $lic, 'email' => $customer->email];
			}
		}	
		
		return false;

	}
	
	public function activate_license_remote(){
	    
	    if(isset($_REQUEST['code']) && isset($_REQUEST['download_id']) && $_REQUEST['url']){
			$lic        = $_REQUEST['code'];
			$item_id    = $_REQUEST['download_id'];
			$domain     = $_REQUEST['url'];
	    }else{
	    
			return rest_ensure_response( [ 'code' => 403 , 'msg' => 'Provide license code && product information', 'next_step' => 'done' ] );
	    }
	    
		$api_params = array(
			'edd_action'  => 'activate_license',
			'license'     => $lic,
			'item_id'     => $item_id,			
			'url'         => $domain,
			'environment' => 'production',
		);
	
		// Call the custom API.
		$response = wp_remote_post(
			home_url(),
			array(
				'timeout'   => 15,
				'sslverify' => false,
				'body'      => $api_params,
			)
		);
		$message = __( 'na' );
		$code = 403;
		$license_data = [];
			// make sure the response came back okay
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
	
			if ( is_wp_error( $response ) ) {
				$message = $response->get_error_message();
				
			} else {
				$message = __( 'An error internal occurred, please try again.' );
			}
		} else {
	
			$license_data = json_decode( wp_remote_retrieve_body( $response ), true );
			
			if ( isset( $license_data['success'] ) && $license_data['success'] ) {
				$message = __( 'License Valid' );
				$code = wp_remote_retrieve_response_code( $response );		    
				
			}else{
			
				switch ( $license_data['error'] ) {
					
					case 'expired':
						$message = sprintf(
							/* translators: the license key expiration date */
							__( 'Your license key expired on %s.', 'edd-sample-plugin' ),
							date_i18n( get_option( 'date_format' ), strtotime( $license_data['expires'], current_time( 'timestamp' ) ) )
						);
						$code = 403;
						break;
	
					case 'disabled':
					case 'revoked':
						$message = __( 'Your license key has been disabled.', 'edd-sample-plugin' );
						$code = 403;
						break;
	
					case 'missing':
						$message = __( 'Invalid license.', 'edd-sample-plugin' );
						$code = 403;
						break;
	
					case 'invalid':
					case 'site_inactive':
						$message = __( 'Your license is not active for this URL.', 'edd-sample-plugin' );
						$code = 403;
						break;
	
					case 'item_name_mismatch':
						/* translators: the plugin name */
						$message = sprintf( __( 'This appears to be an invalid license key for %s.', 'edd-sample-plugin' ), EDD_WCF_PB_ITEM_NAME );
						$code = 403;
						break;
	
					case 'no_activations_left':
						$message = __( 'Your license key has reached its activation limit.', 'edd-sample-plugin' );
						$code = 403;
						break;
	
					default:	
						$message = __( 'An error internal occurred, please try again..', 'edd-sample-plugin' );
						$code = 403;
						break;
				}
			}
		}
		return rest_ensure_response( [ 'code' => $code , 'msg' => $message, 'license' => $license_data, 'next_step' => 'done' ] );	
		
	}
	
	/* 
	* Provide themeforest purchase key
	* Customer email 
	*/
	public function envatu_license_attach(){
	  
	    if(isset( $_REQUEST['code'] ))
	    {
	    
	        $code = $_REQUEST['code'];
	        
			if( $cemail = $this->is_license_already_registered($code)){	
				
				return rest_ensure_response( [ 'code' => 200 , 'msg' => 'Already resgistered with '. $cemail['email'], 'customer' => $cemail , 'next_step' => 'activate_license'] );
			}			
			
			if( isset( $_REQUEST[ 'order_id' ] ) && isset( $_REQUEST[ 'download_id' ] ) && isset( $_REQUEST[ 'email' ] )){
			
				if( $customer = $this->new_license_create($code,$_REQUEST[ 'download_id' ] , $_REQUEST[ 'order_id' ], $_REQUEST[ 'email' ])){
					return rest_ensure_response( [ 'code' => 200 , 'msg' => 'Envatu license found', 'customer' => $customer, 'next_step' => 'activate_license' ] );
				}
				
			}
			
	    }
		
		return rest_ensure_response( ['code' => 403, 'msg' => 'Provide required arguments', 'next_step' => 'done'] );
	}
	
	function IsPurchaseCodeValid($code) {
		// check cache
		$code_trsns = get_transient( 'wcfenvatu_'.$code );
		if($code_trsns){		  
			return $code_trsns;
		}
		
		if(isset($_REQUEST['author']) && is_numeric($_REQUEST['author'])){
			$personalToken = edd_get_option('wcf_edd_envatu_api_'.$_REQUEST['author'], ''); 	
		}else{
			$personalToken = edd_get_option('wcf_edd_envatu_api', ''); 	
		}
		
		
		// Surrounding whitespace can cause a 404 error, so trim it first
		$code = trim($code);	
		$rest  = [
			'code' => null,
			'msg' => 'invalid'
		];
				
		$url = "https://api.envato.com/v3/market/author/sale?code={$code}";
		$response = wp_remote_get($url, array(
			"headers" => array(
				"Authorization" => "Bearer {$personalToken}",
				"User-Agent" => "Purchase code verification script"
			)
		));
	
		if (is_wp_error($response)) {
			$rest['msg'] = 'Failed to look up purchase code';		
		}
	
		$responseCode = wp_remote_retrieve_response_code($response);
		
		$rest['code'] = $responseCode;
		if($responseCode  == 404){
			$rest['msg'] = 'Invalid purchase code';
		}elseif($responseCode  == 403){
			$rest['msg'] = 'The personal token or license code is missing invalid';
		}elseif($responseCode  == 401){
			$rest['msg'] = 'The personal token is invalid or has been deleted';
		}elseif($responseCode  == 200){
			$rest['msg'] = 'Valid Purchase Code';
		}
		
	
		$body = @json_decode(wp_remote_retrieve_body($response));
	
		if ($body === false && json_last_error() !== JSON_ERROR_NONE) {
			$rest['msg'] = 'Invalid purchase code';
		}
		
		if(isset($rest['code']) && $rest['code'] == 200){
			set_transient(  'wcfenvatu_'.$code , $rest , 4 * WEEK_IN_SECONDS );   
		}
	
		return $rest;
	}
	function wcf_register_rest_api() {
		
		register_rest_route( 'envatu/customer', '/validation', array(
			// By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			'methods'  => WP_REST_Server::READABLE,
			// Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			'callback' => [$this,'customer_get_validation'],
		) );
		
		register_rest_route( 'envatu/customer', '/order', array(
			// By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			'methods'  => WP_REST_Server::READABLE,
			// Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			'callback' =>  [$this,'wcf_create_customer_order'],
		) );
		
		register_rest_route( 'envatu/license', '/varification', array(
			// By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			'methods'  => WP_REST_Server::READABLE,
			// Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			'callback' =>  [$this,'envatu_license_varification'],
		) );
		
		register_rest_route( 'envatu/license', '/attach', array(
			// By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			'methods'  => WP_REST_Server::READABLE,
			// Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			'callback' =>  [$this,'envatu_license_attach'],
		) );
		
		register_rest_route( 'envatu/license', '/activate', array(
			// By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
			'methods'  => WP_REST_Server::READABLE,
			// Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
			'callback' =>  [$this,'activate_license_remote'],
		) );
		
		
	}
	
	
	function envatu_token_validation() {	  
		if ( !wp_verify_nonce( $_REQUEST['security'], "wcf_envatu_ext_nonce")) {
			exit("No naughty business please");
		}
		$res = [];		
		wp_send_json_success($res);
	}
	
}
