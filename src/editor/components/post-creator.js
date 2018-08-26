
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
		<div className="cyoa__editor-post-creator">
			<TextControl
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
		const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
		const { getEntityRecords } = select( 'core' );
		const postId = getCurrentPostId();
		const parentId = getEditedPostAttribute( 'parent' ) || postId;
		const postType = getEditedPostAttribute( 'type' );
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
			posts: posts.filter( post => !! post.parent && post.id !== postId ),
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
				}
			} ).then( post => {
				ownProps.onCreate( post );
				dispatch( 'core' ).receiveEntityRecords(
					'postType',
					ownProps.postType,
					ownProps.posts.concat( post ),
					ownProps.query
				);
			});

		},
	} ) ),
)( PostCreator );