import {
	__
} from '@wordpress/i18n';
import { get, isEmpty } from 'lodash';
import {
	TextControl,
	Button,
} from '@wordpress/components';
import { withSelect} from '@wordpress/data';

import {
	Component
} from '@wordpress/element';

import apiRequest from '@wordpress/api-request';

export class PostCreator extends Component {

	state = {
		postTitle: '',
	};

	onTextChange = postTitle => this.setState( { postTitle } );

	validateTitle = () => ! isEmpty( this.state.postTitle );

	createRequest = () => {
		if ( ! this.validateTitle() ) {
			return;
		}

		const { parentId, onCreate } = this.props;

		apiRequest( {
			path: '/wp/v2/cave-your-own-adventure',
			method: 'POST',
			data: {
				title: `${ this.state.postTitle }`,
				parent: parentId,
			}
		} ).then( post => onCreate( post ) );
	};

	render() {
		return (
			<div className="cyoa__editor-post-creator">
				<TextControl
					placeholder={ __( 'No title' ) }
					label={ __( 'Create a new chapter' ) }
					value={ this.state.postTitle }
					onChange={ this.onTextChange }
				/>
				<Button isDefault onClick={ this.createRequest }>{ __( 'Create a new chapter' ) }</Button>
			</div>
		);
	}
}

export default withSelect(
	( select, ownProps ) => {
		const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
		const parentId = getEditedPostAttribute( 'parent' ) || getCurrentPostId();
		return {
			parentId
		};
	},
)( PostCreator );