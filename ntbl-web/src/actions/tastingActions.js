import {signPath} from 'src/commons/commons';
import {userConstants} from 'src/constants';
import {_post, handleError} from 'src/commons/commons';

export function createTasting(tastingData, successCallback) {
	return async (dispatch) => {
		dispatch({type: userConstants.CREATE_START});
		let err, response;
		const signedPath = await signPath('/tasting', 'POST');
		[err, response] = await _post(signedPath, tastingData);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), userConstants.CREATE_ERROR);
			return;
		}

		dispatch({type: userConstants.CREATE_FULFILLED, payload: response.data});
		successCallback();
	};
}

function errorDispatch(dispatch, payload, type = '') {
	dispatch({type: type, payload: payload});
}
