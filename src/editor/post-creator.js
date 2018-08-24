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

import {
	dateI18n
} from '@wordpress/date';

import apiRequest from '@wordpress/api-request';

export default class PostCreator extends Component {

	state = {
		postTitle: '',
	};

	onTextChange = postTitle => this.setState( { postTitle } );

	validateTitle = () => ! isEmpty( this.state.postTitle );

	createRequest = ( parentId, parentTitle = 'New Chapter' ) => {
		apiRequest( {
			path: '/wp/v2/cave-your-own-adventure',
			method: 'POST',
			data: {
				title: `${ parentTitle }-${ dateI18n( 'M d Y, h:m:s a' ) }`,
				parent: parentId,
			}
		} ).then( posts => {
			console.log( posts );
		} );
	};

	renderCreateButton = withSelect( ( select ) => {
		const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
		const parentId = getEditedPostAttribute( 'parent' ) || getCurrentPostId();
		return {
			onClick: () => ! this.validateTitle() ? false : this.createRequest( parentId, this.state.postTitle ),
		};
	} )( ( { onClick } ) =>  <Button isDefault onClick={ onClick }> Create a new chapter </Button> );

	render() {
		return (
			<div className="cyoa__editor-create-post">
				<TextControl
					placeholder="No title"
					label="Create a new chapter"
					value={ this.state.postTitle }
					onChange={ this.onTextChange }
				/>
				{ this.renderCreateButton() }
			</div>
		);
	}
}