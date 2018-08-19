<?php
/**
 * CYOA_Custom_Post
 *
 * @package CYOA
 * @subpackage CYOA/includes
 * @since 1.0.0
 */

$cyoa_custom_post = new CYOA_Custom_Post();

/**
 * Create a Cave your own adventure custom post type.
 *
 * @author Ramon
 **/
class CYOA_Custom_Post {
	/**
	 * Programmatic name of post type
	 * ( For Database )
	 *
	 * @var string
	 **/
	private $post_type = 'cyoa';

	/**
	 * Slug and rest base
	 *
	 * @var string
	 **/
	private $rest_base = 'cave-your-own-adventure';

	/**
	 * Programmatic name for support categories
	 *
	 * @var string
	 **/
	private $post_category = 'cyoa_category';

	/**
	 * Programmatic name for support tags
	 *
	 * @var string
	 **/
	private $post_tag = 'cyoa_tag';

	/**
	 * Default constructor that sets up the object
	 **/
	public function __construct() {
		// Register post types.
		add_action( 'init', array( $this, 'register_post_type' ) );

		// Register taxonomies.
		add_action( 'init', array( $this, 'register_taxonomy' ) );

		add_action( 'admin_menu' , array( $this, 'add_settings_page' ) );

		add_action('add_meta_boxes', array( $this, 'add_meta' ));

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
			'description'       => 'A starter post for a cave your own adventure!',
			'public'            => true,
			'supports'          => array( 'title', 'editor' ),
			'labels'            => $labels,
			'hierarchical'      => true,
			'has_archive'       => true,
			'rewrite'           => array(
				'slug'       => $this->rest_base,
				'with_front' => false,
			),
			'show_ui'           => true,
			'taxonomies'        => array( $this->post_category, $this->post_tag ),
			'show_in_menu'      => true,
			'show_in_nav_menus' => true,
			'menu_icon'         => 'dashicons-book-alt',
			// To show Gutenberg: https://core.trac.wordpress.org/ticket/42785
			'show_in_rest'      => true,
			'rest_base' => $this->rest_base,
			'template' => array(
				array( 'core/paragraph', array(
					'placeholder' => 'Start the story...',
				) ),
				array( 'cave-your-own-adventure/block', array() ),
			),
		);

		register_post_type( $this->post_type, $args );
	}

	/**
	 * Performs registration of post taxonomies
	 **/
	public function register_taxonomy() {

		$category = array(
			'hierarchical'      => true,
			'show_ui'           => true,
			'show_admin_column' => true,
		);

		register_taxonomy( $this->post_category, array( $this->post_type ), $category );

		$tag = array(
			'hierarchical'      => false,
			'show_ui'           => true,
			'show_admin_column' => true,
		);
		register_taxonomy( $this->post_tag, array( $this->post_type ), $tag );
	}

	public function add_settings_page() {
		add_submenu_page( 'edit.php?post_type=' . $this->post_type, 'Settings', 'Settings', 'manage_options', 'cyoa-settings', array( $this, 'cyoa_options_display' ) );

	}

	public function cyoa_options_display() {
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
		echo '<h2>My Custom Submenu Page</h2>';
		echo '</div>';
	}

	public function add_meta() {
		add_meta_box(
			'wporg_box_id',           // Unique ID
			'Custom Meta Box Title',  // Box title
			array( $this, 'wporg_custom_box_html' ),  // Content callback, must be of type callable
			$this->post_type                   // Post type
		);
	}


	public function wporg_custom_box_html() {
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
		echo '<h2>My Custom Submenu Page</h2>';
		echo '</div>';
	}

} // end class


