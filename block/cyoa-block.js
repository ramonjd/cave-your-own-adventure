( function( blocks, i18n, element ) {
	/* Set up variables */


	/* Register block type */
	blocks.registerBlockType( 'gfblocks/feature-block', {
		title: i18n.__( 'Cave your own adventure - Stare here' ), // The title of our block.
		icon: 'info', // Dashicon icon for our block
		category: 'common', // The category of the block.
		attributes: {}, /* Placeholder */
		edit: {}, /* Placeholder */
		save: {} /* Placeholder */
	} );

} )(
	window.wp.blocks,
	window.wp.i18n,
	window.wp.element,
);