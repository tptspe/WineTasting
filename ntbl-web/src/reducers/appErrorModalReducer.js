import {appConstants} from 'src/constants';

let defaultData = {
	isOpen: false,
	message: '',
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.OPEN_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {
				isOpen: true,
				message: action.payload.message || action.payload.response.message,
			});
			return data;
		}

		case appConstants.TOGGLE_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {isOpen: action.payload});
			return data;
		}
		case appConstants.DISMISS_APP_ERROR_MODAL: {
			let data = Object.assign({}, state, {isOpen: false});
			return data;
		}

		default:
			return state;
	}
}
