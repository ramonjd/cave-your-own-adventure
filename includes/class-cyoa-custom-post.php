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
	 * Programmatic name for meta box
	 *
	 * @var string
	 **/
	private $meta_box_id = 'cyoa_meta_box';

	/**
	 * Default constructor that sets up the object
	 **/
	public function __construct() {
		// Register post types.
		add_action( 'init', array( $this, 'register_post_type' ) );

		// Register taxonomies.
		add_action( 'init', array( $this, 'register_taxonomy' ) );

		//add_action( 'admin_menu' , array( $this, 'add_settings_page' ) );

		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );

	}

	/**
	 * Performs registration of post type
	 **/
	public function register_post_type() {
		$labels = array(
			'name'               => 'Cave your own adventure',
			'all_items'          => 'All stories',
			'singular_name'      => 'Story',
			'add_new'            => 'New story',
			'add_new_item'       => 'New story',
			'edit_item'          => 'Edit story',
			'new_item'           => 'New story',
			'view_item'          => 'View story',
			'search_items'       => 'Search stories',
			'not_found'          => 'No stories found',
			'not_found_in_trash' => 'No stories in trash',
		);

		$args = array(
			'description'       => 'A starter post for a cave your own adventure!',
			'public'            => true,
			'supports'          => array( 'title', 'editor', 'page-attributes' ),
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
			// To show Gutenberg: https://core.trac.wordpress.org/ticket/42785 .
			'show_in_rest'      => true,
			'rest_base'         => $this->rest_base,
			'template'          => array(
				array(
					'core/paragraph',
					array( 'placeholder' => 'The adventure awaits...' ),
				),
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
// Settings page: do we need this?
// Possible settings:
// UI effects: page turning
// Export single story to HTML?
//
/*	public function add_settings_page() {
		add_submenu_page( 'edit.php?post_type=' . $this->post_type, 'Settings', 'Settings', 'manage_options', 'cyoa-settings', array( $this, 'cyoa_options_display' ) );

	}

	public function cyoa_options_display() {
		echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
		echo '<h2>My Custom Submenu Page</h2>';
		echo '</div>';
	}*/

	/**
	 * Sets up post meta box
	 **/
	public function add_meta_box() {
		add_meta_box(
			$this->meta_box_id,
			__( 'Story details', 'textdomain' ),
			array( $this, 'cyoa_meta_box_template' ),
			$this->post_type
		);
	}

	/**
	 * Sets up post meta box
	 **/
	public function cyoa_meta_box_template() {
		require_once plugin_dir_path( __FILE__ ) . '../templates/meta-box-cyoa.php';
	}
}


