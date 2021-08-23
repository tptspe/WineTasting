const defaultData = {
	names: [],
	wines: [],
	countries: [],
	producers: [],
	locations: [],
	isLoading: false,
	autoSuggests: null,
};

export default function reducer(state = defaultData, action) {
	switch (action.type) {
		case 'GET_AUTOSUGGEST_FULFILLED': {
			let data = Object.assign({}, state, action.payload, (state.isLoading = false));
			return data;
		}

		case 'GET_AUTOSUGGEST_PENDING': {
			return {
				...state,
				isLoading: true,
			};
		}

		default:
			return state;
	}
}
