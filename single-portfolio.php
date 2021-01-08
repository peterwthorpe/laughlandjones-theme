<?php
/**
* Single Portfolio
*
* @package WordPress
* @subpackage Laughland Jones
* @since Laughland Jones 1.0
*/

require_once get_template_directory() . '/mobile_detect.php';
$detect = new Mobile_Detect;

$agent = $detect->isMobile() ? 'mobile' : 'retina';

$i = 0;

// Get project data
$post_meta = get_post_meta( get_the_ID() );

$project = [
	'title'       => get_the_title(),
	'location'    => $post_meta['location'][0] ?? null,
	'description' => $post_meta['description'][0] ?? null,
	'testimonial' => $post_meta['testimonial'][0] ?? null,
	'cgi_link'    => null,
];

// Get photos
$photo_array = get_post_meta( get_the_ID(), 'photos', true );

$photos = [];

if ( $photo_array ) {
	foreach ( $photo_array as $photo_id => $photo ) {
		$imgmeta = wp_get_attachment_metadata( $photo_id );
		$is_landscape = $imgmeta['width'] > $imgmeta['height'];

		$photos[] = array(
			'orientation' => $is_landscape ? 'landscape' : 'portrait',
			'normal'      => wp_get_attachment_image_src( $photo_id, $is_landscape ? 'lj-home-normal-l' : 'lj-home-normal-p' )[0],
			'mobile'      => wp_get_attachment_image_src( $photo_id, $is_landscape ? 'lj-home-mobile-l' : 'lj-home-mobile-p' )[0],
			'retina'      => wp_get_attachment_image_src( $photo_id, $is_landscape ? 'lj-home-retina-l' : 'lj-home-retina-p' )[0]
		);
	}
}

?>

<?php get_header(); ?>

<script>window._Photos = <?php echo wp_json_encode($photos); ?>;</script>

<div id="project" class="page">

	<h1 class="page-header">
		<?php echo esc_html($project['title']); ?>
		<br>
		<em><?php echo esc_html($project['location']); ?></em>
	</h1>

	<div class="read_more">
		<div id="read_more--container">
			<p class="description"><?php echo esc_html($project['description']); ?></p>

  			<?php if( $project['testimonial'] ) { ?>
				<div class="testimonial">
					<p><?php echo esc_html($project['testimonial']); ?></p>
				</div>
			<?php } ?>

			<?php if( $project['cgi_link'] ) { ?>
				<a href="<?php echo esc_url($project['cgi_link']) ?>" class="button orange cgi-button" target="_blank">
					<button></button>
					<p class="btn-text">View 3D Interactive Experience</p>
				</a>
			<?php } ?>
		</div>
		<div id="read_more--button">
			<button type="button"><p class="orange">&#8650; Click to expand and read more &#8650;</p></button>
		</div>
		<script>
var button = document.getElementById('read_more--button');
button.addEventListener('click', function(ev) {
  var container = document.getElementById('read_more--container');
  container.classList.add('open');
  button.classList.add('hidden');
}, false);
		</script>
	</div>

	<div class="project-controls">

		<div id="view-slideshow" class="button orange">
			<button></button>
			<p class="btn-text">« Slideshow »</p>
		</div>

		<div class="button grey">
			<button onclick="history.back(-1)"></button>
			<p class="btn-text">&#8592; Back</p>
		</div>

	</div>

	<!-- THE IMAGE GRID -->
  	<div id="project-image-grid"></div>
	<img src="<?php esc_attr_e( get_template_directory_uri() ) ?>/resources/assets/images/arrow-up.png" id="back-to-top">

	<!-- THE SWIPER -->
	<div class="swiper-container">
		<img src="<?php esc_attr_e( get_template_directory_uri() ) ?>/resources/assets/images/close.png" id="slideshow-close-button">

		<div id="left-arrow" class="arrows"></div>
		<div id="right-arrow" class="arrows"></div>

		<div class="swiper-wrapper">
			<?php
		while ( $i < count( $photos ) ) {
			if ( $photos[$i]['orientation'] == 'portrait' && isset( $photos[ $i + 1 ] ) && $photos[ $i + 1 ]['orientation'] == 'portrait' ) {
				?><div class="swiper-slide pp">
				<div class="slide-image lazyload" data-bg="<?php echo esc_url( $agent === 'mobile' ? $photos[ $i ]['mobile'] : $photos[ $i ]['retina'] ); ?>"></div>
				<div class="slide-image lazyload" data-bg="<?php echo esc_url( $agent === 'mobile' ? $photos[ $i + 1 ]['mobile'] : $photos[ $i + 1 ]['retina'] ); ?>"></div>
			</div><?php
				$i += 2;
			} else if ( ! isset( $photos[ $i ] ) ) {
				break;
			} else { ?><div class="swiper-slide s">
				<div class="slide-image lazyload" data-bg="<?php echo esc_url( $agent === 'mobile' ? $photos[ $i ]['mobile'] : $photos[ $i ]['retina'] ); ?>"></div>
			</div><?php
				$i += 1;
			}
		}
		?>
		</div>
	</div>

</div>

<?php get_footer(); ?>
