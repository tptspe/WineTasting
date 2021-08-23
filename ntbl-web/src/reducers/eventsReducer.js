import dateFns from 'date-fns';
import {eventsConstants} from 'src/constants';

const defaultData = {
	data: [],
	error: null,
	isSaving: false,
	status: null,
	attendEventPermitted: false,
	redirectOwner: false,
	showCaseData: [],
	selectedEvent: null,
	tastingShowCaseData: {
		selectedTasting: null,
		type: '',
	},
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case eventsConstants.FETCH_EVENTS_PENDING: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.FETCH_EVENTS_FULFILLED: {
			const events = action.payload.data;
			let data = Object.assign({}, state, {
				data: events,
				status: null,
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.FETCH_EVENTS_REJECTED: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.CREATE_PENDING: {
			let data = Object.assign({}, state, {
				isSaving: true,
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.CREATE_SUCCESS: {
			const payload = Object.assign({}, action.payload.eventData, {
				start_date: dateFns.format(action.payload.eventData.start_date, 'YYYY-MM-DD HH:MM:SS'),
				end_date: dateFns.format(action.payload.eventData.end_date, 'YYYY-MM-DD HH:MM:SS'),
			});

			let newlyCreatedEvent = Object.assign({}, payload, {
				ref: action.payload.ref,
			});

			let newEvents = JSON.parse(JSON.stringify(state.data));

			newEvents.push(newlyCreatedEvent);
			let data = Object.assign({}, state, {
				data: newEvents,
				isSaving: false,
				status: 'success',
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});

			return data;
		}

		case `${eventsConstants.CREATE_SUCCESS}_COMMIT`: {
			let newEvents = JSON.parse(JSON.stringify(state.data));

			newEvents = newEvents.map((event) => {
				if (
					event.name === action.payload.data.name &&
					event.description === action.payload.data.description
				) {
					return action.payload.data;
				}

				return event;
			});

			let data = Object.assign({}, state, {
				data: newEvents,
				isSaving: false,
				status: 'success',
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});

			return data;
		}

		case eventsConstants.CREATE_ERROR: {
			let data = Object.assign({}, state, {
				isSaving: false,
				status: 'error',
				error: action.payload.error,
				attendEventPermitted: false,
				redirectOwner: false,
			});

			return data;
		}

		case eventsConstants.ATTEND_EVENT_FULFILLED: {
			let data = Object.assign({}, state, {
				attendEventPermitted: true,
				redirectOwner: false,
				showCaseData: action.payload.data,
				selectedEvent: action.payload.selectedEvent,
			});
			return data;
		}

		case eventsConstants.ATTEND_EVENT_REDIRECT_OWNER: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: true,
				showCaseData: action.payload.data,
				selectedEvent: action.payload.selectedEvent,
			});
			return data;
		}

		case eventsConstants.ATTEND_EVENT_REJECTED: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
			});
			return data;
		}

		case eventsConstants.RESET_EVENT_SHOWCASE: {
			let data = Object.assign({}, state, {
				attendEventPermitted: false,
				redirectOwner: false,
				showCaseData: [],
				selectedEvent: null,
			});
			return data;
		}

		case eventsConstants.SET_TASTING_SHOWCASE_DATA: {
			let data = Object.assign({}, state, {
				tastingShowCaseData: {
					selectedTasting: action.payload.selectedTasting,
					type: action.payload.type,
				},
			});
			return data;
		}

		default:
			return state;
	}
}
