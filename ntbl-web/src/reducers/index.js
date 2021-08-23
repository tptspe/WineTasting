import {combineReducers} from 'redux';
import {userConstants} from 'src/constants';
import {purgeStoredState} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import app from './appReducer';
import settings from './settingsReducer';
import user from './userReducer';
import wines from './winesReducer';
import tasting from './tastingReducer';
import selectedWine from './selectedWineReducer';
import multiStepForm from './multiStepFormReducer';
import comments from './commentsReducer';
import info from './infoReducer';
import feedback from './feedbackReducer';
import clubs from './clubsReducer';
import selectedClub from './selectedClubReducer';
import searchedClubs from './searchedClubsReducer';
import events from './eventsReducer';
import selectedEvent from './selectedEventReducer';
import appErrorModal from './appErrorModalReducer';

const appReducer = combineReducers({
	app,
	settings,
	user,
	wines,
	tasting,
	selectedWine,
	multiStepForm,
	comments,
	info,
	feedback,
	clubs,
	selectedClub,
	searchedClubs,
	events,
	selectedEvent,
	appErrorModal,
});

export const persistConfig = {
	key: 'root',
	storage,
};

export const rootReducer = (state, action) => {
	if (action.type === userConstants.INITIATE_LOGOUT) {
		purgeStoredState(persistConfig);
		state = undefined;
		window.location.href = '/';
	}
	return appReducer(state, action);
};
