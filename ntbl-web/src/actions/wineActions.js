import dateFns from 'date-fns';
import storage from 'redux-persist/lib/storage';

import {_get, handleError, signPath} from 'src/commons/commons';
import {winesConstants} from 'src/constants';
import filtersJson from 'src/assets/json/filters.json';
import level3 from 'src/assets/json/tasting/level3.json';

export function fetchWines(sortBy) {
	return async (dispatch) => {
		dispatch({type: winesConstants.FETCH_WINES_PENDING});

		let err, response;
		const signedPath = await signPath('/tastings', 'GET');

		[err, response] = await _get(signedPath);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), winesConstants.FETCH_WINES_REJECTED);
			return;
		}

		let sortedWines = _sortWines(response.data, sortBy);
		storage.setItem('wines', JSON.stringify(sortedWines));
		dispatch({type: winesConstants.FETCH_WINES_FULFILLED, payload: {data: sortedWines}});
	};
}

export function fetchSelectedWine(wineRef, wine) {
	return async (dispatch) => {
		// If wine is not in the storage; Do a fetch to the server;
		if (!wine) {
			dispatch({type: winesConstants.FETCH_SELECTED_WINE_PENDING});

			let err, response;
			const signedPath = await signPath(`/tasting/${wineRef}`, 'GET');
			[err, response] = await _get(signedPath);

			if (err) {
				errorDispatch(
					dispatch,
					handleError(err, dispatch),
					winesConstants.FETCH_SELECTED_WINE_REJECTED
				);
				return;
			}

			dispatch({
				type: winesConstants.FETCH_SELECTED_WINE_FULFILLED,
				payload: {data: response.data},
			});
		} else {
			dispatch({
				type: winesConstants.FETCH_SELECTED_WINE,
				payload: wine,
			});
		}
	};
}

export function searchWines(keyword, sortBy) {
	return async (dispatch) => {
		let wines = JSON.parse(await storage.getItem('wines'));
		let newWines = _sortWines(_searchWines(wines, keyword, 'name'), wines.sortBy);
		dispatch({
			type: winesConstants.SEARCH_WINES,
			payload: newWines,
		});
	};
}

export function sortWines(wines, sortBy) {
	let newWines = JSON.parse(JSON.stringify(wines.data));
	let sortedWines = _sortWines(newWines, sortBy);
	return (dispatch) => {
		dispatch({
			type: winesConstants.SORT_WINES,
			payload: {
				sortedWines,
				sortBy,
			},
		});
	};
}

export function saveSortCollapseState(collapseState, sortStatus) {
	return async (dispatch) => {
		let newSortStatus = sortStatus;

		if (collapseState) {
			newSortStatus['collapseState'] = collapseState;
		}

		dispatch({
			type: winesConstants.SAVE_COLLAPSE_STATE,
			payload: newSortStatus,
		});
	};
}

export function filterWines(checkedFilters, sortBy) {
	return async (dispatch) => {
		let wines = JSON.parse(await storage.getItem('wines'));

		if (checkedFilters && checkedFilters.length > 0) {
			wines = _sortWines(_filterWines(wines, checkedFilters), sortBy);
		}

		dispatch({
			type: winesConstants.FILTER_WINES,
			payload: wines,
		});
	};
}

function errorDispatch(dispatch, payload, type = '') {
	dispatch({type: type, payload: {error: payload}});
}

function _sortWines(wines, by) {
	let sortedWines = [];

	if (wines) {
		sortedWines = JSON.parse(JSON.stringify(wines));
	}

	switch (by) {
		case 'name':
		case 'country':
			// sort by str
			sortedWines.sort(function(a, b) {
				if (a[by] && b[by]) {
					var nameA = a[by].toUpperCase();
					var nameB = b[by].toUpperCase();

					if (nameA < nameB) {
						return -1;
					}

					if (nameA > nameB) {
						return 1;
					}

					// names must be equal
					return 0;
				}

				return false;
			});
			break;
		case 'rating':
			// sort by numeric value
			sortedWines.sort(function(a, b) {
				if (a.rating.parker_val && b.rating.parker_val) {
					return a.rating.parker_val - b.rating.parker_val;
				}

				return false;
			});
			break;
		case 'price':
			// sort by numeric value
			sortedWines.sort(function(a, b) {
				if (a[by] && b[by]) {
					return a[by] - b[by];
				}

				return false;
			});
			break;
		case 'date':
			// sort by date
			sortedWines.sort(function(a, b) {
				if (a.created_at && a.created_at.date && (b.created_at && b.created_at.date)) {
					return dateFns.parse(a.created_at.date) - dateFns.parse(b.created_at.date);
				}

				return false;
			});
			break;
		default:
		// do nothing
	}

	return sortedWines;
}

function _searchWines(wines, keyword, by) {
	let newWines = wines.filter((wine) => {
		return wine[by].toLowerCase().includes(keyword.toLowerCase());
	});
	return newWines;
}

function _filterWines(wines, checkedFilters) {
	let newWines = [];
	let finalFilters = checkedFilters.filter((filter) => {
		return !filtersJson.keys.includes(filter);
	});

	finalFilters.forEach((filter) => {
		// loop through a wines and its notes
		wines.forEach((wine) => {
			if (wine.notes && wine.notes.length > 0) {
				wine.notes.forEach((note) => {
					// Check if wine has a note equal to the filter (Workd for Type and Color filters)
					if (filter === note) {
						newWines.push(wine);
						return null;
					}
				});
			}

			if (wine.notes && wine.notes.length > 0) {
				wine.notes.forEach((note) => {
					// Check if wine belongs to any group (works for Color filter)
					if (level3[filter] && level3[filter].includes(note)) {
						newWines.push(wine);
						return null;
					}
				});
			}

			// Check if wine belongs to an origin (works for origin filter)
			if (
				level3[filter] &&
				(level3[filter].includes(wine.country) || level3[filter].includes(wine.region))
			) {
				level3[filter].forEach((filter) => {
					if (
						filter.toLowerCase() === wine.country.toLowerCase() ||
						filter.toLowerCase() === wine.region.toLowerCase()
					) {
						newWines.push(wine);
						return null;
					}
				});
			}
		});
	});

	return newWines.filter(function(v, i, a) {
		return i === a.indexOf(v);
	}); //remove duplicate items before returning
}
