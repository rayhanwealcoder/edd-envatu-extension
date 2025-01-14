<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 * 
 * This class is used to bring your plugin to life. 
 * All the other registered classed bring features which are
 * controlled and managed by this class.
 * 
 * Within the add_hooks() function, you can register all of 
 * your WordPress related actions and filters as followed:
 * 
 * add_action( 'my_action_hook_to_call', array( $this, 'the_action_hook_callback', 10, 1 ) );
 * or
 * add_filter( 'my_filter_hook_to_call', array( $this, 'the_filter_hook_callback', 10, 1 ) );
 * or
 * add_shortcode( 'my_shortcode_tag', array( $this, 'the_shortcode_callback', 10 ) );
 * 
 * Once added, you can create the callback function, within this class, as followed: 
 * 
 * public function the_action_hook_callback( $some_variable ){}
 * or
 * public function the_filter_hook_callback( $some_variable ){}
 * or
 * public function the_shortcode_callback( $attributes = array(), $content = '' ){}
 * 
 * 
 * HELPER COMMENT END
 */

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
class Edd_Envatu_Extension_Run{

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
	 * ######################
	 * ###
	 * #### WORDPRESS HOOKS
	 * ###
	 * ######################
	 */

	/**
	 * Registers all WordPress and plugin related hooks
	 *
	 * @access	private
	 * @since	1.0
	 * @return	void
	 */
	private function add_hooks(){
	
		add_action( 'plugin_action_links_' . EDDENVATUE_PLUGIN_BASE, array( $this, 'add_plugin_action_link' ), 20 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_backend_scripts_and_styles' ), 20 );
		add_action( 'admin_bar_menu', array( $this, 'add_admin_bar_menu_items' ), 100, 1 );
		add_filter( 'edd_settings_sections_extensions', array( $this, 'add_edd_settings_section' ), 20 );
		add_filter( 'edd_settings_extensions', array( $this, 'add_edd_settings_section_content' ), 20 );
		
		add_action("wp_ajax_wcf_envatu_api_validation", [$this ,"envatu_token_validation"]);
	
	}
	
	function getTokenCode($personalToken) {	
		$special_query_results = get_transient( $personalToken );
				
		if($special_query_results){
			return $special_query_results;
		}
		$url = "https://api.envato.com/v3/market/author/sales";
		$response = wp_remote_get($url, array(
			"headers" => array(
				"Authorization" => "Bearer {$personalToken}",
				"User-Agent" => "Token verification script"
			)
		));
	
		if (is_wp_error($response)) {
			throw new Exception("Failed to look up Token");
		}
	
		$responseCode = wp_remote_retrieve_response_code($response);
		$res_msg = [
			'code' => $responseCode,
			'msg' => 'unknown msg contact developer'
		];
		
		if($responseCode == 404){
			$res_msg['msg'] = "Invalid token code";
		}elseif($responseCode == 403){
			$res_msg['msg'] ="The personal token is missing the required permission for this script";
		}elseif($responseCode == 401){
			$res_msg['msg'] = "The personal token is invalid or has been deleted";
		}elseif($responseCode == 200){
			$res_msg['msg'] = "Valid Token";
		}
		
		if($responseCode == 200){
			set_transient( $personalToken, $res_msg , 24 * HOUR_IN_SECONDS );
		}
		return $res_msg;
	}
	
	function envatu_token_validation() {	  
		if ( !wp_verify_nonce( $_REQUEST['security'], "wcf_envatu_ext_nonce")) {
			exit("No naughty business please");
		}
		
		$res = $this->getTokenCode($_REQUEST['token']);
		wp_send_json_success($res);
	}
	
	

	/**
	 * ######################
	 * ###
	 * #### WORDPRESS HOOK CALLBACKS
	 * ###
	 * ######################
	 */

	/**
	* Adds action links to the plugin list table
	*
	* @access	public
	* @since	1.0
	*
	* @param	array	$links An array of plugin action links.
	*
	* @return	array	An array of plugin action links.
	*/
	public function add_plugin_action_link( $links ) {

		$links['our_shop'] = sprintf( '<a href="%s" title="Custom Link" style="font-weight:700;">%s</a>', 'https://crowdytheme.com', __( 'Shop', 'edd-envatu-extension' ) );

		return $links;
	}

	/**
	 * Enqueue the backend related scripts and styles for this plugin.
	 * All of the added scripts andstyles will be available on every page within the backend.
	 *
	 * @access	public
	 * @since	1.0
	 *
	 * @return	void
	 */
	public function enqueue_backend_scripts_and_styles() {
        if(isset($_GET['section']) && $_GET['section'] == 'edd-envatu-extension'){
			wp_enqueue_style( 'eddenvatue-backend-styles', EDDENVATUE_PLUGIN_URL . 'core/includes/assets/css/backend-styles.css', array(), EDDENVATUE_VERSION, 'all' );
			wp_enqueue_script( 'eddenvatue-backend-script', EDDENVATUE_PLUGIN_URL . 'core/includes/assets/js/backend-script.js', array('jquery'), EDDENVATUE_VERSION, 'all' );
			
			wp_localize_script( 'eddenvatue-backend-script', 'wcf_envatu', array( 
			'nonce' => wp_create_nonce("wcf_envatu_ext_nonce"),
			'ajax_url' => admin_url( 'admin-ajax.php' )
			)
			);
        }	
		
		
	}

	/**
	 * Add a new menu item to the WordPress topbar
	 *
	 * @access	public
	 * @since	1.0
	 *
	 * @param	object $admin_bar The WP_Admin_Bar object
	 *
	 * @return	void
	 */
	public function add_admin_bar_menu_items( $admin_bar ) {

		$admin_bar->add_menu( array(
			'id'		=> 'edd-envatu-extension-id', // The ID of the node.
			'title'		=> __( 'Edd Envatu License', 'edd-envatu-extension' ), // The text that will be visible in the Toolbar. Including html tags is allowed.
			'parent'	=> false, // The ID of the parent node.
			'href'		=> '#', // The ‘href’ attribute for the link. If ‘href’ is not set the node will be a text node.
			'group'		=> false, // This will make the node a group (node) if set to ‘true’. Group nodes are not visible in the Toolbar, but nodes added to it are.
			'meta'		=> array(
				'title'		=> __( 'Edd Envatu License', 'edd-envatu-extension' ), // The title attribute. Will be set to the link or to a div containing a text node.
				'target'	=> '_blank', // The target attribute for the link. This will only be set if the ‘href’ argument is present.
				'class'		=> 'edd-envatu-extension-class', // The class attribute for the list item containing the link or text node.
				'html'		=> false, // The html used for the node.
				'rel'		=> false, // The rel attribute.
				'onclick'	=> false, // The onclick attribute for the link. This will only be set if the ‘href’ argument is present.
				'tabindex'	=> false, // The tabindex attribute. Will be set to the link or to a div containing a text node.
			),
		));

		$admin_bar->add_menu( array(
			'id'		=> 'edd-envatu-extension-sub-id',
			'title'		=> __( 'License', 'edd-envatu-extension' ),
			'parent'	=> 'edd-envatu-extension-id',
			'href'		=> 'https://themecrowdy.com/wp-admin/edit.php?post_type=download&page=edd-licenses',
			'group'		=> false,
			'meta'		=> array(
				'title'		=> __( 'My sub menu title', 'edd-envatu-extension' ),
				'target'	=> '_blank',
				'class'		=> 'edd-envatu-extension-sub-class',
				'html'		=> false,    
				'rel'		=> false,
				'onclick'	=> false,
				'tabindex'	=> false,
			),
		));

	}

	/**
	 * Add the custom settings section under
	 * Downloads -> Settings -> Extensions
	 *
	 * @access	public
	 * @since	1.0
	 *
	 * @param	array	$sections	The currently registered EDD settings sections
	 *
	 * @return	void
	 */
	public function add_edd_settings_section( $sections ) {
		
		$sections['edd-envatu-extension'] = __( EDDENVATUE()->settings->get_plugin_name(), 'edd-envatu-extension' );

		return $sections;
	}

	/**
	 * Add the custom settings section content
	 *
	 * @access	public
	 * @since	1.0
	 *
	 * @param	array	$settings	The currently registered EDD settings for all registered extensions
	 *
	 * @return	array	The extended settings 
	 */
	public function add_edd_settings_section_content( $settings ) {
	
		$customer_link        = home_url().'/wp-json/envatu/customer/validation?email=rayhanuddinnew2024@gmail.com';
		$order_create_link    = home_url().'/wp-json/envatu/customer/order?email=rayhanuddinnew2024@gmail.com';
		$license_varification = home_url().'/wp-json/envatu/license/varification?email=rayhanuddinnew2024@gmail.com&code=';
		$license_attach       = home_url().'/wp-json/envatu/license/attach?email=rayhanuddinnew2024@gmail.com&code=';
		
		// Your settings reamain registered as they were in EDD Pre-2.5
		$custom_settings = array(
			array(
				'id'   => 'wcf_edd_envatu_header',
				'name' => '<strong>' . __( EDDENVATUE()->settings->get_plugin_name() . 'Settings', 'edd-envatu-extension' ) . '</strong>',
				'desc' => '',
				'type' => 'header',
				'size' => 'regular'
			),		
			array(
				'id'    => 'wcf_edd_envatu_api',
				'name'  => __( 'Envatu Author Token', 'edd-envatu-extension' ),
				'desc'  => '
					<div> Go to <a href="https://build.envato.com/create-token/">https://build.envato.com/create-token/</a> 
				<ul> 
					<li>1. Check View and search Envato sites (selected by default) </li>
				<li> 2. View the user’s items’ sales history</li>
					
				</ul>
				<br/>		
				</div>',
				'type'  => 'text',
				'std'   => ''
			),
			
		
			
			array(
				'id'    => 'wcf_edd_envatu_order_create',
				'name'  => __( 'Order Create?', 'edd-envatu-extension' ),
				'desc'  => 'Create order with license',	
				'type'  => 'checkbox'
				
			),
			
			array(
				'id'    => 'wcf_edd_envatu_hideen',
				'name'  => __( 'Api List', 'edd-envatu-extension' ),
				'desc'  => "<p>Customer Validation -> $customer_link</p>
				  <p> Customer Order -> $order_create_link</p>
				  <p> License Varification -> $license_varification</p>
				  <p> License Attachment -> $license_attach</p>",
				'type'  => 'checkbox'
				
			),
			
			array(
				'id'    => 'wcf_edd_envatu_api_2',
				'name'  => __( 'Envatu Author 2 Token (Optional)', 'edd-envatu-extension' ),
				'desc'  => '
					<div> Go to <a href="https://build.envato.com/create-token/">https://build.envato.com/create-token/</a> 
				<ul> 
					<li>1. Check View and search Envato sites (selected by default) </li>
				<li> 2. View the user’s items’ sales history</li>
					
				</ul>
				<br/>	
				<p> use envatu/license/varification?author=2 after url endpoint as query param </p>
				</div>',
				'type'  => 'text',
				'std'   => ''
			),
			
			array(
				'id'    => 'wcf_edd_envatu_api_3',
				'name'  => __( 'Envatu Author 3 Token (Optional)', 'edd-envatu-extension' ),
				'desc'  => '
					<div> Go to <a href="https://build.envato.com/create-token/">https://build.envato.com/create-token/</a> 
				<ul> 
					<li>1. Check View and search Envato sites (selected by default) </li>
				<li> 2. View the user’s items’ sales history</li>
					
				</ul>
				<p> use envatu/license/varification?author=3 url endpoint as query param </p>
				<br/>		
				</div>',
				'type'  => 'text',
				'std'   => ''
			),
			
		);

		// If EDD is at version 2.5 or later...
		if ( version_compare( EDD_VERSION, 2.5, '>=' ) ) {
			$custom_settings = array( 'edd-envatu-extension' => $custom_settings );
		}

		return array_merge( $settings, $custom_settings );
	}

}