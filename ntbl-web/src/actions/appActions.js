import {appConstants} from 'src/constants';

export function openSideNav() {
	return (dispatch) => {
		dispatch({
			type: appConstants.OPEN_SIDENAV,
		});
	};
}

export function closeSideNav() {
	return (dispatch) => {
		dispatch({
			type: appConstants.CLOSE_SIDENAV,
		});
	};
}

export function setOffCanvas(isOffCanvas = false, offCanvasClass) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_NAV_OFFCANVAS,
			payload: {isOffCanvas, offCanvasClass},
		});
	};
}

export function saveAdvancedOptions(advancedOptions) {
	return (dispatch) => {
		dispatch({
			type: appConstants.SET_ADVANCED_OPTIONS,
			payload: advancedOptions,
		});
	};
}
