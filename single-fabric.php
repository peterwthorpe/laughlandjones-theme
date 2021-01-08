<?php

$fabric_id   = get_the_ID();
$collections = wp_get_post_terms( $fabric_id, 'fabric_collection' );

$template_data = [
	'collection' => $collections[0],
	'image'      => get_post_meta( $fabric_id, 'lj_default_image' )[0],
	'title'      => get_the_title(),
	'meta'       => get_fabric_meta( $fabric_id ),
	'variations' => get_variations( $fabric_id ),
	'siblings'   => get_siblings( $fabric_id, $collections[0]->term_id ),
	'slides'     => get_post_meta( $fabric_id, 'lj_fabric_slideshow', true ),
];
?>

<script type="text/javascript">
	window.fabricImages = [{
		src: '<?php echo esc_url( $template_data['image'] ); ?>'
	}];
	<?php foreach( $template_data['variations'] as $index => $variation ) { ?>
		if ( '<?php echo esc_url( $variation['image_url'] ); ?>' !== window.fabricImages[0].src ) {
			window.fabricImages.push({
				src: '<?php echo esc_url( $variation['image_url'] ); ?>'
			});
		}
	<?php } ?>
</script>

<?php
function get_fabric_meta( $post_id = false ) {
	if ( ! (int) $post_id ) {
		return;
	}

	$meta = [];

	// Array to hold metadata keys and labels
	$possible_meta = [
		'lj_pattern' => 'Pattern Number',
		'lj_vertical_repeat' => 'Vertical Repeat',
		'lj_horizontal_repeat' => 'Horizontal Repeat',
		'lj_width' => 'Fabric Width',
		'lj_rub_test' => 'Rub Test',
		'lj_suitability' => 'Suitability',
		'lj_content' => 'Content',
	];

	foreach ( $possible_meta as $key => $label ) {
		$meta_value = get_post_meta( $post_id, $key, true );

		if ( $meta_value ) {
			$meta[ $label ] = $meta_value;
		}
	}

	return $meta;
}

function get_siblings( $post_id = false, $collection_id = false ) {
	if ( false === $post_id || false === $collection_id ) {
		return;
	}

	$sibling_query = new WP_Query([
		'post_type'    => 'fabric',
		'post_status'  => 'publish',
		'post__not_in' => [ $post_id ],
	]);

	$siblings = [];

	if ( $sibling_query->have_posts() ) {
		while ( $sibling_query->have_posts() ) {
			$sibling_query->the_post();
			$siblings[] = [
				'name' => get_the_title(),
				'url' => get_the_permalink(),
				'image' => get_post_meta( get_the_ID(), 'lj_default_image' )[0],
				'ref' => get_post_meta( get_the_ID(), 'lj_pattern' )[0],
			];
		}
	}

	return $siblings;
}

get_header();

?>

<script>
	window.fabricVariations = <?php echo json_encode( $template_data['variations'] ); ?>
</script>

<div class="fabrics-header">
	<div class="container">
		<div class="row">
			<div class="col-sm-12 col-md-6 breadcrumbs">
				<div class="container">
					<ul>
						<li><a href="<?php echo esc_url( get_site_url() . '/fabrics/' ); ?>">Fabrics</a></li>
						<li>
							<a href="<?php echo esc_url( get_term_link( $template_data['collection']->term_id, 'fabric_collection' ) ); ?>/"><?php echo esc_html( $template_data['collection']->name ); ?></a>
						</li>
						<li><?php the_title(); ?></li>
					</ul>
				</div>
			</div>

			<div class="col-sm-12 col-md-6 basket"></div>
		</div>
	</div>
</div>

<div class="fabrics fabric-page">

	<header class="entry-header design-header">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<h1 class="entry-title"><?php echo esc_html( $template_data['collection']->name ); ?> -
						<?php the_title(); ?></h1>
				</div><!-- .entry-header .container .row .col -->
			</div><!-- .entry-header .container .row -->
		</div><!-- .entry-header .container -->
	</header><!-- .entry-header -->

	<div class="entry-meta design-meta">
		<div class="container">
			<div class="row">
				<div class="col-sm-6 col-md-4 col-thumbnail">
					<div id="current-design" class="entry-thumbnail"
						style="background-image:url(<?php echo esc_url( $template_data['image'] ); ?>)"
						title="Click to enlarge image"></div>
				</div>

				<div class="col-sm-6 col-md-4 col-fabric-info">
					<div class="h3">Fabric information:</div>

					<table>
						<tbody>
							<tr>
								<th>Colour Name</th>
								<td id="variation-color-name">
									<?php echo esc_html( $template_data['title'] ); ?></td>
							</tr>
							<?php foreach ( $template_data['meta'] as $label => $meta ) { ?>
								<tr>
									<th><?php echo esc_html( $label ); ?></th>
									<td id="fabric-<?php esc_attr_e( str_replace( ' ', '-', strtolower( $label ) ) ); ?>" class="fabric-<?php esc_attr_e( str_replace( ' ', '-', strtolower( $label ) ) ); ?>"><?php echo esc_html( $meta ); ?></td>
								</tr>
							<?php } ?>
<?php /*
							<tr>
								<th>Colours included</th>
								<td id="fabric-selected-colors">
									<div class="colors">
										<?php if ( $template_data['variations'] ) { ?>
											<?php foreach( $template_data['variations'][0]['colours'] as $name => $hex ) { ?>
											<b style="background-color:<?php esc_attr_e( $hex ); ?>" title="<?php esc_attr_e( $name ); ?>"></b>
											<?php } ?>
										<?php } ?>
									</div>
								</td>
							</tr>
*/ ?>
						</tbody>
					</table>


					<a id="add-to-cart" class="add-to-cart visible" href="javascript:;" data-id="<?php echo esc_attr( $fabric_id ); ?>" data-variation="0">Request swatch sample
						<span>-</span> Add to basket</a>
					<a id="remove-from-cart" class="remove-from-cart" data-id="<?php echo esc_attr( $fabric_id ); ?>" data-variation="0" href="javascript:;">Remove from basket</a>
					<a id="full-repeat-no-link" class="remove-from-cart" href="javascript:;">Full Repeat</a>
				</div>
				<div class="col-sm-12 col-md-4 col-colors">
					<div class="h3">Available in these colours:</div>
					<div class="design-colors">

						<ul title="Click to select">
							<?php foreach( $template_data['variations'] as $index => $variation ) { ?>
							<li data-index="<?php esc_attr_e( $index ); ?>">
								<a href="<?php echo esc_url( $variation['image_url'] ); ?>" style="background-image:url(<?php echo esc_url( $variation['image_url'] ); ?>)"></a>
							</li>
							<?php } ?>
						</ul><!-- .col-colors .design-colors ul -->

					</div><!-- .col-colors .design-colors -->
				</div><!-- .col-colors -->
			</div><!-- .entry-meta .container .row -->
		</div><!-- .entry-meta .container -->
	</div><!-- .entry-meta -->

	</article>

	<div class="form">
		<div class="container">
			<div class="row row-header">
				<div class="col-md-12">
					<div class="h2">Interested in this fabric? Please call 0044 1233 732466, or fill in the form below:
					</div>
				</div>
			</div>
			<div class="row row-form">
				<div class="col-md-6">
					<div id="master-slideshow" class="swiper-container">

						<div id="left-arrow" class="arrows"></div>
						<div id="right-arrow" class="arrows"></div>

						<div class="swiper-wrapper">
							<?php if ( $template_data['slides'] ) { ?>
								<?php foreach( $template_data['slides'] as $slide ) { ?>
								<div class="swiper-slide s">
									<div class="slide-image"
										style="background-image: url(<?php echo esc_url( $slide ); ?>);">
									</div>
								</div>
								<?php } ?>
							<?php } ?>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<?php echo do_shortcode( '[contact-form-7 id="115" title="Get In Touch"]' ); ?>
				</div>
			</div>
		</div>
	</div>

	<?php if ( $template_data['siblings'] ) { ?>
	<div class="items-list">
		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<h1>All available designs in this collection</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<ul class="designs">
						<?php foreach( $template_data['siblings'] as $sibling ) { ?>
						<li>
							<a href="<?php echo esc_url( $sibling['url'] ); ?>/" class="image"
								style="background-image:url(<?php echo esc_url( $sibling['image'] ); ?>");"><i></i></a>
							<h4><a href="<?php echo esc_url( $sibling['url'] ); ?>/"><?php echo esc_html( $sibling['name'] ); ?></a></h4>
							<div><a href="<?php echo esc_url( get_term_link( $template_data['collection']->term_id, 'fabric_collection' ) ); ?>/">Collection: <?php echo esc_html( $template_data['collection']->name ); ?></a></div>
							<div>Code Ref: <?php echo esc_html( $sibling['ref'] ); ?></div>
						</li>
						<?php } ?>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<?php } ?>

<?php get_footer();
