import {signPath} from 'src/commons/commons';
import {commentsConstants} from 'src/constants';
import {_post, handleError} from 'src/commons/commons';

export function getAutoNote(notes, commentCallBack, commentKey) {
	const payload = {
		notes,
		lang: 'en',
	};

	return async (dispatch) => {
		let err, response;
		const signedPath = await signPath('/autonote', 'POST');
		[err, response] = await _post(signedPath, payload);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch));
			return;
		}

		commentCallBack({[commentKey]: response.data.message});
		dispatch({
			type: commentsConstants.GET_AUTONOTE_FULFILLED,
			payload: response.data,
		});
	};
}

function errorDispatch(dispatch, payload) {
	dispatch({type: commentsConstants.GET_AUTONOTE_ERROR, payload: payload.message});
}
