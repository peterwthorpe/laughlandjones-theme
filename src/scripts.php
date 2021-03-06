<?php
/**
 * ------------------------------------------------------------------------
 * Theme's JavaScript Assets
 * ------------------------------------------------------------------------
 * This file is for registering your theme's scripts. In here you
 * should also deregister all unwanted assets which can be
 * shipped with various third-parity plugins.
 */

if ( ! function_exists( 'lj_register_scripts' ) ) {
	/**
	 * Registers theme's JavaScript scripts.
	 *
	 * @todo Change function prefix to your textdomain.
	 * @todo Update prefix in the hook function and if statement.
	 *
	 * @return void
	 */
	function lj_register_scripts() {
		// Get version from Heroku or default to manual versioning
		$version = getenv( 'SOURCE_VERSION' );

		wp_enqueue_script( 'theme-script', get_template_directory_uri() . '/public/js/main.js', array( 'jquery','swiper' ), $version, true );
		wp_enqueue_script( 'swiper', get_template_directory_uri() . '/node_modules/swiper/dist/js/swiper.min.js', array( 'jquery' ), $version, true );
		wp_enqueue_script( 'lazysizes', get_template_directory_uri() . '/node_modules/lazysizes/lazysizes.min.js', array(), $version, true );
		wp_enqueue_script( 'lazysizes.unveilhooks', get_template_directory_uri() . '/node_modules/lazysizes/plugins/unveilhooks/ls.unveilhooks.min.js', array( 'lazysizes' ), $version, true );
		wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', array( 'jquery' ), $version, true );
		wp_enqueue_script( 'bootstrap-multiselect', get_template_directory_uri() . '/node_modules/bootstrap-multiselect/dist/js/bootstrap-multiselect.js', array( 'bootstrap','jquery' ), $version, true );

		wp_localize_script( 'theme-script', 'lj_ajax', [ 'url' => admin_url( 'admin-ajax.php' ) ] );
	}
}
add_action( 'wp_enqueue_scripts', 'lj_register_scripts' );
