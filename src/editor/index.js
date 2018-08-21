import classNames from 'classnames';
import { get } from 'lodash';
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

// Editor styles.
import './editor.scss';

const MyTextControl = withState( {
	className: '',
} )( ( { className, setState } ) => (
	<TextControl
		label="Chapter title"
		value={ className }
		onChange={ ( className ) => setState( { className } ) }
	/>
) );

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
/*
	edit = ( { attributes, setAttributes } ) => {
		const { content } = attributes;
		return(
			<div className={ classNames( 'cyoa__editor' ) }>
				<TextControl />

				<MenuGroup label="Settings">
					<MenuItem>
						<TextControl />
						<SelectControl
							options={ [
								{ label: 'Big', value: '100%' },
								{ label: 'Medium', value: '50%' },
								{ label: 'Small', value: '25%' },
							] }
						/>
					</MenuItem>
				</MenuGroup>
			</div>
		);
	};*/

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

	createChapter = parentId => {
		apiRequest( {
			path: '/wp/v2/cave-your-own-adventure',
			method: 'POST',
			data: {
				title: 'BOMB',
				parent: parentId,
			}
		} ).then( posts => {
			console.log( posts );
		} );
	};

	edit = withSelect( ( select ) => {
		const { getPostType, getEntityRecords } = select( 'core' );
		const { getCurrentPostId, getEditedPostAttribute, isCurrentPostPublished, isEditedPostNew } = select( 'core/editor' );
		const postTypeSlug = getEditedPostAttribute( 'type' );
		const postType = getPostType( postTypeSlug );
		const postId = getCurrentPostId();
		const isHierarchical = get( postType, [ 'hierarchical' ], false );
		const parentId = getEditedPostAttribute( 'parent' );
		const parentTitle = getEditedPostAttribute( 'title' );
		// eslint-disable-next-line
		console.log( 'postId', postId );
		const query = {
			per_page: -1,
			parent: isHierarchical ? parentId : postId,
			order: 'asc',
			status: 'draft'
		};
		const isNewPost = isEditedPostNew();
		// eslint-disable-next-line
		console.log( 'isNewPost in seclecasdfadf adsf a', isNewPost );
		return {
			parentId,
			items: getEntityRecords( 'postType', postTypeSlug, query ),
			postId,
			postType,
			isHierarchical,
			isCurrentPostPublished,
			isNewPost,
			parentTitle,
		};
	} )( ( { items, parentId, postId, postType, isHierarchical, isNewPost, className, content, setAttributes, parentTitle } ) => {
// eslint-disable-next-line
console.log( 'isNewPost', isNewPost, postId, parentTitle );
		if ( isNewPost ) {
			return (
				<div className={ className }>
					<p>Before we can add a choice, we need to save the post</p>
					{ this.renderSaveButton() }
				</div>
			);
		}

		// eslint-disable-next-line
		console.log( 'edit', isHierarchical, items, postType );
		console.log( 'postId',  postId );
		console.log( 'parent',  parentId );
		if ( ! items || items.length === 0 ) {
			return (
				<div className={ className }>
					<h3>Add a choice</h3>
					<RichText
						tagName="span"
						value={ content }
						onChange={ ( content ) => setAttributes( { content } ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						multiline={ false }
						placeholder="You choose to enter the link text here..."
					/>
					<h3>Select a chapter to link to</h3>
					{ items.map( item => {
						return (
							<p key={ item.id }><a href={ item.link }>{ item.title.rendered }</a></p>
						)
					} )}

					OR

					<h3>Create a new chapter</h3>
					<MyTextControl />
					<Button isDefault onClick={ () => this.createChapter( postId ) }>
						Create a new chapter
					</Button>
				</div>
			);
		}
// eslint-disable-next-line
console.log( 'items', items );
		return (
			<div className={ className }>
				<h3>Add a choice</h3>
				<RichText
					tagName="span"
					value={ content }
					onChange={ ( content ) => setAttributes( { content } ) }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					multiline={ false }
					placeholder="You choose to enter the link text here..."
				/>
				<h3>Select a chapter to link to</h3>
				{ items.map( item => {
					return (
						<p key={ item.id }><a href={ item.link }>{ item.title.rendered }</a></p>
					)
				} )}
				]

				OR

				<h3>Create a new chapter</h3>
				<MyTextControl />
				<Button isDefault onClick={ () => this.createChapter( postId ) }>
					Create a new chapter
				</Button>
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
