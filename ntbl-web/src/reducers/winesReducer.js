import dateFns from 'date-fns';
import {winesConstants, appConstants, multiStepFormConstants} from 'src/constants';

const defaultData = {
	sortBy: 'date',
	sortStatus: {},
	data: null,
	error: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case winesConstants.FETCH_WINES_PENDING: {
			return state;
		}

		case winesConstants.FETCH_WINES_FULFILLED: {
			let newData = JSON.parse(JSON.stringify(state));
			let wines = action.payload.data.slice(0, 10); //return only first 10 items

			// Add temp ids
			wines = wines.map((wine, index) => {
				wine.id = index + 1;
				return wine;
			});

			let newSortStatus = newData.sortStatus;
			let newSortBy = newData.sortBy;

			return Object.assign({}, newData, {
				data: wines,
				sortStatus: newSortStatus,
				sortBy: newSortBy,
			});
		}

		case multiStepFormConstants.SUBMIT_FULFILLED: {
			const payload = Object.assign({}, action.payload, {
				ref: action.payload.name,
				id: state.data.length + 1,
				created_at: {
					date: dateFns.format(new Date()),
					timezone_type: 3,
					timezone: 'UTC',
				},
			});

			return {
				...state,
				data: [payload, ...state.data],
			};
		}

		case winesConstants.FETCH_WINES_REJECTED: {
			let date = Object.assign({}, state, {error: action.payload.error});
			return date;
		}

		case appConstants.RRS_DISMISS_SNACK: {
			let data = Object.assign({}, state, {error: null});
			return data;
		}

		case winesConstants.SEARCH_WINES: {
			let newWines = action.payload;
			return Object.assign({}, state, {data: newWines});
		}

		case winesConstants.SORT_WINES: {
			let sortedWines = action.payload.sortedWines;
			let newSortBy = action.payload.sortBy;
			return Object.assign({}, state, {data: sortedWines, sortBy: newSortBy});
		}

		case winesConstants.FILTER_WINES: {
			let newWines = action.payload;
			return Object.assign({}, state, {data: newWines});
		}

		case winesConstants.SAVE_COLLAPSE_STATE: {
			return Object.assign({}, state, {sortStatus: action.payload});
		}

		default:
			return state;
	}
}
