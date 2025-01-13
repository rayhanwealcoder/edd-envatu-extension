=== Edd Envatu Extension ===
Author URI: https://your-author-domain.com
Plugin URI: crowdytheme.com
Donate link: 
Contributors: 
Tags: 
Requires at least: 
Tested up to: 
Requires PHP: 
Stable tag: 1.0

        `    public function wcf_user_guide(){   
    
        if ( !wp_verify_nonce( $_REQUEST['nonce'] , "wcf_user_guider_helo_secure" ) ) {
            exit("No naughty business please");
        }        
        $code = isset($_REQUEST['code']) ? sanitize_text_field( $_REQUEST['code'] ) : get_option('helo_lic_Key');
        $user_submitted = isset($_REQUEST['user_submitted']) ? sanitize_text_field( $_REQUEST['user_submitted'] ) : false;
        $email = isset($_REQUEST['email']) ? sanitize_email( $_REQUEST['email'] ) : get_option('admin_email');
        if($user_submitted == 'no'){
            wp_send_json_success( [ 'msg' => get_option($this->theme_slug . '_license_key_status') , 'code' => get_option('helo_lic_Key'), 'email' => get_option('helo_lic_email') !='' ? get_option('helo_lic_email'): get_option('admin_email')] );
        }
        $url = add_query_arg( array(
            'edd_action' => 'check_license',
            'item_id' => HELO_PRODUCT_ID,
            'license' =>  $code,
        ), HELO_PRODUCT_DOMAIN );
	
		$args = [
			'sslverify'   => false,
			'timeout'     => 120,
			'redirection' => 5,
			'cookies'     => array(),
			'headers'     => array(
				'Accept' => 'application/json',
			)
		];

		$response = wp_remote_get( $url, $args );

		if ( ( ! is_wp_error( $response ) ) && ( 200 === wp_remote_retrieve_response_code( $response ) ) ) {
			$responseBody = json_decode( $response['body'] );
			if ( json_last_error() === JSON_ERROR_NONE ) {				
				if(isset($responseBody->success)){
				    if($user_submitted == 'yes'){
                        update_option( $this->theme_slug . '_license_key_status', $responseBody->license);
                        update_option( $this->theme_slug . '_license_key',$code );
                        update_option( 'helo_lic_Key',$code );    
                        $this->update_readme($code, $email, $responseBody->license);
                        if(isset($_REQUEST['email'])){                        
                            update_option( 'helo_lic_email',$email );  
                        }
                                             
                    }
					wp_send_json_success( [ 
					'msg' => $responseBody->license , 
					'code' => $code, 
					'email' => get_option('admin_email')
					] );
				} else {
					wp_send_json_error( [ 'msg' => esc_html__( 'Contact Author', 'helo' ) ] );
				}

			}
		}
		wp_send_json_error( [ 'msg' => esc_html__( 'Unknown error', 'helo' ) ] );
        wp_die();
    }`


== Changelog ==

= 1.0: October 7, 2024 =
* Birthday of Edd Envatu Extension
