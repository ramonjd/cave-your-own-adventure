
import { SET_CHILD_CHAPTERS, SET_CURRENT_STORY_ID } from './action-types';
import { select, registerStore } from '@wordpress/data';

const DEFAULT_STATE = {
	currentStoryParentId: 0,
	// id: []
	childChapters: [],
};

const actions = {
	setCurrentStoryParentId( parentId ) {
		return {
			type: SET_CURRENT_STORY_ID,
			parentId,
		};
	},
	setChildChapters( childChapters ) {
		return {
			type: SET_CHILD_CHAPTERS,
			childChapters
		};
	},
};

registerStore( 'cyoa', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case SET_CURRENT_STORY_ID:
				return {
					...state,
					currentStoryParentId: action.parentId,
				};

			case SET_CHILD_CHAPTERS:
				const childChapters = action.childChapters
					.filter( item => !! item.parent && item.id !== state.currentStoryParentId )
				return {
					...state,
					childChapters,
				};
		}
		return state;
	},

	actions,

	selectors: {
		getChildChapters( state ) {
			return state.childChapters;
		},
		getCurrentStoryParentId( state ) {
			return state.currentStoryParentId;
		},
	},

	resolvers: {
		* getChildChapters() {
			const { getEntityRecords } = select( 'core' );
			const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
			const postId = getCurrentPostId();
			const query = {
				per_page: -1,
				parent: getEditedPostAttribute( 'parent' ) || postId,
				order: 'asc',
				status: [ 'any' ]
			};
			const childChapters = getEntityRecords( 'postType', getEditedPostAttribute( 'type' ), query ) || [];
			actions.setChildChapters( childChapters );
		},
		* getCurrentStoryParentId() {
			const { getCurrentPostId, getEditedPostAttribute } = select( 'core/editor' );
			const postId = getCurrentPostId();
			action.setCurrentStoryParentId( getEditedPostAttribute( 'parent' ) || postId );
		}
	},
} );