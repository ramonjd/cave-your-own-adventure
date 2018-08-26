<?php

global $post;

$parent_id = wp_get_post_parent_id( $post->ID );


$args = array(
	'post_parent' => $parent_id ? $parent_id : $post->ID,
	'post_type'   => $post->post_type,
	'numberposts' => -1,
	'post_status' => 'any'
);

$children = get_children( $args );

echo '<p>Parent: ' . $parent_id . '</p>';
foreach( $children as $child ) {

	$content = apply_filters('the_content', $child->post_content );
	var_dump( $content );
	echo '<p>Child: ' . $child->ID . '</p>';
}


echo '<p>This should be in the Gutenberg cave-your-own-adventure/block-edit. This is where we are going to show which pages link TO THIS PAGE, Also the home page and hierarchy tree</p>';
