/*
	Check whether the selected post points back to this one and warn about circular
 */
/**
 * External dependencies
 */
import classNames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { SelectControl } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose, withState } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
/**
 * Internal dependencies
 */
import PostCreator from './post-creator';

function PostSelector( { options, selected, onChange, onCreateNewPost, showCreatePost, setState } ) {
	const componentClasses = classNames( 'cyoa-editor__post-selector' );
	const iconClasses = classNames( 'dashicons dashicons-plus', {
		'is-active': showCreatePost,
	} );
	const hasOptions = options.length > 1;

	return (
		<Fragment>
			<div className={ componentClasses }>
				{
					! hasOptions
						? <span>There aren't any chapters to link to!</span>
						: (
							<SelectControl
								className="cyoa-editor__select"
								label={ __( 'Links to' ) }
								value={ selected }
								onChange={ onChange }
								options={ options }
								disabled={ showCreatePost }
							/>
						)
				}
				<span
					title={ __( 'Create a new chapter' ) }
					onClick={ () => setState( { showCreatePost: ! showCreatePost } ) }
					className={ iconClasses }
				/>
			</div>
			{ showCreatePost && <PostCreator onCreate={ onCreateNewPost }/> }
		</Fragment>
	);
}

export default compose(
	withState( { showCreatePost: false } ),
	withSelect( ( select, ownProps ) => {
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
		const options = posts
			.filter( post => !! post.parent && post.id !== postId )
			.map( post => ( {
				label: `${ post.title.rendered || __( 'No title' ) } - ${ dateI18n( 'M d Y, h:m:s a', post.date ) }`,
				value: post.link,
			} ) );
		options.unshift( {
			label: __( 'Select a chapter' ),
			value: '',
		} );
		return {
			options,
			onCreateNewPost: newPost => {
				ownProps.onSelect( newPost.link );
				ownProps.setState( { showCreatePost: false } );
			},
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => ( {
		onChange: value => {
			ownProps.onSelect( ! isEmpty( value ) ? value : '' );
			const { savePost } = dispatch( 'core/editor' );
			savePost();
		},
	} ) ),
)( PostSelector );