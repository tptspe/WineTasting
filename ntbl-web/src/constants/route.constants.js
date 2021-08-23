const routeConstants = {
	HOME: '/',

	WINES: '/wines',
	TASTING: '/tasting',
	NEW_TASTING: '/new-tasting',
	NEW_TASTING_TYPE: '/new-tasting/:type',
	WINE_DETAILS: '/wine-details',
	WINE_DETAILS_REF: '/wine-details/:wineRef',

	CLUB: '/club',
	MY_CLUBS: '/my-clubs',
	FIND_CLUBS: '/find-clubs',
	CLUB_HANDLE: '/club/:groupHandle',

	EVENT: '/event',
	MY_EVENTS: '/my-events',
	EVENT_REF: '/event/:eventRef',
	EVENT_REF_TASTINGS: '/event/:eventRef/tastings',
	EVENT_REF_TASTINGS_REF: '/event/:eventRef/tastings/:tastingRef',

	DEMO_AUTOSUGGEST: '/demo/autosuggest',

	SAVE: '/save',
	LOGOUT: '/logout',
	SETTINGS: '/settings',

	RESET: '/reset',
};

export default routeConstants;
