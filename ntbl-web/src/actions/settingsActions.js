import {appConstants} from 'src/constants';

export function setActiveForm(activeForm) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_ACTIVE_FORM,
			payload: activeForm,
		});
	};
}
