import classNames from 'classnames';
import {
	__
} from '@wordpress/i18n';
import {
	RichText,
	ColorPalette,
	registerBlockType,
	InspectorControls,
	BlockControls
} from '@wordpress/blocks';
import {
	Toolbar,
	BaseControl,
	IconButton
} from '@wordpress/components';

// Editor styles.
import './editor.scss';

class CYOABlock {
	title = __(' Cave your own adventure ');
	icon = 'book';
	category = 'widgets';
	attributes = {};

	edit = () => {
		return(
			<div className={ classNames( 'cyoa__editor' ) }>
				<p>Hello editor.</p>
			</div>
		);
	};

	save = () => {
		return(
			<div>
				<p>Hello saved content.</p>
			</div>
		);
	};
}

registerBlockType( 'cave-your-own-adventure/block', new CYOABlock() );