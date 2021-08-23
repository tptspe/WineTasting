import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import App from './App';
import {store, persistor} from './store';
import registerServiceWorker from './registerServiceWorker';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'mdbreact/dist/css/mdb.css';

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<Switch>
					<Route path="/" component={App} />
				</Switch>
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
