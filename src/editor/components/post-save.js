/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';

function PostSave( { onClick } ) {
	return (
		<div className="cyoa__editor-save-post">
			<p>{ __( 'Before we can add a choice, we need to save the post' ) }</p>
			<Button isDefault onClick={ onClick }>{ __( 'Save now' ) }</Button>
		</div>
	);
}

export default withDispatch(
	( dispatch, ownProps ) => ( {
		onClick: () => {
			const { editPost, savePost } = dispatch( 'core/editor' );
			editPost( { status: 'draft' } );
			savePost();
			ownProps.onSave();
		},
	} ),
)( PostSave );