<?php
/**
 * <footer> content with bottom-nav content.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 */
?>

<footer class="footer">
	<div id="menu-container">
		<?php get_template_part( 'resources/templates/nav/nav', 'bottom' ); ?>
		<?php get_template_part( 'resources/templates/nav/nav', 'social' ); ?>
	</div>
	<div id='mobile-foot-content'>
		<div id='foot-logo'></div>
		<button id='menu-button'>Menu</button>
	</div>
</footer>
