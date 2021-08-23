import {userConstants} from 'src/constants';

let defaultData = {
	posting: false,
	posted: false,
	error: null,
	tastingData: {},
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case userConstants.CREATE_START: {
			let data = Object.assign({}, state, {posting: true});
			return data;
		}

		case userConstants.CREATE_FULFILLED: {
			let data = Object.assign({}, state, {
				posting: false,
				posted: true,
				tastingData: action.payload,
			});
			return data;
		}

		case userConstants.CREATE_ERROR: {
			let data = Object.assign({}, state, {
				posting: false,
				posted: false,
				error: action.payload,
			});
			return data;
		}

		default:
			return state;
	}
}
