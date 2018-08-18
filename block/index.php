<?php

/**
 * Enqueue the block's assets for the editor.
 *
 * @since 1.0.0
 */
function cyoa_enqueue_block_editor_assets() {
	// Scripts.
	wp_register_script(
		'cave-your-own-adventure-block',
		plugins_url( 'block/cyoa-block.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block/cyoa-block.js' ) // filemtime gets file modification time.
	);

	// Styles.
	wp_enqueue_style(
		'cyoa-block-editor',
		plugin_dir_url( __FILE__ ) . 'assets/css/editor.css',
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/editor.css' )
	);
}

/**
 * Enqueue the block's assets for the frontend.
 *
 * @since 1.0.0
 */
function cyoa_enqueue_block_assets() {
	wp_enqueue_style(
		'cyoa-block-frontend',
		plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
		array( 'wp-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/style.css' )
	);
}

add_action( 'enqueue_block_editor_assets', 'cyoa_enqueue_block_assets' );



/*

register_block_type( 'gutenberg-boilerplate-es5/hello-world-step-01', array(
	'editor_script' => 'gutenberg-boilerplate-es5-step01',
) );
add_action( 'init', 'gutenberg_boilerplate_block' );*/