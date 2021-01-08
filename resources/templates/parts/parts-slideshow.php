<?php
require_once get_template_directory() . '/mobile_detect.php';
$detect = new Mobile_Detect;

$agent = $detect->isMobile() ? 'mobile' : 'retina';

$i = 0;

$photo_array = get_post_meta( get_the_ID(), 'lj_home_gallery', true );

$photos = array();

if ( is_array( $photo_array ) ) {
	foreach( $photo_array as $photo_id => $photo ) {
		$imgmeta = wp_get_attachment_metadata( $photo_id );
		$caption = wp_get_attachment_caption( $photo_id );
		$is_landscape = $imgmeta['width'] > $imgmeta['height'];

		$photos[] = array(
			'orientation' => $is_landscape ? 'landscape' : 'portrait',
			'mobile'      => wp_get_attachment_image_src( $photo_id, $is_landscape ? 'lj-home-mobile-l' : 'lj-home-mobile-p' )[0],
			'retina'      => wp_get_attachment_image_src( $photo_id, $is_landscape ? 'lj-home-retina-l' : 'lj-home-retina-p' )[0],
			'caption'     => $caption
		);
	}
}
$homepage_overlay = get_post_meta( get_the_ID(), 'homepage_overlay', true );
if(strlen($homepage_overlay) > 0) {
?>
<div id="fixed-homepage-overlay">
<div class="text"><?= wpautop($homepage_overlay); ?></div>
</div>
<?php
}
?>
<div id="master-slideshow" class="swiper-container">

	<div id="left-arrow" class="arrows"></div>
	<div id="right-arrow" class="arrows"></div>

	<div class="swiper-wrapper">
		<?php
			while ( $i < count( $photos ) ) {
				if ( $photos[$i]['orientation'] == 'portrait' && isset($photos[ $i + 1 ]) && $photos[ $i + 1 ]['orientation'] == 'portrait' ) {
					?>
						<div class="swiper-slide pp">
							<div class="slide-image" style="background-image: url(<?php echo esc_url( $agent === 'mobile' ? $photos[ $i ]['mobile'] : $photos[ $i ]['retina'] ); ?>);">
								<?php if(strlen($photos[ $i ]['caption']) > 0) { ?><div class="slide-caption"><div class="text"><span class="heading">Featured project</span> <?= $photos[ $i ]['caption']; ?></div></div><?php } ?>
							</div>
							<div class="slide-image" style="background-image: url(<?php echo esc_url( $agent === 'mobile' ? $photos[ $i + 1 ]['mobile'] : $photos[ $i + 1 ]['retina'] ); ?>);">
								<?php if(strlen($photos[ $i + 1 ]['caption']) > 0) { ?><div class="slide-caption"><div class="text"><span class="heading">Featured project</span> <?= $photos[ $i + 1 ]['caption']; ?></div></div><?php } ?>
							</div>
						</div>
					<?php
				$i += 2;
			} else if ( ! isset( $photos[ $i ] ) ) {
				break;
			} else { ?>
				<div class="swiper-slide s">
					<div class="slide-image" style="background-image: url(<?php echo esc_url( $agent === 'mobile' ? $photos[ $i ]['mobile'] : $photos[ $i ]['retina'] ); ?>);">
						<?php if(strlen($photos[ $i ]['caption']) > 0) { ?><div class="slide-caption"><div class="text"><span class="heading">Featured project</span> <?= $photos[ $i ]['caption']; ?></div></div><?php } ?>
					</div>
				</div>
			<?php
				$i += 1;
			}
		}
		?>
	</div>

</div>
