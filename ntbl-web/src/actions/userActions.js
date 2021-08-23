import {basePath} from 'src/commons/shared';
import {signPath, clearCache} from 'src/commons/commons';
import {initiateLogin, exportBackup, getAuthCreationPayload} from 'src/ntbl_client/ntbl_api';
import {userConstants} from 'src/constants';
import {_get, _post} from 'src/commons/commons';
import storage from 'redux-persist/lib/storage';

export function loginUser(email, rawPass) {
	clearCache();
	return async (dispatch) => {
		dispatch({type: userConstants.INITIATE_LOGIN});

		let err, specsResponse, userResponse;
		const path = basePath + '/user?email=' + email;
		[err, specsResponse] = await _get(path);

		if (err) {
			errorDispatch(dispatch, handleError(err), userConstants.LOGIN_FAILED);
			return;
		}

		let specs = specsResponse.data;
		let userSpecs = {
			email: email,
			ref: specs.ref,
			salt: specs.salt,
			iterations: specs.iterations,
		};
		initiateLogin(rawPass, userSpecs.ref, userSpecs.salt, userSpecs.iterations);
		storage.setItem('mem', exportBackup());

		const pathToSign = '/user/' + userSpecs.ref;
		const signedPath = await signPath(pathToSign, 'GET');
		[err, userResponse] = await _get(signedPath);

		if (err) {
			errorDispatch(dispatch, handleError(err), userConstants.LOGIN_FAILED);
			return;
		}

		const userData = userResponse.data;
		if (userData.ref) {
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		} else {
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: null});
		}
	};
}

/*
Disabled loginUserByCache and checkForLoggedInUser as of 2018-12-20
export function loginUserByCache() {
	return (dispatch) => {
		dispatch({type: userConstants.INITIATE_LOGIN});
		if (userCacheExists()) {
			var userData = JSON.parse(localStorage.getItem('loggedinUser'));
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		} else {
			dispatch({type: userConstants.LOGIN_FAILED, payload: null});
		}
	};
}

export function checkForLoggedInUser(user, history, route = '/') {
	return (dispatch) => {
		dispatch({type: userConstants.CHECK_USER});
		if (!user.isLoggedIn && !userCacheExists()) {
			dispatch({type: userConstants.INITIATE_LOGOUT});
			window.location.href = route;
		}

		if (!user.isLoggedIn && userCacheExists()) {
			var userData = JSON.parse(localStorage.getItem('loggedinUser'));
			dispatch({type: userConstants.LOGIN_FULFILLED, payload: userData});
		}
	};
}
*/

export function logoutUser() {
	clearCache();
	return (dispatch) => {
		dispatch({
			type: userConstants.INITIATE_LOGOUT,
		});
	};
}

export function registerUser(email, rawPass) {
	return async (dispatch) => {
		let err, response;
		let signedUserData = getAuthCreationPayload(rawPass, email);
		const path = basePath + '/user';
		[err, response] = await _post(path, signedUserData);

		if (err) {
			errorDispatch(dispatch, handleError(err), userConstants.CREATE_ERROR);
			return;
		}

		dispatch({type: userConstants.CREATE_SUCCESS, payload: response.data});
	};
}

export function resetPassword(email) {
	return async (dispatch) => {
		let err, response;
		const path = basePath + '/user/access/resetf';
		const data = {email};
		[err, response] = await _post(path, data);

		if (err) {
			errorDispatch(dispatch, handleError(err), userConstants.RESET_PASS_ERROR);
			return;
		}

		dispatch({type: userConstants.RESET_PASS_SUCCESS, payload: response.data});
	};
}

export function handleError(error) {
	let payload = {error: {message: 'An error occured on the server'}};
	if (error.response) {
		if (error.response.status === 401) {
			payload = {error: {message: 'Invalid username or password'}, showForgotPassword: true};
		} else if (error.response.data) {
			payload = {error: {message: error.response.data.message}};
		}
	} else {
		payload = {error: {message: error.message}};
	}
	return payload;
}

function errorDispatch(dispatch, payload, type = '') {
	dispatch({type: type, payload: payload});
}
