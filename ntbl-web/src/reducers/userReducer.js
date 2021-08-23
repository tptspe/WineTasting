import {userConstants} from 'src/constants';

const defaultData = {
	isLoggedIn: false,
	userData: {},
	error: null,
	message: '',
	status: null,
	showForgotPassword: false,
	passwordReset: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case userConstants.INITIATE_LOGIN: {
			return defaultData;
		}
		case userConstants.LOGIN_FULFILLED: {
			let data = Object.assign({}, state, {
				isLoggedIn: true,
				userData: action.payload,
			});
			return data;
		}
		case userConstants.LOGIN_FAILED: {
			let error = action.payload && action.payload.error ? action.payload.error : null;
			let showForgotPassword =
				action.payload && action.payload.showForgotPassword
					? action.payload.showForgotPassword
					: false;

			let data = Object.assign({}, state, {
				isLoggedIn: false,
				error: {login: error},
				showForgotPassword: showForgotPassword,
			});
			return data;
		}
		case userConstants.INITIATE_LOGOUT: {
			let data = Object.assign({}, state, defaultData);
			return data;
		}
		case userConstants.CREATE_SUCCESS: {
			let data = Object.assign({}, state, {
				message: action.payload.message,
				status: {reg: action.payload.status},
			});
			return data;
		}
		case userConstants.CREATE_ERROR: {
			let error = action.payload && action.payload.error ? action.payload.error : null;
			let data = Object.assign({}, state, {error: {reg: error}});
			return data;
		}
		case userConstants.RESET_PASS_SUCCESS: {
			let data = Object.assign({}, state, {passwordReset: action.payload});
			return data;
		}
		default:
			return state;
	}
}
