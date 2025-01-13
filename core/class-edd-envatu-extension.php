<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 * 
 * This is the main class that is responsible for registering
 * the core functions, including the files and setting up all features. 
 * 
 * To add a new class, here's what you need to do: 
 * 1. Add your new class within the following folder: core/includes/classes
 * 2. Create a new variable you want to assign the class to (as e.g. public $helpers)
 * 3. Assign the class within the instance() function ( as e.g. self::$instance->helpers = new Edd_Envatu_Extension_Helpers();)
 * 4. Register the class you added to core/includes/classes within the includes() function
 * 
 * HELPER COMMENT END
 */

if ( ! class_exists( 'Edd_Envatu_Extension' ) ) :

	/**
	 * Main Edd_Envatu_Extension Class.
	 *
	 * @package		EDDENVATUE
	 * @subpackage	Classes/Edd_Envatu_Extension
	 * @since		1.0
	 * @author		Rayhan
	 */
	final class Edd_Envatu_Extension {

		/**
		 * The real instance
		 *
		 * @access	private
		 * @since	1.0
		 * @var		object|Edd_Envatu_Extension
		 */
		private static $instance;

		/**
		 * EDDENVATUE helpers object.
		 *
		 * @access	public
		 * @since	1.0
		 * @var		object|Edd_Envatu_Extension_Helpers
		 */
		public $helpers;

		/**
		 * EDDENVATUE settings object.
		 *
		 * @access	public
		 * @since	1.0
		 * @var		object|Edd_Envatu_Extension_Settings
		 */
		public $settings;

		/**
		 * Throw error on object clone.
		 *
		 * Cloning instances of the class is forbidden.
		 *
		 * @access	public
		 * @since	1.0
		 * @return	void
		 */
		public function __clone() {
			_doing_it_wrong( __FUNCTION__, __( 'You are not allowed to clone this class.', 'edd-envatu-extension' ), '1.0' );
		}

		/**
		 * Disable unserializing of the class.
		 *
		 * @access	public
		 * @since	1.0
		 * @return	void
		 */
		public function __wakeup() {
			_doing_it_wrong( __FUNCTION__, __( 'You are not allowed to unserialize this class.', 'edd-envatu-extension' ), '1.0' );
		}

		/**
		 * Main Edd_Envatu_Extension Instance.
		 *
		 * Insures that only one instance of Edd_Envatu_Extension exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @access		public
		 * @since		1.0
		 * @static
		 * @return		object|Edd_Envatu_Extension	The one true Edd_Envatu_Extension
		 */
		public static function instance() {
		
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Edd_Envatu_Extension ) ) {
			
				self::$instance					= new Edd_Envatu_Extension;
				self::$instance->base_hooks();
				self::$instance->includes();
				self::$instance->helpers		= new Edd_Envatu_Extension_Helpers();
				self::$instance->settings		= new Edd_Envatu_Extension_Settings();

				//Fire the plugin logic
				new Edd_Envatu_Extension_Run();
				new Edd_Envatu_Rest_Api();
				/**
				 * Fire a custom action to allow dependencies
				 * after the successful plugin setup
				 */
				do_action( 'EDDENVATUE/plugin_loaded' );
			}

			return self::$instance;
		}

		/**
		 * Include required files.
		 *
		 * @access  private
		 * @since   1.0
		 * @return  void
		 */
		private function includes() {
			require_once EDDENVATUE_PLUGIN_DIR . 'core/includes/classes/class-edd-envatu-extension-helpers.php';
			require_once EDDENVATUE_PLUGIN_DIR . 'core/includes/classes/class-edd-envatu-extension-settings.php';

			require_once EDDENVATUE_PLUGIN_DIR . 'core/includes/classes/class-edd-envatu-extension-run.php';
			require_once EDDENVATUE_PLUGIN_DIR . 'core/includes/classes/class-edd-envatu-api.php';
		}

		/**
		 * Add base hooks for the core functionality
		 *
		 * @access  private
		 * @since   1.0
		 * @return  void
		 */
		private function base_hooks() {
			add_action( 'plugins_loaded', array( self::$instance, 'load_textdomain' ) );
		}

		/**
		 * Loads the plugin language files.
		 *
		 * @access  public
		 * @since   1.0
		 * @return  void
		 */
		public function load_textdomain() {
			load_plugin_textdomain( 'edd-envatu-extension', FALSE, dirname( plugin_basename( EDDENVATUE_PLUGIN_FILE ) ) . '/languages/' );
		}

	}

endif; // End if class_exists check.