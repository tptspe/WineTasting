import {signPath} from 'src/commons/commons';
import {feedbackConstants} from 'src/constants';
import {_post, handleError} from 'src/commons/commons';

export function sendFeedback(feedback, callback) {
	return async (dispatch) => {
		let err, response;
		const signedPath = await signPath('/feedback', 'POST');
		[err, response] = await _post(signedPath, feedback);

		if (err) {
			errorDispatch(dispatch, handleError(err));
			return;
		}

		if (callback) {
			callback();
		}

		dispatch({
			type: feedbackConstants.SEND_FEEDBACK_FULFILLED,
			payload: response.data,
		});
	};
}

function errorDispatch(dispatch, payload) {
	dispatch({type: feedbackConstants.SEND_FEEDBACK_ERROR, payload: payload.message});
}
