<?php
/**
 * ------------------------------------------------------------------------
 * Theme's Taxonomies
 * ------------------------------------------------------------------------
 * This file is for registering your theme post taxonomies. Taxonomies
 * allow users to easily categories content.
 */

if ( ! function_exists( 'lj_register_portfolio_entry_status_taxonomy' ) ) {
	/**
	 * Registers a `team` custom post type.
	 *
	 * @todo Change function prefix to your textdomain.
	 * @todo Update prefix in the hook function and if statement.
	 *
	 * @return void
	 */
	function lj_register_portfolio_entry_status_taxonomy() {
		register_taxonomy('portfolio_entry_status','portfolio',array(
			'hierarchical' => true,
			'rewrite' => false,
			'labels' => array(
				'name'                       => _x( 'Portfolio Item Status', 'taxonomy general name', 'lj' ),
				'singular_name'              => _x( 'Portfolio Item Status', 'taxonomy singular name', 'lj' ),
				'menu_name'                  => _x( 'Item Statuses', 'admin menu', 'lj' ),
				'all_items'                  => __( 'All Item Statuses', 'lj' ),
				'edit_item'                  => __( 'Edit Item Status', 'lj' ),
				'view_item'                  => __( 'View Item Status', 'lj' ),
				'update_item'                => __( 'Update Item Status', 'lj' ),
				'add_new_item'               => __( 'Add New Item Status', 'lj' ),
				'new_item_name'              => __( 'New Item Status Name', 'lj' ),
				'parent_item'                => __( 'Parent Item Status: ', 'lj' ),
				'parent_item_colon'          => __( 'Parent Item Status: ', 'lj' ),
				'search_items'               => __( 'Search Item Statuses', 'lj' ),
				'popular_items'              => __( 'Popular Item Statuses', 'lj' ),
				'separate_items_with_commas' => __( 'Separate items with commas', 'lj' ),
				'add_or_remove_items'        => __( 'Add or remove items', 'lj' ),
				'choose_from_most_used'      => __( 'Choose from the most used items', 'lj' ),
				'not_found'                  => __( 'No item statuses found.', 'lj' ),
				'back_to_items'              => __( 'Back to statuses', 'lj' ),
			),
			'show_admin_column' => true
		));
	}
	add_action( 'init', 'lj_register_portfolio_entry_status_taxonomy', 0 );
}

if ( ! function_exists( 'lj_register_fabric_collection_taxonomy' ) ) {
	/**
	 * Registers a `collection` custom post type.
	 *
	 * @todo Change function prefix to your textdomain.
	 * @todo Update prefix in the hook function and if statement.
	 *
	 * @return void
	 */
	function lj_register_fabric_collection_taxonomy() {
		register_taxonomy('fabric_collection','fabric',array(
			'hierarchical' => false,
			'rewrite' => array('slug' => 'fabrics'),
			'labels' => array(
				'name'                       => _x( 'Fabric Collections', 'taxonomy general name', 'lj' ),
				'singular_name'              => _x( 'Fabric Collection', 'taxonomy singular name', 'lj' ),
				'menu_name'                  => _x( 'Collections', 'admin menu', 'lj' ),
				'all_items'                  => __( 'All Collections', 'lj' ),
				'edit_item'                  => __( 'Edit Collection', 'lj' ),
				'view_item'                  => __( 'View Collection', 'lj' ),
				'update_item'                => __( 'Update Collection', 'lj' ),
				'add_new_item'               => __( 'Add New Collection', 'lj' ),
				'new_item_name'              => __( 'New Collection Name', 'lj' ),
				'parent_item'                => __( 'Parent Collection: ', 'lj' ),
				'parent_item_colon'          => __( 'Parent Collection: ', 'lj' ),
				'search_items'               => __( 'Search Collections', 'lj' ),
				'popular_items'              => __( 'Popular Collections', 'lj' ),
				'separate_items_with_commas' => __( 'Separate collections with commas', 'lj' ),
				'add_or_remove_items'        => __( 'Add or remove collections', 'lj' ),
				'choose_from_most_used'      => __( 'Choose from the most used collections', 'lj' ),
				'not_found'                  => __( 'No collections found.', 'lj' ),
				'back_to_items'              => __( 'Back to collections', 'lj' ),
			)
		));
	}
	add_action( 'init', 'lj_register_fabric_collection_taxonomy', 0 );
}

if ( ! function_exists( 'lj_register_fabric_colour_taxonomy' ) ) {
	/**
	 * Registers a `collection` custom post type.
	 *
	 * @todo Change function prefix to your textdomain.
	 * @todo Update prefix in the hook function and if statement.
	 *
	 * @return void
	 */
	function lj_register_fabric_colour_taxonomy() {
		register_taxonomy('fabric_colour','fabric',array(
			'hierarchical' => false,
			'rewrite' => false,
			'archive' => false,
			'labels' => array(
				'name'                       => _x( 'Fabric Colours', 'taxonomy general name', 'lj' ),
				'singular_name'              => _x( 'Fabric Colour', 'taxonomy singular name', 'lj' ),
				'menu_name'                  => _x( 'Colours', 'admin menu', 'lj' ),
				'all_items'                  => __( 'All Colours', 'lj' ),
				'edit_item'                  => __( 'Edit Colour', 'lj' ),
				'view_item'                  => __( 'View Colour', 'lj' ),
				'update_item'                => __( 'Update Colour', 'lj' ),
				'add_new_item'               => __( 'Add New Colour', 'lj' ),
				'new_item_name'              => __( 'New Colour Name', 'lj' ),
				'parent_item'                => __( 'Parent Colour: ', 'lj' ),
				'parent_item_colon'          => __( 'Parent Colour: ', 'lj' ),
				'search_items'               => __( 'Search Colours', 'lj' ),
				'popular_items'              => __( 'Popular Colours', 'lj' ),
				'separate_items_with_commas' => __( 'Separate colours with commas', 'lj' ),
				'add_or_remove_items'        => __( 'Add or remove colours', 'lj' ),
				'choose_from_most_used'      => __( 'Choose from the most used colours', 'lj' ),
				'not_found'                  => __( 'No colours found.', 'lj' ),
				'back_to_items'              => __( 'Back to colours', 'lj' ),
			)
		));
	}
	add_action( 'init', 'lj_register_fabric_colour_taxonomy', 0 );
}

if ( ! function_exists( 'lj_add_portfolio_rewrite' ) ) {
	function lj_add_portfolio_rewrite() {
		add_rewrite_rule('^portfolio/in-progress', 'index.php?portfolio_entry_status=in-progress', 'top');
	}
	add_action('init', 'lj_add_portfolio_rewrite');
}
