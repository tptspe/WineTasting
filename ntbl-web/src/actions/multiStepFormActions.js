import logic from 'src/assets/json/tasting/logic.json';
import {multiStepFormConstants, appConstants, routeConstants} from 'src/constants';
import {getTotalRatingPoints, signPath} from 'src/commons/commons';

let getSelections = (tastingSrc, propData, multiple = false) => {
	let data = {};
	let activeSelection = null;
	let firstItemFound = false;

	const selections = propData.keys.map((selection, index) => {
		// Add selection as key to data for tracking
		data[selection] = {};
		data[selection].key = selection;
		data[selection].activeOption = null;
		data[selection].options = tastingSrc[selection] || [];

		if (multiple) {
			data[selection].activeOption = [];
		}

		if (tastingSrc && tastingSrc[selection] && !firstItemFound) {
			data[selection].isActive = true;
			activeSelection = {...data[selection]};
			firstItemFound = true;
		}

		// If there's a default property on data, set the appropriate default value to the corresponding key/note
		if (propData.default && propData.default[selection] && data[selection]) {
			if (propData.isMultiple) {
				data[selection].activeOption = [].concat(propData.default[selection]);
			} else {
				data[selection].activeOption = propData.default[selection];
			}
		}

		// Set visibility for selections with "onlyifs"
		if (logic[selection] && 'onlyif' in logic[selection]) {
			data[selection].hideSelection = true;
		} else {
			data[selection].hideSelection = false; //show all selections by default
		}

		return data[selection];
	});

	return {
		selections,
		activeSelection,
	};
};

let isEmpty = (obj) => {
	if (obj === undefined || obj === null || Object.keys(obj).length <= 0) {
		return true;
	}

	return false;
};

let prepareNotes = (notes, obj) => {
	Object.keys(obj).forEach((item) => {
		if (obj[item] && obj[item].constructor === Array) {
			obj[item].forEach((innerItem) => notes.push(innerItem));
		} else {
			notes.push(obj[item]);
		}
	});
};

let prepareFields = (formData) => {
	// Init payload
	let payload = {};
	payload.rating = {};
	payload.notes = [];

	// Prepare tasting info
	if (!isEmpty(formData.info)) {
		payload.country = formData.info.tasting_country;
		payload.producer = formData.info.tasting_producer;
		payload.name = formData.info.tasting_name;
		payload.region = formData.info.tasting_region;
		payload.vintage = formData.info.tasting_vintage;
		payload.grape = formData.info.tasting_grape;
		payload.price = formData.info.tasting_price;
		payload.currency = formData.info.tasting_currency;
	}

	// Prepare summary
	if (!isEmpty(formData.comments)) {
		payload.summary_wine = formData.comments.wine_summary;
		payload.summary_personal = formData.comments.wine_personal;
	}

	// Prepare rating
	if (!isEmpty(formData.rating)) {
		payload.rating.version = 1; // where should this come from?
		payload.rating.parker_val = getTotalRatingPoints(formData.rating);
		payload.rating.balance = formData.rating.rating_balance_;
		payload.rating.length = formData.rating.rating_length_;
		payload.rating.intensity = formData.rating.rating_intensity_;
		payload.rating.senseofplace = formData.rating.rating_senseofplace_;
		payload.rating.complexity = formData.rating.rating_complexity_;
		payload.rating.quality = formData.rating.rating_quality_;
		payload.rating.drinkability = formData.rating.rating_drinkability_;
	}

	// Prepare notes from Appearance, Nose, Palate and Observations
	if (!isEmpty(formData.appearance)) {
		prepareNotes(payload.notes, formData.appearance);
	}

	if (!isEmpty(formData.nose)) {
		prepareNotes(payload.notes, formData.nose);
	}

	if (!isEmpty(formData.palate)) {
		prepareNotes(payload.notes, formData.palate);
	}

	if (!isEmpty(formData.observations)) {
		prepareNotes(payload.notes, formData.observations);
	}

	return payload;
};

export function initTastingSrc(tastingSrc) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_TASTING_SOURCE,
			payload: tastingSrc,
		});
	};
}

export function initStepData(tastingSrc, step, rawStepData, isSubStep = false, name = null) {
	let stepData = getSelections(tastingSrc, rawStepData);
	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_STEP_DATA,
			payload: payload,
		});
	};
}

export function initEventTasting(
	selectedData,
	tastingSrc,
	step,
	rawStepData,
	isSubStep = false,
	name = null
) {
	let stepData = getSelections(tastingSrc, rawStepData);

	Object.keys(selectedData).forEach((key) => {
		markSelectedItems(tastingSrc, key, selectedData[key], stepData);
	});

	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.INIT_STEP_DATA,
			payload: payload,
		});
	};
}

function markSelectedItems(tastingSrc, selectionKey, value, stepData) {
	let {selections, activeSelection} = stepData;
	activeSelection.isActive = false; // set the previous active selection to false

	// set active selection
	selections.forEach((selection, index) => {
		if (selection.key === selectionKey) {
			selection.isActive = true;
			selection.activeOption = value;
			activeSelection = selection;
		}
	});

	/*
      todo: figure out and implement a way to decouple the switch logic below
    */

	// Add logic for showing and hiding box selections
	switch (selectionKey) {
		case 'color_':
			selections.forEach((newSelection, index) => {
				// Reset nuance
				if (newSelection.key === 'nuance_tint_') {
					newSelection.hideSelection = false;
					newSelection.activeOption = null;
					newSelection.options = tastingSrc[activeSelection.activeOption];
					newSelection.nuance_tint_ = activeSelection.activeOption;
				}

				// Hide clarity and appearance
				if (newSelection.key === 'clarity_' || newSelection.key === 'appearanceintensity_') {
					newSelection.hideSelection = true;
				}
			});
			break;
		case 'nuance_tint_':
			selections.forEach((newSelection, index) => {
				// show clarity
				if (newSelection.key === 'clarity_') {
					newSelection.hideSelection = false;
					newSelection.activeOption = null;
					newSelection.nuance_tint_ = activeSelection.activeOption;
				}

				// Hide appearance
				if (newSelection.key === 'appearanceintensity_') {
					newSelection.hideSelection = true;
				}
			});
			break;
		case 'clarity_':
			let nuance_tint_ = {};

			selections.forEach((newSelection, index) => {
				if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

				// show clarity
				if (newSelection.key === 'appearanceintensity_') {
					newSelection.hideSelection = false;
					newSelection.nuance_tint_ = nuance_tint_.activeOption;
					newSelection.clarity_ = activeSelection.activeOption;
				}
			});
			break;
		default:
		// do nothing
	}

	console.log('MARKING SELECTED ITEMS...');
}

export function updateStepSelections(step, stepData, isSubStep = false, name = null) {
	let subSteps = {};
	let payload = {
		step,
		stepData,
		isSubStep,
	};

	if (isSubStep && name) {
		let subStep = {};
		subStep.data = stepData;
		subSteps[name] = subStep;

		payload = {
			step,
			subSteps,
			isSubStep,
			name,
		};
	}

	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.UPDATE_STEP_SELECTIONS,
			payload: payload,
		});
	};
}

export function copyAromaNotes(aromaNotes, step, name) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.COPY_AROMA_NOTES,
			payload: {
				aromaNotes,
				step,
				name,
			},
		});
	};
}

export function updateSelectedItem(step, stepData) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.UPDATE_SELECTED_ITEM,
			payload: {
				step,
				stepData,
			},
		});
	};
}

export function navigateForm(compState, subCompState, progressBarState, navButtons) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.NAVIGATE_FORM,
			payload: {
				compState,
				subCompState,
				progressBarState,
				navButtons,
			},
		});
	};
}

export function removeSelectedItem(step, itemKey, isSubStep = false, name = null) {
	return (dispatch) => {
		dispatch({
			type: multiStepFormConstants.REMOVE_SELECTED_ITEM,
			payload: {
				step,
				itemKey,
				isSubStep,
				name,
			},
		});
	};
}

export function submitForm(formData, afterSaveUrl, isOnline) {
	const payload = prepareFields(formData);

	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.SUBMIT_START});

		const signedPath = await signPath('/tasting', 'POST');
		const isValid = validationCheck(payload, dispatch, afterSaveUrl);

		if (isValid) {
			dispatch({
				type: multiStepFormConstants.SUBMIT_FULFILLED,
				payload: {
					...payload,
					isOnline,
					ref: payload.name,
					loadingText: 'Saving tasting...',
				},
				meta: {
					offline: {
						// the network action to execute:
						effect: {url: signedPath, method: 'POST', json: {...payload}},
						// action to dispatch when effect succeeds:
						commit: {
							type: `${multiStepFormConstants.SUBMIT_FULFILLED}_COMMIT`,
						},
						// action to dispatch if network action fails permanently:
						rollback: {
							type: `${appConstants.OPEN_APP_ERROR_MODAL}`,
							payload: errorDispatch(dispatch, payload, afterSaveUrl),
						},
					},
				},
			});
		}
	};
}

export function navigateAway(lastSessionType) {
	return async (dispatch) => {
		dispatch({
			type: multiStepFormConstants.NAVIGATE_AWAY,
			payload: {lastSessionType: lastSessionType},
		});
	};
}

export function resetForm() {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESET_FORM});
	};
}

export function restartSession() {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESTART_SESSION});
	};
}

export function restoreSession(type) {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.RESTORE_SESSION, payload: {tastingType: type}});
	};
}

export function setTastingType(type) {
	return async (dispatch) => {
		dispatch({type: multiStepFormConstants.SET_TASTING_TYPE, payload: {tastingType: type}});
	};
}

function errorDispatch(dispatch, payload, afterSaveUrl) {
	dispatch({
		type: multiStepFormConstants.SUBMIT_ERROR,
		payload: {
			data: null,
			error: true,
			afterSaveUrl: afterSaveUrl
				? `${routeConstants.NEW_TASTING}/${afterSaveUrl}`
				: `${routeConstants.NEW_TASTING}`,
			loadingText: 'Unable to save data. Redirecting...',
		},
	});
}

function validationCheck(payload, dispatch, afterSaveUrl) {
	let isValid = true;

	Object.keys(payload).forEach((field) => {
		if (validateCharacterLength(payload[field])) {
			dispatch({
				type: appConstants.OPEN_APP_ERROR_MODAL,
				payload: {message: `The ${field} field must not exceed 128 chars..`},
			});
			isValid = false;

			errorDispatch(dispatch, payload, afterSaveUrl);
		}
	});

	return isValid;
}

function validateCharacterLength(name) {
	if (name.length > 127) {
		return true;
	}

	return false;
}
