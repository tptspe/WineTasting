import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import {
	AppErrorModal,
	ErrorBoundaryFallback,
	AppHeader,
	Feedback,
	Landing,
	Logout,
	NotFound,
	PrivateRoute,
	Saving,
	SideNav,
} from 'src/components/general';
import {MyWines, WineDetails} from 'src/components/my-wines';
import {FindClubs, ClubDetails, MyClubs} from 'src/components/my-clubs';
import {
	EventCodeEntry,
	EventDetails,
	EventTasting,
	EventTastingList,
	MyEvents,
} from 'src/components/events';
import {Settings} from 'src/components/settings';
import {AutoSuggestDemo} from 'src/components/demo';
import {NewTasting, SelectTasting} from 'src/components/tasting';

import {routeConstants} from './constants';
import './main.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRoute: '',
			additionalAppBodyClasses: [],
		};

		this.handleNavOffSet = this.handleNavOffSet.bind(this);
	}

	componentDidMount() {
		this.unlisten = this.props.history.listen((location, action) => {
			if (location.pathname === routeConstants.RESET) {
				localStorage.clear();
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const {pathname} = this.props.location;

		if (this.state.currentRoute !== pathname) {
			this.setState({
				currentRoute: pathname,
			});
		}
	}

	componentWillUnmount() {
		this.unlisten();
	}

	handleNavOffSet(isOffCanvas, offCanvasClass, isSideNavOpen) {
		let additionalAppBodyClasses = [];

		if (isOffCanvas) {
			additionalAppBodyClasses.push(offCanvasClass);
			if (isSideNavOpen) {
				additionalAppBodyClasses.push('nav-is-open');
			}
		}
		this.setState({additionalAppBodyClasses: additionalAppBodyClasses});
	}

	preventReportingOnDev(report) {
		const host = window.location.hostname;
		if (host === 'localhost') report.ignore();
	}

	render() {
		let {additionalAppBodyClasses} = this.state;
		const bugsnagClient = bugsnag({
			apiKey: '6ac91926d24d2a97b6e4d54d1cba9119',
			beforeSend: (report) => this.preventReportingOnDev(report),
		});
		bugsnagClient.use(bugsnagReact, React);
		const ErrorBoundary = bugsnagClient.getPlugin('react');

		return (
			<div className="wrapper app-wrapper">
				<SideNav handleNavOffSet={this.handleNavOffSet} offCanvas={true} />
				<div
					id="main-content"
					className={['App-body', additionalAppBodyClasses.join(' ')].join(' ')}
				>
					<AppHeader currentRoute={this.state.currentRoute} />
					<div className="container-fluid">
						<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
							<Switch>
								<Route path={routeConstants.HOME} exact component={Landing} />
								<Route path={routeConstants.SETTINGS} exact component={Settings} />

								<PrivateRoute path={routeConstants.WINES} exact component={MyWines} />
								<PrivateRoute path={routeConstants.NEW_TASTING} exact component={SelectTasting} />
								<PrivateRoute path={routeConstants.NEW_TASTING_TYPE} exact component={NewTasting} />
								<PrivateRoute
									path={routeConstants.WINE_DETAILS_REF}
									exact
									component={WineDetails}
								/>

								<PrivateRoute path={routeConstants.MY_CLUBS} exact component={MyClubs} />
								<PrivateRoute path={routeConstants.FIND_CLUBS} exact component={FindClubs} />
								<PrivateRoute path={routeConstants.CLUB_HANDLE} exact component={ClubDetails} />

								<PrivateRoute path={routeConstants.MY_EVENTS} exact component={MyEvents} />
								<PrivateRoute path={routeConstants.EVENT} exact component={EventCodeEntry} />
								<PrivateRoute path={routeConstants.EVENT_REF} exact component={EventDetails} />
								<PrivateRoute
									path={routeConstants.EVENT_REF_TASTINGS}
									exact
									component={EventTastingList}
								/>
								<PrivateRoute
									path={routeConstants.EVENT_REF_TASTINGS_REF}
									exact
									component={EventTasting}
								/>

								<PrivateRoute path={routeConstants.SAVE} exact component={Saving} />
								<PrivateRoute
									path={routeConstants.DEMO_AUTOSUGGEST}
									exact
									component={AutoSuggestDemo}
								/>
								<PrivateRoute path={routeConstants.LOGOUT} exact component={Logout} />
								<Route path="*" exact component={NotFound} />
							</Switch>
							<Feedback />
							<AppErrorModal />
						</ErrorBoundary>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
