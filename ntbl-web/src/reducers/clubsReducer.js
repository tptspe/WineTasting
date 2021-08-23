import {clubsConstants} from 'src/constants';

const defaultData = {
	data: [],
	error: null,
	isSaving: false,
	status: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case clubsConstants.FETCH_CLUBS_PENDING: {
			let data = Object.assign({}, state);
			return data;
		}

		case clubsConstants.FETCH_CLUBS_FULFILLED: {
			const clubs = action.payload.data;
			let data = Object.assign({}, state, {data: clubs, status: null});
			return data;
		}

		case clubsConstants.FETCH_CLUBS_REJECTED: {
			let data = Object.assign({}, state);
			return data;
		}

		case clubsConstants.CREATE_PENDING: {
			let data = Object.assign({}, state, {isSaving: true});
			return data;
		}

		case clubsConstants.CREATE_SUCCESS: {
			let newlyCreatedGroup = action.payload.data;
			let newGroups = JSON.parse(JSON.stringify(state.data));

			if (!newGroups.find((group) => group.handle === newlyCreatedGroup.handle)) {
				newGroups.push(newlyCreatedGroup);
			}
			let data = Object.assign({}, state, {data: newGroups, isSaving: false, status: 'success'});
			return data;
		}

		case `${clubsConstants.CREATE_SUCCESS}_COMMIT`: {
			let newClubs = JSON.parse(JSON.stringify(state.data));

			newClubs = newClubs.map((club) => {
				if (
					club.name === action.payload.data.name &&
					club.handle === action.payload.data.handle &&
					club.description === action.payload.data.description
				) {
					return action.payload.data;
				}

				return club;
			});

			return {
				...state,
				data: newClubs,
			};
		}

		case clubsConstants.CREATE_ERROR: {
			let data = Object.assign({}, state, {
				isSaving: false,
				status: 'error',
				error: action.payload.error,
			});
			return data;
		}

		default:
			return state;
	}
}
