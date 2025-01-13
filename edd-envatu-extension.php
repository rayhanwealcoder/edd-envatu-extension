<?php
/**
 * Edd Envatu Extension
 *
 * @package       EDDENVATUE
 * @author        Rayhan
 * @version       1.0
 *
 * @wordpress-plugin
 * Plugin Name:   Edd Envatu Extension
 * Plugin URI:    crowdytheme.com
 * Description:   This is some demo short description...
 * Version:       1.0
 * Author:        Rayhan
 * Author URI:    https://your-author-domain.com
 * Text Domain:   edd-envatu-extension
 * Domain Path:   /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * HELPER COMMENT START
 * 
 * This file contains the main information about the plugin.
 * It is used to register all components necessary to run the plugin.
 * 
 * The comment above contains all information about the plugin 
 * that are used by WordPress to differenciate the plugin and register it properly.
 * It also contains further PHPDocs parameter for a better documentation
 * 
 * The function EDDENVATUE() is the main function that you will be able to 
 * use throughout your plugin to extend the logic. Further information
 * about that is available within the sub classes.
 * 
 * HELPER COMMENT END
 */

// Plugin name
define( 'EDDENVATUE_NAME',			'Edd Envatu Extension' );

// Plugin version
define( 'EDDENVATUE_VERSION',		'1.0' );

// Plugin Root File
define( 'EDDENVATUE_PLUGIN_FILE',	__FILE__ );

// Plugin base
define( 'EDDENVATUE_PLUGIN_BASE',	plugin_basename( EDDENVATUE_PLUGIN_FILE ) );

// Plugin Folder Path
define( 'EDDENVATUE_PLUGIN_DIR',	plugin_dir_path( EDDENVATUE_PLUGIN_FILE ) );

// Plugin Folder URL
define( 'EDDENVATUE_PLUGIN_URL',	plugin_dir_url( EDDENVATUE_PLUGIN_FILE ) );

/**
 * Load the main class for the core functionality
 */
require_once EDDENVATUE_PLUGIN_DIR . 'core/class-edd-envatu-extension.php';

/**
 * The main function to load the only instance
 * of our master class.
 *
 * @author  Rayhan
 * @since   1.0
 * @return  object|Edd_Envatu_Extension
 */
function EDDENVATUE() {
	return Edd_Envatu_Extension::instance();
}

EDDENVATUE();
