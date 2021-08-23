import {store} from 'src/store';
export const port = 8000; //note: this is currently unused || todo: add port as part of app advance options;
export let basePath = store.getState().app.advancedOptions.serverUrl;

store.subscribe((listener) => {
	// udpate basePath everytime there's a change
	basePath = store.getState().app.advancedOptions.serverUrl;
});
