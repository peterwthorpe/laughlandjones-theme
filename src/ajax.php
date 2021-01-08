<?php

function lj_send_email() {
	$to_address = 'enquiries@'.str_ireplace('www.', '', $_SERVER['HTTP_HOST']);
	if(!filter_var($to_address, FILTER_VALIDATE_EMAIL)) $to_address = 'enquiries@laughlandjones.co.uk';
	$subject = 'Website Contact';

	$message = 'Name: ' . $_REQUEST['contact']['name'] . '<br>'
	. 'Email address: ' . $_REQUEST['contact']['email'] . '<br>'
	. 'Subscribe to newsletter: ' . $_REQUEST['contact']['newsletter'] . '<br>'
	. 'Download portfolio: ' . $_REQUEST['contact']['portfolio'];

	wp_mail( $to_address, $subject, $message, ['Content-Type: text/html; charset=UTF-8'] );

	echo wp_json_encode([
		'brochure' => $_REQUEST['contact']['portfolio'] === "true"
	]);

	wp_die();
}

add_action( 'wp_ajax_lj_send_email', 'lj_send_email' );
add_action( 'wp_ajax_nopriv_lj_send_email', 'lj_send_email' );
