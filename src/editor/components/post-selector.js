/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, SelectControl } from '@wordpress/components';
import { withSelect} from '@wordpress/data';
import { Component } from '@wordpress/element';

export class PostSelector extends Component {
	state = {
		url: '',
	};

	onSelectChange = url => this.setState( { url } );

	validateUrl = () => ! isEmpty( this.state.url );

	onClickButton = () => this.props.onSelect( this.validateUrl() ? this.state.url : this.props.options[ 0 ].value );

	render() {
		const { options } = this.props;

		if ( isEmpty( options ) ) {
			return null;
		}

		return (
			<div className="cyoa__editor-post-selector">
				<h3>{ __( 'Add a choice' ) }</h3>
				<SelectControl onChange={ this.onSelectChange } options={ options } />
				<Button isDefault onClick={ this.onClickButton }>{ __( 'Link to this post' ) }</Button>
			</div>
		);
	}
}

export default withSelect(
	( select, ownProps ) => {
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

		return {
			options: posts
				.filter( post => !! post.parent && post.id !== postId )
				.map( post => {
					return {
						label: post.title.rendered || __( 'No title' ),
						value: post.link,
					};
				} ),
		};
	},
)( PostSelector );