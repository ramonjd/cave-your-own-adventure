import classNames from 'classnames';
import { get, isEmpty } from 'lodash';
import {
	registerBlockType,
} from '@wordpress/blocks';
import {
	__
} from '@wordpress/i18n';
import {
	RichText,
	ColorPalette,
	InspectorControls,
	BlockControls,
	Classic,
	InnerBlocks
} from '@wordpress/editor';
import {
	Toolbar,
	BaseControl,
	IconButton,
	MenuGroup, MenuItem, TextControl, SelectControl, PanelBody, Button
} from '@wordpress/components';

import {
	createElement, Fragment
} from '@wordpress/element';

import { compose, createHigherOrderComponent, withState } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { withSelect, withDispatch } from '@wordpress/data';
import apiRequest from '@wordpress/api-request';

import PostCreator from './post-creator';

// Editor styles.
import './editor.scss';


class CYOABlock {
	title = __(' Cave your own adventure ');
	icon = 'book';
	category = 'widgets';
	attributes = {
		content: {
			type: 'array',
			source: 'children',
			selector: 'span',
		},

		url: {
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
		}
	};

	// TODO: create component
	renderSavedPosts = ( items, postId ) => {
		const options = items
			.filter( item => !! item.parent && item.id !== postId )
			.map( item => {
			return {
				label: item.title.rendered || 'No title',
				value: item.id,
			};
/*			return (
				<p key={ item.id }><a href={ item.link }>{ item.title.rendered || 'No title' }</a></p>
			)*/
		} );

		if ( isEmpty( options) ) {
			return null;
		}

		return (
			<div className="cyoa__editor-saved-posts">
				<h3>Add a choice</h3>
				<MenuGroup label="Select a chapter to link to">
					<MenuItem>
						<SelectControl options={ options } />
					</MenuItem>
				</MenuGroup>
			</div>
		);

	};

	renderSaveButton = compose( [
		withSelect( ( select ) => {
			const { getEditedPostAttribute } = select( 'core/editor' );
			return {
				parent: getEditedPostAttribute( 'parent' ),
			};
		} ),
		withDispatch( ( dispatch ) => {
			const { editPost, savePost } = dispatch( 'core/editor' );
			return {
				onClick: () => {
					console.log( 'WWWWAAAAA',  );
					editPost( { status: 'draft' } );
					savePost();
				}
			};
		} ),
	] )( ( { onClick } ) =>  <Button isDefault onClick={ onClick }> Save now </Button> );

	renderSavedStoryChapters = withSelect( ( select ) => {
		const { getPostType, getEntityRecords } = select( 'core' );
		const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
		const postId = getCurrentPostId();
		const query = {
			per_page: -1,
			parent: getEditedPostAttribute( 'parent' ) || postId,
			order: 'asc',
			status: [ 'any' ]
		};
		const items = getEntityRecords( 'postType', getEditedPostAttribute( 'type' ), query ) || [];
		return {
			items,
			postId,
		};
	} )( ( { items, postId } ) => {
		const options = items
			.filter( item => !! item.parent && item.id !== postId )
			.map( item => {
				return {
					label: item.title.rendered || 'No title',
					value: item.id,
				};
				/*			return (
								<p key={ item.id }><a href={ item.link }>{ item.title.rendered || 'No title' }</a></p>
							)*/
			} );

		if ( isEmpty( options) ) {
			return null;
		}

		return (
			<div className="cyoa__editor-saved-posts">
				<h3>Add a choice</h3>
				<MenuGroup label="Select a chapter to link to">
					<MenuItem>
						<SelectControl options={ options } />
					</MenuItem>
				</MenuGroup>
				<Button isDefault> Select link </Button>
			</div>
		);
	} );


	edit = withSelect( ( select ) => {
		const { getPostType, getEntityRecords } = select( 'core' );
		const { getCurrentPostId, getEditedPostAttribute, isCurrentPostPublished, isEditedPostNew } = select( 'core/editor' );
		const postTypeSlug = getEditedPostAttribute( 'type' );
		const postType = getPostType( postTypeSlug );
		const postId = getCurrentPostId();
		const isHierarchical = get( postType, [ 'hierarchical' ], false );
		const parentId = getEditedPostAttribute( 'parent' );
		const parentTitle = getEditedPostAttribute( 'title' );

		const query = {
			per_page: -1,
			parent: parentId || postId,
			order: 'asc',
			status: 'draft'
		};
		const isNewPost = isEditedPostNew();
		// eslint-disable-next-line
		console.log( 'isNewPost in seclecasdfadf adsf a', isNewPost );
		const items = getEntityRecords( 'postType', postTypeSlug, query );
		return {
			parentId,
			items,
			postId,
			postType,
			isHierarchical,
			isCurrentPostPublished,
			isNewPost,
			parentTitle,
		};
	} )( ( { items, parentId, postId, postType, isHierarchical, isNewPost, className, content, setAttributes, parentTitle } ) => {

		if ( isNewPost ) {
			return (
				<div className={ className }>
					<p>Before we can add a choice, we need to save the post</p>
					{ this.renderSaveButton() }
				</div>
			);
		}

		return (
			<div className={ className }>
				<RichText
					tagName="span"
					value={ content }
					onChange={ ( content ) => setAttributes( { content } ) }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					multiline={ false }
					placeholder="You choose to enter the link text here..."
				/>
				{ this.renderSavedStoryChapters() }
				<PostCreator onCreated={ } />
			</div>
		);
	} );

	save = ( { attributes } ) => {
		const { content, className } = attributes;
		return(
			<div className={ className }>
				<RichText.Content tagName="span" value={ content } />
			</div>
		);
	};
}

registerBlockType( 'cave-your-own-adventure/block', new CYOABlock() );

// here we can show the story structure with a tree navigation
// https://wordpress.org/gutenberg/handbook/components/tree-select/ ?
const withInspectorControls = createHigherOrderComponent( function( BlockEdit ) {
	return function( props ) {
		return createElement(
			Fragment,
			{},
			createElement(
				BlockEdit,
				props
			),
			createElement(
				InspectorControls,
				{},
				createElement(
					PanelBody,
					{},
					'My custom control'
				)
			)
		);
	};
}, 'withInspectorControls' );

addFilter( 'editor.BlockEdit', 'my-plugin/with-inspector-controls', withInspectorControls );
