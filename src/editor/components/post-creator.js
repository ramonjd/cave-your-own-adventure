
/**
 * External dependencies
 */
import { get, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import apiRequest from '@wordpress/api-request';
import { __ } from '@wordpress/i18n';
import { TextControl, Button } from '@wordpress/components';
import { withSelect, withDispatch} from '@wordpress/data';
import { compose, withState } from '@wordpress/compose';

function PostCreator( { onClick, postTitle, setState } ) {
	return (
		<div className="cyoa-editor__post-creator">
			<TextControl
				className="cyoa-editor__new-post-title"
				placeholder={ __( 'No title' ) }
				label={ __( 'Create a new chapter' ) }
				value={ postTitle }
				onChange={ postTitle => setState( { postTitle } ) }
			/>
			<Button isDefault onClick={ onClick }>{ __( 'Create a new chapter' ) }</Button>
		</div>
	);
}

export default compose(
	withState( { postTitle: '' } ),
	withSelect( select => {
		const { getEntityRecords } = select( 'core' );
		const { getCurrentPostId, getEditedPostAttribute, getCurrentPostType } = select( 'core/editor' );
		const postId = getCurrentPostId();
		const postType = getCurrentPostType();
		const parentId = getEditedPostAttribute( 'parent' ) || postId;
		const query = {
			per_page: -1,
			parent: parentId,
			order: 'asc',
			status: [ 'any' ]
		};
		const posts = getEntityRecords( 'postType', postType, query ) || [];

		return {
			parentId,
			postType,
			posts,
			query
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => ( {
		onClick: () => {
			if ( ! ownProps.postTitle ) {
				return;
			}

			apiRequest( {
				path: '/wp/v2/cave-your-own-adventure',
				method: 'POST',
				data: {
					title: `${ ownProps.postTitle }`,
					parent: ownProps.parentId,
					status: 'draft',
				}
			} ).then( post => {
				ownProps.onCreate( post );
				dispatch( 'core' ).receiveEntityRecords(
					'postType',
					ownProps.postType,
					ownProps.posts.concat( post ),
					ownProps.query
				);
				const { savePost } = dispatch( 'core/editor' );
				savePost();
			});
		},
	} ) ),
)( PostCreator );