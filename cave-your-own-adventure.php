<?php
/**
 * Cave your own adventure
 *
 * @package     CYOA
 * @link        https://github.com/ramonjd/cave-your-own-adventure
 * @since       1.0.0
 *
 * @wordpress-plugin
 * Plugin Name: Cave your own adventure
 * Plugin URI:  https://github.com/ramonjd/cave-your-own-adventure
 * Description: A Gutenberg plugin. Create your own cave and choose your own adventure!
 * Version:     1.0.0
 * Author:      Ramon
 * Author URI:  https://github.com/ramonjd/
 * Text Domain: cyoa
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'WPINC' ) ) {
	exit;
}

/**
 * Define global constants.
 *
 * @since 1.0.0
 */
// Plugin version.
if ( ! defined( 'CYOA_VERSION' ) ) {
	define( 'CYOA_VERSION', '1.0.0' );
}

if ( ! defined( 'CYOA_NAME' ) ) {
	define( 'CYOA_NAME', trim( dirname( plugin_basename( __FILE__ ) ), '/' ) );
}


// TODO: create setup/tear down plugin class
// do this: https://codex.wordpress.org/Function_Reference/register_post_type#Flushing_Rewrite_on_Activation

/* Filter the single_template with our custom function*/
add_filter( 'single_template', 'my_custom_template' );

function my_custom_template( $single ) {

	global $post;

	/* Checks for single template by post type */
	if ( 'cyoa' === $post->post_type ) {
		if ( file_exists( plugin_dir_path( __FILE__ ) . '/templates/single-cyoa.php' ) ) {
			return plugin_dir_path( __FILE__ ) . '/templates/single-cyoa.php';
		}
	}

	return $single;

}

require_once plugin_dir_path( __FILE__ ) . '/includes/class-cyoa-custom-post.php';
require_once plugin_dir_path( __FILE__ ) . '/block/index.php';




