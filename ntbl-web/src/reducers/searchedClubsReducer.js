import {clubsConstants, appConstants} from 'src/constants';

const defaultData = {
	data: [],
	error: null,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case clubsConstants.SEARCH_CLUBS: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case clubsConstants.SEARCH_CLUBS_FULFILLED: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case clubsConstants.SEARCH_CLUBS_REJECTED: {
			let data = Object.assign({}, state, {error: action.payload.error});
			return data;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}
		default:
			return state;
	}
}
