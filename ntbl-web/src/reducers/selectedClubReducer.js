import {clubsConstants, appConstants} from 'src/constants';

const defaultData = {
	data: null,
	error: null,
	isSaving: false,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case clubsConstants.FETCH_SELECTED_CLUB: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case clubsConstants.FETCH_SELECTED_CLUB_FULFILLED: {
			let data = Object.assign({}, state, {data: action.payload.data});
			return data;
		}
		case clubsConstants.FETCH_SELECTED_CLUB_REJECTED: {
			let data = Object.assign({}, state, {error: action.payload.error});
			return data;
		}
		case clubsConstants.UPDATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}
		case clubsConstants.UPDATE_SUCCESS: {
			let data = Object.assign({}, state, {
				data: action.payload,
				isSaving: false,
				status: 'success',
			});
			return data;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}

		case clubsConstants.CLEAR_SELECTED_CLUB: {
			return defaultData;
		}

		default:
			return state;
	}
}
