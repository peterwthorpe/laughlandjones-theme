<?php

function lj_add_home_metaboxes() {
	$metabox = new_cmb2_box( array(
		'id'           => 'lj_home',
		'title'        => __( 'Home Options', 'lj' ),
		'object_types' => array( 'page' ),
		'show_on'      => array( 'key' => 'page-template', 'value' => 'template-home.php' ),
		'context'      => 'normal',
		'priority'     => 'high',
	));

	$metabox->add_field( array(
		'name'       => __( 'Homepage Overlay', 'lj' ),
		'id'         => 'homepage_overlay',
		'type'       => 'wysiwyg',
	) );

	$metabox->add_field( array(
		'name'       => __( 'Homepage Gallery', 'lj' ),
		'id'         => 'lj_home_gallery',
		'type'       => 'file_list',
	) );
}

add_action( 'cmb2_admin_init', 'lj_add_home_metaboxes' );
