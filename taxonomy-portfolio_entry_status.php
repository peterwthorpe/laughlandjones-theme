<?php
/**
 * Template that handle 404 requests on server
 *
 * @link https://developer.wordpress.org/themes/functionality/404-pages/
 */

$term = get_term_by( 'slug', get_query_var('term'), get_query_var('taxonomy') );

// Get data
$in_progresses = [];
if ( have_posts() ) {
	while(have_posts()) {
		the_post();

		$featured_image = false;
		$project_meta = get_post_meta($post->ID);
		if ( isset( $project_meta['photo_id'] ) ) {
			$imgmeta = wp_get_attachment_metadata( $project_meta['photo_id'][0] );
			$is_landscape = $imgmeta['width'] > $imgmeta['height'];
			$featured_image = array(
				'orientation' => $is_landscape ? 'landscape' : 'portrait',
				'image' => array(
					'url' => array(
						'normal' => wp_get_attachment_image_src( $project_meta['photo_id'][0], $is_landscape ? 'lj-portfolio-l' : 'lj-portfolio-p' )[0]
					)
				)
			);
		}

		$in_progresses[] = [
			'title' => $post->post_title,
			'location' => $post->location,
			'architecture' => $post->architecture,
			'client' => $post->client,
			'geography' => $post->geography,
			'size' => $post->size,
			'architect' => $post->architect,
			'interior_architecture' => $post->interior_architecture,
			'interior_design' => $post->interior_design,
			'completion' => $post->completion,
			'feature_image' => $featured_image
		];
	}
}

function lj_output_portfolio_row( $field = null, $label = null, $project = null ) {
	if ( $field === null || $label === null || $project === null || empty( $project[$field] ) ) return;
	?>
	<tr>
		<td class="project-table__label"><?php esc_html_e( $label ) ?></td>
		<td><?php esc_html_e( $project[$field] ) ?></td>
	</tr>
	<?php
}
?>

<?php get_header(); ?>

<div id="in-progress" class="page">

	<?php if ( ! count($in_progresses) ) { ?>

		<h1 class="page-header page-header--empty">There are currently no <?php esc_html_e( $term->name ) ?> projects to view.</h1>

  	<?php } else { ?>
	<?php /*
		<div class="panel panel__left--grey">
	  		<img src="<?php esc_attr_e( get_template_directory_uri() ) ?>/resources/assets/images/lj_logo_m.jpg" class="panel__logo">
		</div>

		<div class="panel panel__right">
*/?>
		<h1 class="page-header orange"><?php esc_html_e( $term->name ) ?></h1>

		<div class="panel">

	  		<ul id="in-progress-items">

				<?php foreach ($in_progresses as $project) { ?>

		  			<li class="project-item">
						<div class="project-item-container">
							<div class="item-image" style="background-image:url(<?= $project['feature_image']['image']['url']['normal']; ?>)"></div>

							<div class="item-content">

			  					<div class="copy">

									<h3 class="title"><?php esc_html_e( $project['title'] ) ?></h3>

									<p class="copy-item location">
										<?php esc_html_e( $project['location'] ) ?>
									</p>

									<table>
										<?php lj_output_portfolio_row('client','Client',$project); ?>
										<?php lj_output_portfolio_row('geography','Geography',$project); ?>
										<?php lj_output_portfolio_row('architecture','Architecture',$project); ?>
										<?php lj_output_portfolio_row('size','Size',$project); ?>
										<?php lj_output_portfolio_row('architect','Architect',$project); ?>
										<?php lj_output_portfolio_row('interior_architecture','Interior Architecture',$project); ?>
										<?php lj_output_portfolio_row('interior_design','Interior Design',$project); ?>
										<?php lj_output_portfolio_row('completion','Completion',$project); ?>
									</table>

									<br>
								</div>
							</div>
						</div>
					</li>
				<?php } ?>

			</ul>

		</div>

	<?php } ?>

</div>

<?php get_footer(); ?>
