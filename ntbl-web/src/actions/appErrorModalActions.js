import {appConstants} from 'src/constants';

export function closeModal() {
	return (dispatch) => {
		dispatch({
			type: appConstants.DISMISS_APP_ERROR_MODAL,
			payload: null,
		});
	};
}
