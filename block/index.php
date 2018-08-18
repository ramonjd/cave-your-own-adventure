<?php
/**
 * BLOCK: Profile
 *
 * Gutenberg Custom Profile Block assets.
 *
 * @since   1.0.0
 * @package CYOA
 */

namespace CYOA;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check for WP_DEBUG. When running in debug mode it will pull assets from Webpack's build folder.
 */
function wp_debug() {
	return defined( 'WP_DEBUG' ) && WP_DEBUG;
}

/**
 * Enqueue the block's assets for the editor.
 *
 * `wp-blocks`: Includes block type registration and related functions.
 * `wp-element`: Includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function cyoa_block_assets() {

	$version = CYOA_VERSION;

	// Scripts.
	$dependencies = array(
		'wp-blocks',    // Provides useful functions and components for extending the editor.
		'wp-i18n',      // Provides localization functions.
		'wp-element',   // Provides React.Component.
		'wp-components', // Provides many prebuilt components and controls.
	);

	$asset_path = '';

	if ( wp_debug() ) {
		$asset_path = '../build/';
	}

	wp_register_script(
		'cyoa-script',
		plugins_url( $asset_path . 'editor.js', __FILE__ ),
		$dependencies,
		$version
	);

	wp_register_script(
		'cyoa-frontend-script',
		plugins_url( $asset_path . 'frontend.js', __FILE__ ),
		array(),
		$version
	);

	// Styles.
	// Webpack bundles the css in our build assets,
	// so we don't need to register styles in dev mode.
	if ( ! wp_debug() ) {
		wp_register_style(
			'cyoa-editor-style',
			plugins_url( $asset_path . 'editor.css', __FILE__ ),
			array( 'wp-edit-blocks' ),
			$version
		);

		wp_register_style(
			'cyoa-frontend-style',
			plugins_url( $asset_path . 'frontend.css', __FILE__ ),
			array( 'wp-blocks' ),
			$version
		);
	}

	register_block_type('cave-your-own-adventure/block', array(
		'editor_script' => 'cyoa-script',
		'editor_style' => 'cyoa-editor-style',
		'script' => 'cyoa-frontend-script',
		'style' => 'cyoa-frontend-style',
	));
}

// Hook: Editor assets.
add_action( 'init', 'CYOA\cyoa_block_assets' );
