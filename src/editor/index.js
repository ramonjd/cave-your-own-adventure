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
	MenuGroup, MenuItem, TextControl, SelectControl, PanelBody, Button, TabPanel
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
	} ) )( ( { className, attributes, setAttributes, isNewPost } ) => {

		const { content, url } = attributes;
		const blockClasses = classNames( className, 'cyoa-editor', {
			'is-content-empty': isEmpty( content ),
		} );
		return (
			<div className={ blockClasses }>
				{ isNewPost ?
					<PostSave onSave={ () => {} } /> : (
						<Fragment>
							<RichText
								className="cyoa-editor__choice-text"
								tagName="span"
								value={ content }
								onChange={ content => setAttributes( { content } ) }
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
								multiline={ false }
								placeholder="You choose to enter the link text here..."
							/>
							<div className="cyoa-editor__choice-link">
								<span>This choice links to the following chapter:</span>
								{ url ? ( <a href={ url }>{ url }</a> ) : <span>None so far!</span> }
							</div>
							<PostSelector selected={ url } onSelect={ url => setAttributes( { url } ) } />
						</Fragment>
					)
				}
			</div>
		);
	} );

	save = ( { attributes, className } ) => {
		const { content, url } = attributes;
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
