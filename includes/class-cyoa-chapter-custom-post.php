<?php
/**
 * CYOA_Custom_Post
 *
 * @package CYOA
 * @subpackage CYOA/includes
 * @since 1.0.0
 */

$cyoa_custom_post = new CYOA_Chapter_Custom_Post();

/**
 * Create a Cave your own adventure custom post type.
 *
 * @author Ramon
 **/
class CYOA_Chapter_Custom_Post {
	/**
	 * Programmatic name of post type
	 * ( For Database )
	 *
	 * @var string
	 **/
	private $post_type = 'cyoa_chapter';


	/**
	 * Default constructor that sets up the object
	 **/
	public function __construct() {
		// Register post types.
		add_action( 'init', array( $this, 'register_post_type' ) );
	}

	/**
	 * Performs registration of post type
	 **/
	public function register_post_type() {
		$labels = array(
			'name'               => 'Cave your own adventure',
			'singular_name'      => 'Story',
			'add_new'            => 'New Story',
			'add_new_item'       => 'New Story',
			'edit_item'          => 'Edit Story',
			'new_item'           => 'New Story',
			'view_item'          => 'View Stories',
			'search_items'       => 'Search Stories',
			'not_found'          => 'No Stories found',
			'not_found_in_trash' => 'No Stories in Trash',
		);

		$args = array(
			'description'       => 'A chapter page for Cave your own adventure',
			'public'            => true,
			'supports'          => array( 'title', 'editor', 'page-attributes' ),
			//'labels'            => $labels,
			'hierarchical'      => true,
			'has_archive'       => false,
			'show_ui'           => true,
			'show_in_menu'      => true,
			'show_in_nav_menus' => true,
			'rest_base' => 'cyoa-chapter',
			// To show Gutenberg: https://core.trac.wordpress.org/ticket/42785
			'show_in_rest'      => true,
			'template' => array(
				array( 'core/paragraph', array(
					'placeholder' => 'Continue the story...',
				) ),
				array( 'cave-your-own-adventure/block', array() ),
			),
		);

		register_post_type( $this->post_type, $args );
	}


} // end class


