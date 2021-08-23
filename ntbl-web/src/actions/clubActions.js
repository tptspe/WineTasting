import dateFns from 'date-fns';
import {signPath} from 'src/commons/commons';
import {appConstants, clubsConstants} from 'src/constants';
import {_get, handleError} from 'src/commons/commons';
import storage from 'redux-persist/lib/storage';

export function fetchClubs() {
	return async (dispatch) => {
		dispatch({type: clubsConstants.FETCH_CLUBS_PENDING});

		let err, response;
		const signedPath = await signPath('/groups', 'GET');
		[err, response] = await _get(signedPath);

		if (err) {
			errorDispatch(dispatch, handleError(err, dispatch), clubsConstants.FETCH_CLUBS_REJECTED);
			return;
		}

		let groupsData = response.data;
		storage.setItem('groups', JSON.stringify(groupsData));
		dispatch({type: clubsConstants.FETCH_CLUBS_FULFILLED, payload: {data: groupsData}});
	};
}

export function addClub(groupData, addGroupCallback = false) {
	return async (dispatch) => {
		dispatch({type: clubsConstants.CREATE_PENDING});

		const signedPath = await signPath('/group', 'POST');

		if (addGroupCallback) {
			addGroupCallback();
		}

		let groups = JSON.parse(await storage.getItem('groups'));

		// Validate for duplicate handler.
		const isValid = validationCheck((groups = []), groupData, dispatch);

		if (isValid) {
			const groupDataWithInfo = Object.assign({}, groupData, {
				userRelations: ['creator', 'owner'],
				created_at: dateFns.format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
				updated_at: dateFns.format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
			});
			groups = [...groups, groupDataWithInfo];

			storage.setItem('groups', JSON.stringify(groups));

			dispatch({
				type: clubsConstants.CREATE_SUCCESS,
				payload: {data: groupDataWithInfo},
				meta: {
					offline: {
						// the network action to execute:
						effect: {url: signedPath, method: 'POST', json: {...groupData}},
						// action to dispatch when effect succeeds:
						commit: {type: `${clubsConstants.CREATE_SUCCESS}_COMMIT`},
						// action to dispatch if network action fails permanently:
						rollback: {type: appConstants.OPEN_APP_ERROR_MODAL},
					},
				},
			});
		}
	};
}

export function updateClub(groupRef, groupData) {
	return async (dispatch) => {
		dispatch({type: clubsConstants.UPDATE_PENDING});

		const signedPath = await signPath(`/group/${groupRef}`, 'POST');

		const payload = {
			handle: groupData.handle,
			description: groupData.description,
		};

		dispatch({
			type: clubsConstants.UPDATE_SUCCESS,
			payload: {...groupData},
			meta: {
				offline: {
					// the network action to execute:
					effect: {url: signedPath, method: 'POST', json: {...payload}},
					// action to dispatch when effect succeeds:
					commit: {type: `${clubsConstants.UPDATE_SUCCESS}_COMMIT`},
					// action to dispatch if network action fails permanently:
					rollback: {type: appConstants.OPEN_APP_ERROR_MODAL},
				},
			},
		});
	};
}

export function fetchSelectedClub(clubHandle, clubs = []) {
	return async (dispatch) => {
		let selectedClub = null;

		// Check if club is stored in the storage

		clubs.forEach((club) => {
			if (club.handle === clubHandle) {
				selectedClub = club;
			}
		});

		// If group is not in the storage; Do a fetch to the server;
		if (selectedClub === null) {
			dispatch({type: clubsConstants.FETCH_SELECTED_CLUB_PENDING});

			let err, response;
			const signedPath = await signPath(`/group/@${clubHandle}`, 'GET');
			[err, response] = await _get(signedPath);

			if (err) {
				errorDispatch(
					dispatch,
					handleError(err, dispatch),
					clubsConstants.FETCH_SELECTED_CLUB_REJECTED
				);
				return;
			}

			dispatch({
				type: clubsConstants.FETCH_SELECTED_CLUB_FULFILLED,
				payload: {data: response.data},
			});
		} else {
			dispatch({
				type: clubsConstants.FETCH_SELECTED_CLUB,
				payload: selectedClub,
			});
		}
	};
}

export function searchClubs(keyword, clubs, online) {
	return async (dispatch) => {
		if (keyword && keyword.trim() !== '') {
			dispatch({type: clubsConstants.SEARCH_CLUBS_PENDING, payload: {}});

			// Find club from store in offline mode.
			if (!online) {
				const payload = clubs.filter((club) => club.name.includes(keyword));

				dispatch({type: clubsConstants.SEARCH_CLUBS_FULFILLED, payload: payload});

				return;
			}

			let err, response;
			const signedPath = await signPath(`/groups/find/${keyword}`, 'GET');
			[err, response] = await _get(signedPath);

			if (err) {
				errorDispatch(dispatch, handleError(err, dispatch), clubsConstants.SEARCH_CLUBS_REJECTED);
				return;
			}

			dispatch({type: clubsConstants.SEARCH_CLUBS_FULFILLED, payload: response.data});
		}
	};
}

export function clearSelectedClub() {
	return (dispatch) => {
		dispatch({type: clubsConstants.CLEAR_SELECTED_CLUB});
	};
}

function errorDispatch(dispatch, payload, type = '') {
	dispatch({type: type, payload: {error: payload}});
	dispatch({type: appConstants.OPEN_APP_ERROR_MODAL, payload: {message: payload.message}});
}

function validationCheck(groups, groupData, dispatch) {
	const duplicateHandleLength = groups.find((group) => group.handle === groupData.handle);

	if (duplicateHandleLength) {
		dispatch({
			type: appConstants.OPEN_APP_ERROR_MODAL,
			payload: {message: 'This handle already exists.'},
		});

		dispatch({
			type: clubsConstants.CREATE_ERROR,
			payload: {message: 'This handle already exists.'},
		});

		return false;
	}

	return true;
}
