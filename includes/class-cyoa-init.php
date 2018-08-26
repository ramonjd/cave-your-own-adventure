<?php

require_once plugin_dir_path( __FILE__ ) . '/class-cyoa-custom-post.php';
require_once plugin_dir_path( __FILE__ ) . '../block/index.php';





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
