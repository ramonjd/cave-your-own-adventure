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
			selector: 'p',
		},
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

	autoSave = compose( [
		withSelect( ( select ) => {
			return {
				parent: select( 'core/editor' ).getEditedPostAttribute( 'parent' ),
				isAutosaveable: select( 'core/editor' ).isAutosaveable(),
			};
		} ),
		withDispatch( ( dispatch ) => ( {
			autosavePage: dispatch( 'core/editor' ).autosave,
		} ) ),
	] )( ( { parent, isAutosaveable, autosavePage } ) => {
		if ( isAutosaveable() ) {
			autosavePage( parent );
		}

	} );

	createChapter = postId => {
		apiRequest( {
			path: '/wp/v2/cave-your-own-adventure',
			method: 'POST',
			data: {
				title: 'BOMB',
				parent: postId,
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
		// eslint-disable-next-line
		console.log( 'postTypeSlug', postTypeSlug );
		const query = {
			per_page: -1,
			parent: postId,
			order: 'asc',
			status: 'draft'
		};
		return {
			parent: getEditedPostAttribute( 'parent' ),
			items: isHierarchical ? getEntityRecords( 'postType', postTypeSlug, query ) : [],
			postId,
			postType,
			isHierarchical,
			isCurrentPostPublished,
			isEditedPostNew,
		};
	} )( ( { items, parent, postId, postType, isHierarchical, isEditedPostNew, className, content, setAttributes } ) => {
// eslint-disable-next-line
console.log( 'isEditedPostNew', isEditedPostNew(), postId );
		if ( isEditedPostNew() ) {
			return (
				<div>
				<p>To create story links, please save the page.</p>
					<Button isDefault onClick={ this.autoSave }>
						Save now
					</Button>
				</div>
			);
		}

		// eslint-disable-next-line
		console.log( 'edit', isHierarchical, items, parent, postId, postType, className );
		if ( ! items || items.length === 0 ) {
			return (
				<div>
					<p>You have not created any chapters for this adventure.</p>
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
			<div>
				Choose one to link to:
				{ items.map( item => {
					return (
						<p key={ item.id }>{ item.title.rendered }</p>
					)
				} )}
				<MyTextControl />
				<Button isDefault onClick={ () => this.createChapter( postId ) }>
					Create a new chapter
				</Button>
			</div>
		);
	} );

	save = () => {
		return(
			<div>

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
