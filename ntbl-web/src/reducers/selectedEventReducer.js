import {eventsConstants, appConstants} from 'src/constants';

const defaultData = {
	data: null,
	error: null,
	isSaving: false,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case eventsConstants.FETCH_SELECTED_EVENT: {
			let data = Object.assign({}, state, {data: action.payload});
			return data;
		}
		case eventsConstants.FETCH_SELECTED_EVENT_FULFILLED: {
			let data = Object.assign({}, state, {data: action.payload.data});
			return data;
		}
		case eventsConstants.FETCH_SELECTED_EVENT_REJECTED: {
			let data = Object.assign({}, state, {error: action.payload.error});
			return data;
		}
		case eventsConstants.UPDATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}
		case eventsConstants.UPDATE_SUCCESS: {
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
		default:
			return state;
	}
}
