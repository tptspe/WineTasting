import storage from 'redux-persist/lib/storage';

import {appConstants, multiStepFormConstants, userConstants, routeConstants} from 'src/constants';

const defaultData = {
	isSideNavOpen: false,
	isOffCanvas: false,
	offCanvasClass: '',
	advancedOptions: {
		serverUrl: window.location.href.includes('localhost')
			? 'http://localhost:8000'
			: 'https://core.winenode.com',
		demoMode: false,
	},
	isSaving: false,
	afterSaveUrl: routeConstants.WINES,
	loadingText: '',
	initiatedLogout: false,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case appConstants.OPEN_SIDENAV:
			return {...state, isSideNavOpen: true};

		case appConstants.CLOSE_SIDENAV:
			return {...state, isSideNavOpen: false};

		case appConstants.SET_NAV_OFFCANVAS:
			return {
				...state,
				isOffCanvas: action.payload.isOffCanvas,
				offCanvasClass: action.payload.offCanvasClass,
			};

		case appConstants.SET_ADVANCED_OPTIONS:
			return {...state, advancedOptions: action.payload};

		case multiStepFormConstants.SUBMIT_START:
			return {...state, isSaving: true};

		case multiStepFormConstants.SUBMIT_FULFILLED:
			if (!action.payload.isOnline) {
				storage.removeItem('multiStepForm');

				return {
					...state,
					isSaving: false,
					afterSaveUrl: `${routeConstants.WINE_DETAILS}/${action.payload.ref}`,
					loadingText: action.payload.loadingText,
				};
			}

			return {
				...state,
				isSaving: false,
				afterSaveUrl: action.payload.afterSaveUrl,
				loadingText: action.payload.loadingText,
			};

		case `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`: {
			return {
				...state,
				afterSaveUrl: `${routeConstants.WINE_DETAILS}/${action.payload.data.ref}`,
			};
		}

		case multiStepFormConstants.SUBMIT_ERROR:
			return {
				...state,
				isSaving: false,
				afterSaveUrl: action.payload.afterSaveUrl,
				loadingText: action.payload.loadingText,
			};

		case userConstants.LOGIN_FULFILLED:
			return {...state, initiatedLogout: false};

		case userConstants.INITIATE_LOGOUT:
			return {...state, initiatedLogout: true, isSideNavOpen: false};

		default:
			return state;
	}
}

// todo: refactor nav related values into it's own sub-object of the app object
