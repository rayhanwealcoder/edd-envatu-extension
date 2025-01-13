<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 * 
 * This class contains all of the plugin related settings.
 * Everything that is relevant data and used multiple times throughout 
 * the plugin.
 * 
 * To define the actual values, we recommend adding them as shown above
 * within the __construct() function as a class-wide variable. 
 * This variable is then used by the callable functions down below. 
 * These callable functions can be called everywhere within the plugin 
 * as followed using the get_plugin_name() as an example: 
 * 
 * EDDENVATUE->settings->get_plugin_name();
 * 
 * HELPER COMMENT END
 */

/**
 * Class Edd_Envatu_Extension_Settings
 *
 * This class contains all of the plugin settings.
 * Here you can configure the whole plugin data.
 *
 * @package		EDDENVATUE
 * @subpackage	Classes/Edd_Envatu_Extension_Settings
 * @author		Rayhan
 * @since		1.0
 */
class Edd_Envatu_Extension_Settings{

	/**
	 * The plugin name
	 *
	 * @var		string
	 * @since   1.0
	 */
	private $plugin_name;

	/**
	 * Our Edd_Envatu_Extension_Settings constructor 
	 * to run the plugin logic.
	 *
	 * @since 1.0
	 */
	function __construct(){

		$this->plugin_name = EDDENVATUE_NAME;
		
		add_action('edd_sl_license_before_licensed_urls', [$this, 'web_hook_licensed_urls']);
	}
	
	public function web_hook_licensed_urls($license_id){
		$license = edd_software_licensing()->get_license( $license_id );
		
		?>
		<script>
			jQuery(document).on('click', '.wcf_product_site_action', function(e){
				e.preventDefault();
			
				
				jQuery.ajax({
                    type: "get",
                    dataType: "json",
                    url: jQuery(this).attr('href'),                   
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        jQuery(this).text('Check Site');
                    },
                    success: function (response) {
						jQuery(this).text('Check Site');
                    }
                });
			});
		</script>
		<h2>Send Request to user site</h2>
		<table class="wp-list-table widefat striped licensed-urls">
			<thead>
				<tr>
					<th><?php _e( 'Site URL', 'edd_sl' ); ?></th>
					<th><?php _e( 'Deactive', 'edd_sl' ); ?></th>
					<th><?php _e( 'Active', 'edd_sl' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php
				$sites = $license->get_activations();
				if( ! empty( $sites ) ) :
					$i = 0;
					foreach( $sites as $site ) : ?>
						<?php
					
						$site_url = strpos( $site->site_name, 'http' ) !== false ? $site->site_name : 'http://' . $site->site_name; ?>
						<tr class="row<?php if( $i % 2 == 0 ) { echo ' alternate'; } ?>">
							<td><a href="<?php echo $site_url; ?>" target="_blank"><?php echo $site->site_name; ?></a></td>
							<td>
							<a class="wcf_product_site_action" href="<?php echo esc_url(add_query_arg(['wcf_product_deactivation_action' => 'deactivate'],$site_url) ); ?>"><?php _e( 'Send Deactive Request', 'edd_sl' ); ?></a>
							
							</td>
							<td>
							
							<a class="wcf_product_site_action" href="<?php echo esc_url(add_query_arg(['wcf_product_deactivation_action' => 'activate'],$site_url) ); ?>"><?php _e( 'Send Active Request', 'edd_sl' ); ?></a>
							</td>
						</tr>
						<?php
						$i++;
					endforeach;
				else : ?>
					<tr class="row"><td colspan="2"><?php esc_html_e( 'This license has not been activated on any sites.', 'edd_sl' ); ?></td></tr>
				<?php endif; ?>				
			</tbody>
		</table>
		<?php
	}

	/**
	 * ######################
	 * ###
	 * #### CALLABLE FUNCTIONS
	 * ###
	 * ######################
	 */

	/**
	 * Return the plugin name
	 *
	 * @access	public
	 * @since	1.0
	 * @return	string The plugin name
	 */
	public function get_plugin_name(){
		return apply_filters( 'EDDENVATUE/settings/get_plugin_name', $this->plugin_name );
	}
}
