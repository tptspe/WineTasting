import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {LoginForm, RegistrationForm} from './partials';

import {routeConstants} from 'src/constants';
import './Landing.scss';

class Landing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToDashboard: false,
		};
		this.loginCallback = this.loginCallback.bind(this);
		this.registrationCallback = this.registrationCallback.bind(this);
	}

	loginCallback() {
		this.setState({
			redirectToDashboard: true,
		});
	}

	registrationCallback() {
		this.setState({
			redirectToDashboard: true,
		});
	}

	render() {
		const {user} = this.props;
		let activeForm = this.props.settings.activeForm;

		if (user.isLoggedIn) {
			return <Redirect to={routeConstants.WINES} />;
		}

		return (
			<div className="settings-page container-fluid">
				{!this.props.user.isLoggedIn && (
					<div className="row">
						<div
							className={
								'col-md login-wrapper ' + (activeForm === 'registration' ? 'inactive' : '')
							}
						>
							<LoginForm loginCallback={this.loginCallback} />
						</div>
						<div
							className={
								'col-md registration-wrapper ' + (activeForm === 'login' ? 'inactive' : '')
							}
						>
							<RegistrationForm registrationCallback={this.registrationCallback} />
						</div>
					</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		settings: state.settings,
		user: state.user,
	};
}

export default connect(mapStateToProps)(Landing);
