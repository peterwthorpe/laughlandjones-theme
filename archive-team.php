<?php
/**
 * This is a custom post type archive for Team items
 */

// Mobile Detect init
require_once get_template_directory() . '/mobile_detect.php';
$detect = new Mobile_Detect;

// config
$team_options = get_option('lj_team');

$company_numbers = array();
foreach	( $team_options['numbers'] as $number ) {
	$company_numbers[] = array(
		'text'   => $number['title'],
		'total'  => $number['value'],
		'suffix' => isset( $number['suffix'] ) ? $number['suffix'] : null,
	);
}

$employees_query = new WP_Query( array(
	'post_type'   => 'team',
	'nopaging'    => true,
	'post_status' => 'publish',
	'orderby'     => 'rand',
));
$employees = array();

foreach ( $employees_query->posts as $employee ) {
	$employee_meta = get_post_meta($employee->ID);

	$employees[] = array(
		'id'         => $employee->ID,
		'first_name' => $employee_meta['first_name'][0],
		'last_name'  => $employee_meta['last_name'][0],
		'position'   => $employee_meta['position'][0],
		'photo'      => array(
			'url' => array(
				'normal' => wp_get_attachment_image_src( $employee_meta['photo_id'][0], 'lj-team-mobile' )[0],
				'retina' => wp_get_attachment_image_src( $employee_meta['photo_id'][0], 'lj-team-retina' )[0],
			)
		),
		'copy'       => $employee_meta['copy'][0],
		'linkedin'   => isset( $employee_meta['linkedin'][0] ) ? $employee_meta['linkedin'][0] : null,
		'email'      => isset( $employee_meta['email'][0] ) ? $employee_meta['email'][0] : null
	);
}

?>

<?php get_header(); ?>

<script type="text/javascript">
var _Employees = <?php echo json_encode( $employees ) ?>;
</script>

<div id="who" class="page padded-sides padded-bottom">
	<div id="employees">
		<h1 class="page-header orange">Meet the Team</h1>
		<div class="andrew-and-russell">
			<h3 class="andrew-and-russell__caption">ANDREW LAUGHLAND & RUSSELL JONES</h3>
		</div>
		<ul id="employees-list">
			<?php foreach ( $employees as $employee ) { ?><li class="employee" data-id="<?php esc_attr_e( $employee["id"] ); ?>" data-image="<?php esc_attr_e( $employee['photo']['url']['normal'] ); ?>">
					<div class="image" style="background-image: url(<?php esc_attr_e( $employee['photo']['url']['retina'] ); ?>);"></div>
					<h1 class="name">
						<?php esc_html_e( $employee['first_name']); ?><br>
						<?php esc_html_e( $employee['last_name']); ?><br>
						<em><?php esc_html_e( $employee['position']); ?></em>
					</h1>
					<p class="copy"><?php esc_html_e( $employee['copy']); ?></p>
					<?php if ( ! $detect->isTablet() && ! $detect->isMobile() ) { ?>
						<div class="links <?php esc_attr_e( $employee['linkedin'] ? '' : 'single' ); ?>">
							<?php if ( $employee['linkedin'] ) { ?>
								<a href="<?php esc_attr_e( $employee['linkedin'] ) ?>" class="employee-linkedin" target="_blank"></a>
							<?php } ?>
							<a href="mailto:<?php esc_attr_e( $employee['email'] ) ?>?subject=Enquiry for <?php esc_attr_e( $employee['first_name'] ) ?>" class="employee-email"></a>
						</div>
					<?php } ?>
				</li><?php } ?>
		</ul>
	</div>
	<div class="keyline"></div>
	<h1 class="page-header">Team</h1>
	<?php echo wpautop( $team_options['intro'] ); ?>
	<div class="keyline"></div>
	<h1 class="page-header">Some Numbers</h1>
	<ul id="company-numbers" class="company-numbers">
		<?php foreach ( $company_numbers as $number ) { ?>
			<li class="company-numbers__item">
				<span class="company-numbers__number" data-total=<?php esc_attr_e( $number['total' ]);?> data-suffix="<?php esc_attr_e( $number['suffix'] ?: false );?>">
					0 <?php esc_html_e( $number['suffix'] );?>
				</span>
				<div class="company-numbers__metric"><?php esc_html_e( $number['text'] ); ?></div>
			</li>
		<?php } ?>
	</ul>
	<div class="keyline"></div>
	<h1 class="page-header">Find Us Online</h1>
	<div class="social-links">
		<!-- <a href="https://twitter.com/laughlandjones" class="twitter" target="_blank"></a> -->
		<a href="https://instagram.com/laughlandjones" class="instagram" target="_blank"></a>
		<a href="https://www.pinterest.com/laughlandjones" class="pinterest" target="_blank"></a>
		<a href="https://www.linkedin.com/company/laughlandjones" class="linkedin" target="_blank"></a>
	</div>
	<div class="keyline"></div>
	<h1 class="page-header">Work With Us</h1>
	<?php echo wpautop( $team_options['work_with_us'] ); ?>
	<div class="button orange" id="send-cv">
		<button class="button--send-cv"></button>
		<p class="btn-text">send cv</p>
	</div>
</div>

<div id="mobile-more">
	<img src="<?php esc_attr_e(get_template_directory_uri() . '/resources/assets/images/close.png') ?>" class="emp-close-button" id="emp-close-button">
	<div class="content">
		<div class="image"></div>
		<div class="top">
			<h1 class="name"></h1>
			<div class="links">
				<a href="" class="employee-linkedin" target="_blank"></a>
				<a href="" class="employee-email"></a>
			</div>
		</div>
		<p class="copy"></p>
	</div>
</div>

<?php get_footer(); ?>
