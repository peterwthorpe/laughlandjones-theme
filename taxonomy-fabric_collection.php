<?php
/**
 * Template that handle 404 requests on server
 *
 * @link https://developer.wordpress.org/themes/functionality/404-pages/
 */

get_header();

$term_id = get_queried_object()->term_id;

$fabrics_query = new WP_Query([
	'post_type' => 'fabric',
    'tax_query' => [
        [
            'taxonomy' => 'fabric_collection',
            'terms'    => $term_id,
		],
	],
	'post_status' => 'publish',
]);

$fabrics = [];

if ( $fabrics_query->have_posts() ) {
	while ( $fabrics_query->have_posts() ) {
		$fabrics_query->the_post();
		$fabrics[] = [
			'url'     => get_the_permalink(),
			'image'   => get_post_meta( get_the_ID(), 'lj_default_image', true ),
			'name'    => get_the_title(),
			'pattern' => get_post_meta( get_the_ID(), 'lj_pattern', true ),
		];
	}
}

$template_data = [
	'collection' => get_fabric_data( $term_id ),
	'fabrics'    => $fabrics,
];

?>

<?php /* temporary kill the header as requested
<div class="fabrics-header">
	<?php get_template_part( 'resources/templates/nav/nav', 'fabrics' ); ?>

	<div class="container">
		<div class="row">
			<div class="col-sm-12 col-md-6 breadcrumbs">
				<div class="container">
					<ul>
						<li>
							<a href="<?php echo esc_url( get_site_url() . '/fabrics/' ); ?>">Fabrics</a>
						</li>
						<li>
							<?php echo esc_html( $template_data['collection']['name'] ); ?>
						</li>
					</ul>
				</div>
			</div>

			<div class="col-sm-12 col-md-6 basket"></div>
		</div>
	</div>
</div>
*/ ?>
<div class="fabrics fabrics-collection page">
	<div class="container">
		<div class="row row-title">
			<div class="col-md-12">
				<h1 class="page-title"><?php echo esc_html( $template_data['collection']['name'] ); ?></h1>
			</div><!-- .entry-header .container .row .col -->
		</div><!-- .page-header .container .row -->

		<div class="row row-description">
			<div class="col-sm-12 col-md-12 archive-image"
				style="background-image:url(<?php echo esc_url( $template_data['collection']['image'] ); ?>)"></div>
		</div><!-- .page-header .container .row -->

	</div><!-- .page-header .container -->

	<div class="items-list">
		<div class="container">
			<div class="row">
				<div class="col-md-12">

					<ul class="designs">
						<?php foreach( $template_data['fabrics'] as $fabric ) { ?>
						<li>
							<a href="<?php echo esc_url( $fabric['url'] ); ?>/" class="image"
								style="background-image:url(<?php echo esc_url( $fabric['image'] ); ?>);"><i></i></a>
							<h4><a href="<?php echo esc_url( $fabric['url'] ); ?>/"><?php echo esc_html( $fabric['name'] ); ?></a></h4>
							<div><a href="<?php echo esc_url( $fabric['url'] ); ?>/">Collection: <?php echo esc_html( $template_data['collection']['name'] ); ?></a></div>
							<div>Code Ref: <?php echo esc_html( $fabric['pattern'] ); ?></div>
						</li>
						<?php } ?>
					</ul>

				</div>
			</div>
		</div>
	</div>
</div>

<?php get_footer(); ?>
