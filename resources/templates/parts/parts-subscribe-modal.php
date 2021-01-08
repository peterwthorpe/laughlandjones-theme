<div class="modal-wrapper">
	<div class="blackout"></div>
	<div class="modal">
		<img src="<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/close.png" alt="" class="close-modal-button" id="close-button">
		<div id="thanks-wrap" class="sections">
			<h2>
				Thanks!
				<br>
				We'll be in touch.
			</h2>
			<img src="<?php echo esc_url(get_template_directory_uri()); ?>/resources/assets/images/thanks-graphic.png" alt="" id="thanks-graphic">
			<a href="/download-brochure" id="download-link" class="download-brochure"></a>
		</div>
		<div id="subscribe-wrap" class="sections">
			<h2 class="cta">Thanks for your interest!</h2>
			<form>
				<div class="checkboxes">
					<!-- Newsletter Checkbox -->
					<input type="checkbox" id="newsletter-check">
					<label for="newsletter-check">
						<div class="checkbox">
							<div class="tick"></div>
							<div class="dot"></div>
						</div>
						<p class="checktext">Get the latest news</p>
					</label>
					<!-- Brochure Checkbox -->
					<input type="checkbox" id="portfolio-check">
					<label for="portfolio-check">
						<div class="checkbox">
							<div class="tick"></div>
							<div class="dot"></div>
						</div>
						<p class="checktext">Download our portfolio</p>
					</label>
				</div>
				<input type="text" id="name-field" placeholder="enter your full name" name="name" autocomplete="name">
				<input type="email" id="email-field" placeholder="enter your email address" name="email" autocomplete="email">
				<div class="button orange" id="subscribe-button">
					<button class="button--subscribe"></button>
					<p class="btn-text">Go »</p>
				</div>
			</form>
		</div>
	</div>
</div>
