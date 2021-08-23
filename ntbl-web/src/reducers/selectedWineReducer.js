import {winesConstants, appConstants} from 'src/constants';

const defaultData = {
	data: null,
	error: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case winesConstants.FETCH_SELECTED_WINE: {
			let selectedWine = Object.assign({}, state, {data: action.payload});
			return selectedWine;
		}
		case winesConstants.FETCH_SELECTED_WINE_FULFILLED: {
			let selectedWine = Object.assign({}, state, {data: action.payload.data});
			return selectedWine;
		}
		case winesConstants.FETCH_SELECTED_WINE_REJECTED: {
			let date = Object.assign({}, state, {error: action.payload.error});
			return date;
		}
		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}
		default:
			return state;
	}
}
