import {signPath} from 'src/commons/commons';
import {appConstants, eventsConstants} from 'src/constants';
import {_get, handleError} from 'src/commons/commons';
import storage from 'redux-persist/lib/storage';

export function fetchEvents() {
	return async (dispatch) => {
		dispatch({type: eventsConstants.FETCH_EVENTS_PENDING});

		let err, response;
		const signedPath = await signPath('/events', 'GET');
		[err, response] = await _get(signedPath);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), eventsConstants.FETCH_EVENTS_REJECTED);
			return;
		}

		let eventsData = response.data;
		storage.setItem('events', JSON.stringify(eventsData));
		dispatch({type: eventsConstants.FETCH_EVENTS_FULFILLED, payload: {data: eventsData}});
	};
}

export function addEvent(eventData, addEventCallback = false) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.CREATE_PENDING, payload: null});

		const signedPath = await signPath('/event', 'POST');

		if (addEventCallback) {
			addEventCallback();
		}

		dispatch({
			type: eventsConstants.CREATE_SUCCESS,
			payload: {
				eventData,
				ref: eventData.name,
			},
			meta: {
				offline: {
					// the network action to execute:
					effect: {url: signedPath, method: 'POST', json: {...eventData}},
					// action to dispatch when effect succeeds:
					commit: {
						type: `${eventsConstants.CREATE_SUCCESS}_COMMIT`,
					},
					// action to dispatch if network action fails permanently:
					rollback: {
						type: `${appConstants.OPEN_APP_ERROR_MODAL}`,
					},
				},
			},
		});
	};
}

export function fetchSelectedEvent(eventRef, event) {
	return async (dispatch) => {
		if (!event) {
			dispatch({type: eventsConstants.FETCH_SELECTED_EVENT_PENDING});

			let err, response;
			const signedPath = await signPath(`/event/${eventRef}`, 'GET');
			[err, response] = await _get(signedPath);

			if (err) {
				errorDispatch(
					dispatch,
					handleError(err, dispatch),
					eventsConstants.FETCH_SELECTED_EVENT_REJECTED
				);
				return;
			}

			dispatch({
				type: eventsConstants.FETCH_SELECTED_EVENT_FULFILLED,
				payload: {data: response.data},
			});
		} else {
			dispatch({
				type: eventsConstants.FETCH_SELECTED_EVENT,
				payload: event,
			});
		}
	};
}

export function attendEvent(eventRef) {
	return async (dispatch) => {
		dispatch({type: eventsConstants.ATTEND_EVENT_PENDING});

		let err, response;
		const signedPath = await signPath(`/event/${eventRef}`, 'GET');
		[err, response] = await _get(signedPath);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), eventsConstants.ATTEND_EVENT_REJECTED);
			return;
		}

		let data = response.data;

		if (data && data.event_tastings) {
			dispatch({
				type: eventsConstants.ATTEND_EVENT_FULFILLED,
				payload: {
					selectedEvent: eventRef,
					data: data,
				},
			});
		} else if (data && data.ref) {
			dispatch({
				type: eventsConstants.ATTEND_EVENT_REDIRECT_OWNER,
				payload: {
					selectedEvent: eventRef,
					data: data,
				},
			});
		}
	};
}

export function resetEventShowcase() {
	return async (dispatch) => {
		dispatch({type: eventsConstants.RESET_EVENT_SHOWCASE});
	};
}

export function setTastingShowcaseData(type, selectedTasting) {
	return async (dispatch) => {
		dispatch({
			type: eventsConstants.SET_TASTING_SHOWCASE_DATA,
			payload: {
				type: type,
				selectedTasting: selectedTasting,
			},
		});
	};
}

function errorDispatch(dispatch, payload, type = '') {
	dispatch({type: type, payload: {error: payload}});
	dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: {message: payload.message}});
}
