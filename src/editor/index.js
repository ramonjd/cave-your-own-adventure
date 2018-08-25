/**
 * External dependencies
 */
import classNames from 'classnames';
import { get, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
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

/**
 * Internal dependencies
 */
import PostCreator from './components/post-creator';
import PostSelector from './components/post-selector';
import PostSave from './components/post-save';

// Editor styles.
import './editor.scss';


class CYOABlock {
	title = __( 'Cave your own adventure' );
	icon = 'book';
	category = 'widgets';
	attributes = {
		content: {
			type: 'array',
			source: 'children',
			selector: 'span',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
		}
	};

	edit = withSelect( ( select, state ) => ( {
		isNewPost: select('core/editor').isEditedPostNew(),
	} ) )( ( { attributes, setAttributes, isNewPost } ) => {

		const { content, url, className } = attributes;
		const blockClasses = classNames( className );
		return (
			<div className={ blockClasses }>
				{ isNewPost ?
					<PostSave onSave={ () => {} } /> : (
						<Fragment>
							<RichText
								tagName="span"
								value={ content }
								onChange={ content => setAttributes( { content } ) }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								multiline={ false }
								placeholder="You choose to enter the link text here..."
							/>
							{ url && <a href={ url }>{ url }</a> }
							<PostSelector onSelect={ url => setAttributes( { url } ) } />
							<PostCreator onCreate={ post => setAttributes( { url: post.link } ) } />
						</Fragment>
					)
				}
			</div>
		);
	} );

	save = ( { attributes } ) => {
		const { content, url, className } = attributes;
		return(
			<div className={ className }>
				<a href={ url } >
					<RichText.Content tagName="span" value={ content } />
				</a>
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
