import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setActiveForm} from 'src/actions/settingsActions';
import {loginUser} from 'src/actions/userActions';
import {Loading} from 'src/components/shared';
import ForgotPassword from './ForgotPassword';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			touched: {
				email: false,
				password: false,
			},
			errors: {
				email: false,
				password: false,
			},
			showError: false,
			showForgotPassword: false,
			isLoading: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleFocus(event) {
		this.props.setActiveForm('login');
	}

	handleBlur(event) {
		this.props.setActiveForm(null);
	}

	handleSubmit(event) {
		event.preventDefault();
		const email = this.state.email;
		const password = this.state.password;
		const errors = this.validate(email, password);

		if (errors.email || errors.password) {
			this.setState({
				errors: errors,
			});
			return false;
		}

		this.setState({
			errors: {
				email: false,
				password: false,
			},
			showError: false,
			isLoading: true,
			showForgotPassword: false,
		});

		this.login();
		this.props.loginCallback();
	}

	login() {
		this.props.loginUser(this.state.email, this.state.password);
	}

	validate(email, password) {
		// true means invalid, so our conditions got reversed
		return {
			email: email.length === 0,
			password: password.length === 0,
		};
	}

	componentDidUpdate() {
		const {user} = this.props;
		if (user.error && user.error.login && !this.state.showError) {
			setTimeout(() => {
				this.setState({
					showError: true,
					isLoading: false,
				});

				if (this.props.user.showForgotPassword) {
					this.setState({
						showForgotPassword: true,
					});
				}
			}, 850);
		}
	}

	getMessage() {
		const {user} = this.props;
		const errors = this.state.errors;

		let message = null;

		if (errors.password || errors.email) {
			return (
				<div className="alert alert-danger error-message show-error-message">
					Please enter a valid username and password.
				</div>
			);
		}

		if (user.error && user.error.login && this.state.showError) {
			message = (
				<div className="alert alert-danger error-message show-error-message">
					{user.error.login.message}
				</div>
			);
		}

		return message;
	}

	render() {
		const errors = this.state.errors;

		return (
			<div className="login-form">
				<form onSubmit={this.handleSubmit} method="POST">
					<h3 className="h3 mb-7">Sign in</h3>

					<div className="input-group">
						<input
							className={'form-control validate ' + (errors.email ? 'error' : '')}
							label="Type your email"
							type="email"
							error="wrong"
							success="right"
							id="login_email"
							name="email"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							placeholder="Type your email"
						/>
					</div>

					<div className="input-group">
						<input
							className={'form-control validate ' + (errors.password ? 'error' : '')}
							label="Type your password"
							type="password"
							id="login_password"
							name="password"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							placeholder="Type your email"
						/>
					</div>

					{this.state.showForgotPassword && <ForgotPassword email={this.state.email} />}

					{this.getMessage()}

					{this.state.isLoading && <Loading loadingText={'Logging in...'} />}

					{!this.state.isLoading && (
						<div className="login-btn-wrapper">
							<input
								type="submit"
								value="Login"
								id="login_button"
								className="btn btn-primary btn-rounded Ripple-parent"
							/>
						</div>
					)}
				</form>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(
	mapStateToProps,
	{loginUser, setActiveForm}
)(LoginForm);
