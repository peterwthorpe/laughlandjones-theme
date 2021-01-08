<?php
/**
* Template Name: Contact
*
* @package WordPress
* @subpackage Laughland Jones
* @since Laughland Jones 1.0
*/
?>

<?php get_header(); ?>

<div id="contact" class="page">

	<h1 class="page-header">Contact Us</h1>

	<div id="contact-data-wrap" class="studio">
		<div id="location-tabs">
			<div class="tab studio" id="studio-tab" data-location="studio"><p>Studio</p></div
			><div class="tab warehouse" id="warehouse-tab" data-location="warehouse"><p>Warehouse</p></div>
		</div>

		<div class="locations">
			<div id="studio" class="location">
				<div class="address">
				<p><?php esc_html_e( $post->studio_address ); ?></p>
					<p>
						<a href="callto:<?php esc_html_e( $post->studio_phone ); ?>"><?php esc_html_e( $post->studio_phone ); ?></a><br>
						<a href="mailto:<?php esc_html_e( $post->studio_email ); ?>?subject=Warehouse Enquiry"><?php esc_html_e( $post->studio_email ); ?></a>
					</p>
				</div>
				<a href="https://www.google.co.uk/maps/place/Design+Forum/@51.0603341,0.813883,17z/data=!4m2!3m1!1s0x0000000000000000:0x63a293312762dc8c" target="_blank">
					<div class="image" style="background-image: url(<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/studio-facade.jpg)"></div
					><div class="map" style="background-image: url(<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/studio-map.png)">
						<img src="<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/studio-map.png">
					</div>
				</a>
			</div>

			<div id="warehouse" class="location">
				<div class="address">
					<p><?php esc_html_e( $post->warehouse_address ); ?></p>
					<p>
						<a href="callto:<?php esc_html_e( $post->warehouse_phone ); ?>"><?php esc_html_e( $post->warehouse_phone ); ?></a><br>
						<a href="mailto:<?php esc_html_e( $post->warehouse_email ); ?>?subject=Warehouse Enquiry"><?php esc_html_e( $post->warehouse_email ); ?></a>
					</p>
				</div>

				<a href="https://www.google.co.uk/maps/place/Old+Romney,+Romney+Marsh,+Kent+TN29+9SY/@50.9981247,0.8705728,15z/data=!3m1!4b1!4m2!3m1!1s0x47dee770bdb9fc97:0xbd9bbafbe6ee7ad1" target="_blank">
				<div class="image" style="background-image: url(<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/warehouse-facade.jpg)"></div
				><div class="map" style="background-image: url(<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/warehouse-map.png)">
					<img src="<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/warehouse-map.png">
				</div>
			</a>
		</div>
	</div>

	</div>

	<div id="social">

		<div class="social-wrap">

			<div class="social-links">

				<a href="https://instagram.com/laughlandjones" class="instagram" target="_blank"></a>
				<a href="https://www.pinterest.com/laughlandjones" class="pinterest" target="_blank"></a>

			</div>

			<div id="news-subscribe" class="button orange subscribe-cta prefill-subscribe">
				<button class="button--subscribe"></button>
				<p class="btn-text">subscribe</p>
			</div>

			<div id="brochure" class="brochure subscribe-cta no-ui">
				<img src="<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/download-grey.png" alt="">
				<p>Download our brochure</p>
			</div>

		</div>

	</div>

	<?php echo do_shortcode( $post->form_shortcode ); ?>

</div>

<?php get_footer(); ?>
