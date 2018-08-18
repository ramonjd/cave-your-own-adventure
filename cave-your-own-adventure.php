<?php
/**
 *
 * @link 
 * @since 1.0.0
 * @package CYOA
 *
 * Plugin Name: Cave your own adventure
 * Plugin URI: 
 * Description: Create your own cave and choose your own adventure!
 * Author: Ramon
 * Author URI: 
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define global constants.
 *
 * @since 1.0.0
 */
// Plugin version.
if ( ! defined( 'CYOA_VERSION' ) ) {
	define( 'CYOA_VERSION', '1.2' );
}

if ( ! defined( 'CYOA_NAME' ) ) {
	define( 'CYOA_NAME', trim( dirname( plugin_basename( __FILE__ ) ), '/' ) );
}

if ( ! defined( 'CYOA_DIR' ) ) {
	define( 'CYOA_DIR', WP_PLUGIN_DIR . '/' . CYOA_NAME );
}

if ( ! defined( 'CYOA_URL' ) ) {
	define( 'CYOA_URL', WP_PLUGIN_URL . '/' . CYOA_NAME );
}

/**
 * BLOCK: Profile Block.
 */
require_once( CYOA_DIR . '/block/index.php' );