import {basePath} from './shared.js';
import {getRequestSignature} from 'src/ntbl_client/ntbl_api';
import {getFinalRating} from 'src/ntbl_client/ntbl_ratingAlgo';
import storage from 'redux-persist/lib/storage';
import crypto from 'crypto';
import appConfig from 'src/config/app';
import {appConstants} from 'src/constants';
import {store} from 'src/store';
import dateFns from 'date-fns';

export const signPath = async (pathToSign, method, callback = null) => {
	// Get user specs from local storage
	var mem = JSON.parse(await storage.getItem('mem'));

	if (mem == null) {
		return basePath + pathToSign;
	}

	// Generate signature
	let signature = getRequestSignature(method, pathToSign, mem.userRef, mem.hpass);
	let signedPath = basePath + pathToSign + '?who=' + signature;

	return signedPath;
};

export function getLabel(option, stringsToRemove = []) {
	// Clean the label from possible key and list of stringsToRemove
	let label = option;

	stringsToRemove.forEach((str) => {
		label = label.replace(str, '');
	});

	// Check if the label is more than one word
	if (label.indexOf('_') !== -1) {
		label = label.split('_');
		label = label.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
		});
	} else {
		label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
	}

	return label;
}

export function getTotalRatingPoints(rawRatings) {
	return getFinalRating({
		type: 'parker-1.0.0',
		scale: {
			min: 0,
			max: 1,
		},
		data: {
			balance: rawRatings.rating_balance_,
			length: rawRatings.rating_length_,
			intensity: rawRatings.rating_intensity_,
			senseofplace: rawRatings.rating_senseofplace_,
			complexity: rawRatings.rating_complexity_,
			quality: rawRatings.rating_quality_,
			drinkability: rawRatings.rating_drinkability_,
		},
	});

	/*
	let ratings = JSON.parse(JSON.stringify(rawRatings));
	let sumOfScales = 0;
	let basePoints = ratingConstants.BASE_POINTS;

	console.log('calculating points', ratings);

	if (ratings == null || Object.keys(ratings).length <= 0) {
		return basePoints;
	}

	// Remove parker_val from the RatingTotal computation
	if (Object.keys(ratings).includes('parker_val')) {
		delete ratings['parker_val'];
	}

	// Get all ratingItems
	Object.keys(ratings).forEach((key) => {
		//	Note: .toFixed converts the float val to string so it's needed to parse it twice;
		//	todo: parse the rating values before returning to client-side
		sumOfScales += ratings[key];

	});

	// Compute based on formula | Formula: The number displayed is then 50 + (50 * (sum of all scales)/number of scales )
	let total = Math.round(basePoints + 50 * (sumOfScales / Object.keys(ratings).length));
	return total;

	//*/
}

export function clearCache(history, route) {
	storage.removeItem('loggedinUser');
	storage.removeItem('userSpecs');
	storage.removeItem('wines');
	storage.removeItem('mem');
	storage.removeItem('groups');
	storage.removeItem('multiStepForm');
}

export function redirect(history, route) {
	history.push(route);
}

export function userCacheExists() {
	var loggedinUser = JSON.parse(localStorage.getItem('loggedinUser'));
	var mem = JSON.parse(localStorage.getItem('mem'));
	return loggedinUser !== undefined && loggedinUser !== null && (mem !== undefined && mem !== null);
}

export function md5(str) {
	return crypto
		.createHash('md5')
		.update(str)
		.digest('hex');
}

export function daysAgo(numOfDays) {
	let today = new Date();
	today.setDate(today.getDate() - numOfDays);
	return today;
}

export function areSameDates(date1, date2) {
	return (
		date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate()
	);
}

export function withinDateRange(date1, date2) {
	let today = new Date();
	let endDate = new Date(date2.getTime());
	endDate.setHours(0, 0, 0, 0); // set the beginning of endDate to midnight
	return date1.getTime() <= today.getTime() && date1.getTime() >= endDate.getTime();
}

export function isEmpty(item) {
	if (item === undefined || item === null) {
		return true;
	}
}

export function sortByName(arr) {
	if (
		arr === undefined ||
		arr === null ||
		Object.prototype.toString.call(arr) !== '[object Array]'
	) {
		return false;
	}

	arr.sort(function(a, b) {
		if (a['name'] && b['name']) {
			var nameA = a['name'].toUpperCase();
			var nameB = b['name'].toUpperCase();

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
}

export function setCoreApi(url) {
	if (appConfig.DEV_MODE) {
		store.dispatch({
			type: appConstants.SET_ADVANCED_OPTIONS,
			payload: {
				serverUrl: url,
			},
		});
	}
}

export function handleError(error, dispatch = null) {
	let payload = {message: 'An error occured on the server'};
	if (error.response) {
		if (error.response.status === 401) {
			payload = {message: "You're not authorized to access this resource"};
		} else if (error.response.data) {
			payload = error.response.data;
		}
	} else {
		payload = {message: error.message};
	}

	if (dispatch) {
		dispatch({type: appConstants.APP_ERROR, payload: payload});
		dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: payload});
	}

	return payload;
}

const _error = async (response) => {
	return response
		.json()
		.then((errorResponse) => {
			let message =
				errorResponse && errorResponse.message
					? errorResponse.message
					: `Status: ${response.status}, ${response.statusText}`;
			let error = {
				status: response.status,
				statusText: response.statusText,
				message: message,
			};
			if (errorResponse) {
				error['response'] = {};
				error.response['data'] = errorResponse;
			}
			return error;
		})
		.catch((error) => {
			error = {};
			error['response'] = {};
			error.response['status'] = response.status;
			return error;
		});
};

export const _get = async (path) => {
	let options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	/*if (!appConfig.DEV_MODE) {
		options.mode = 'no-cors';
	}*/

	let response = await fetch(path, options);
	if (!response.ok) {
		return [await _error(response)];
	}
	return [null, {data: await response.json()}];
};

export const _post = async (path, data) => {
	let options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	};

	/*if (!appConfig.DEV_MODE) {
		options.mode = 'no-cors';
	}*/

	let response = await fetch(path, options);
	if (!response.ok) {
		return [await _error(response)];
	}
	return [null, {data: await response.json()}];
};

export const getFullDateAndTime = (date) => {
	return dateFns.format(date, 'YYYY-MM-DD HH:MM:SS');
};
