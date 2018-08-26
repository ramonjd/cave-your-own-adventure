<?php
/**
 * The template for displaying all CYOA single posts and attachments
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<?php
			// Start the loop.
			while ( have_posts() ) : the_post();
				the_title();
				the_content();
				// End the loop.
			endwhile;
			?>
		<p>CYOA CYOA</p>
		</main><!-- .site-main -->
	</div><!-- .content-area -->

<?php get_footer(); ?>