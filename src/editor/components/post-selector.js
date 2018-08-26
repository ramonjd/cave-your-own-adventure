/*
	Check whether the selected post points back to this one and warn about circular
 */

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { SelectControl, Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {withState} from "@example/wordpress/compose";

function PostSelector( { options, selected, onChange, onClick, url, setState } ) {
	return (
		<div className="cyoa__editor-post-selector">
			{ isEmpty( options )
				? <p>You haven't created any chapters yet!</p>
				: (
					<SelectControl
						label={ __( 'Select a chapter' ) }
						value={ url || selected }
						onChange={ url => setState( { url } ) }
						options={ options }
					/>
				)
			}
			<Button isDefault onClick={ onClick }>{ __( 'Link to this post' ) }</Button>
		</div>
	);
}

export default compose(
	withState( { url: '' } ),
	withSelect( ( select, ownProps ) => {
		const { getEntityRecords } = select( 'core' );
		const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
		const postId = getCurrentPostId();
		const query = {
			per_page: -1,
			parent: getEditedPostAttribute( 'parent' ) || postId,
			order: 'asc',
			status: [ 'any' ]
		};
		const posts = getEntityRecords( 'postType', getEditedPostAttribute( 'type' ), query ) || [];
		const options = posts
			.filter( post => !! post.parent && post.id !== postId )
			.map( post => {
				return {
					label: `${ post.title.rendered || __( 'No title' ) } - ${ dateI18n( 'M d Y, h:m:s a', post.date ) }`,
					value: post.link,
				};
			} );

		return {
			options,
			onClick: () => {
				ownProps.onSelect( ! isEmpty( ownProps.url ) ? ownProps.url : options[ 0 ].value );
			},
		};
	} ),
)( PostSelector );