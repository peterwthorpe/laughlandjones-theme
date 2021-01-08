<?php
/**
 * This is the template that displays all of the <head> section and <header> section.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-57x57.png' rel='apple-touch-icon' sizes='57x57'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-60x60.png' rel='apple-touch-icon' sizes='60x60'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-72x72.png' rel='apple-touch-icon' sizes='72x72'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-76x76.png' rel='apple-touch-icon' sizes='76x76'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-114x114.png' rel='apple-touch-icon' sizes='114x114'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-120x120.png' rel='apple-touch-icon' sizes='120x120'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-144x144.png' rel='apple-touch-icon' sizes='144x144'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-152x152.png' rel='apple-touch-icon' sizes='152x152'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/apple-touch-icon-180x180.png' rel='apple-touch-icon' sizes='180x180'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/favicon-32x32.png' rel='icon' sizes='32x32' type='image/png'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/favicon-194x194.png' rel='icon' sizes='194x194' type='image/png'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/favicon-96x96.png' rel='icon' sizes='96x96' type='image/png'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/android-chrome-192x192.png' rel='icon' sizes='192x192' type='image/png'>
	<link href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/favicon-16x16.png' rel='icon' sizes='16x16' type='image/png'>
	<link color='#dd7a39' href='<?php echo esc_url( get_template_directory_uri() ); ?>/resources/assets/images/icons/safari-pinned-tab.svg' rel='mask-icon'>
	<meta content='#dd7a39' name='msapplication-TileColor'>
	<meta content='/images/mstile-144x144.png' name='msapplication-TileImage'>
	<meta content='#dd7a39' name='theme-color'>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<a id="skiptocontent" href="#maincontent">Skip to main content</a>
	<?php get_template_part( 'resources/templates/parts/parts', 'subscribe-modal' ); ?>
	<?php get_template_part( 'resources/templates/parts/parts', 'notify-modal' ); ?>
	<?php get_template_part( 'resources/templates/parts/parts', 'subscribe' ); ?>
	<?php get_template_part( 'resources/templates/parts/parts', 'header' ); ?>
	<main id="maincontent">
