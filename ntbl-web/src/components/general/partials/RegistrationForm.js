import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setActiveForm} from 'src/actions/settingsActions';
import {loginUser, registerUser} from 'src/actions/userActions';
import {Loading} from 'src/components/shared';

class RegistrationForm extends Component {
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
			successMessage: 'Successfully registered user!',
			showError: false,
			showSuccess: false,
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
		this.props.setActiveForm('registration');
	}

	handleBlur(event) {
		this.props.setActiveForm(null);
	}

	handleSubmit(event) {
		event.preventDefault();
		const email = this.state.email;
		const password = this.state.password;
		const errors = this.validate(email, password);

		this.setState({
			errors: errors,
			showError: false,
			showSuccess: false,
			isLoading: true,
		});

		if (errors.email || errors.password) return false;
		this.register();
	}

	register() {
		this.props.registerUser(this.state.email, this.state.password);
	}

	validate(email, password) {
		// true means invalid, so our conditions got reversed
		return {
			email: email.length === 0,
			password: password.length === 0,
		};
	}

	redirect(route) {
		const {history} = this.props;
		history.push(route);
	}

	componentDidUpdate() {
		const {user} = this.props;

		if (user.error && user.error.reg && !this.state.showError) {
			setTimeout(() => {
				this.setState({
					showError: true,
					isLoading: false,
				});
			}, 850);
		}

		if (user.status && user.status.reg === 'success' && !this.state.showSuccess) {
			setTimeout(() => {
				this.setState({
					showSuccess: true,
					isLoading: false,
				});
			}, 850);
		}

		if (user.status && user.status.reg === 'success') {
			setTimeout(() => {
				this.props.loginUser(this.state.email, this.state.password);
				this.props.registrationCallback();
			}, 400);
		}
	}

	getMessage() {
		const {user} = this.props;
		let message = null;

		if (this.state.showError && user.error && user.error.reg) {
			message = (
				<div className="alert alert-danger error-message show-error-message">
					{user.error.reg.message}
				</div>
			);
		}

		if (this.state.showSuccess) {
			message = (
				<div className="alert alert-success" role="alert">
					{this.state.successMessage}
				</div>
			);
		}

		return message;
	}

	render() {
		const errors = this.state.errors;
		return (
			<div className="registration-form">
				<form onSubmit={this.handleSubmit} method="POST">
					<h3 className="h3 mb-7">Create an account</h3>
					<div className="input-group">
						<input
							className={'form-control validate ' + (errors.email ? 'error' : '')}
							label="Type your email"
							type="email"
							error="wrong"
							success="right"
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
							name="password"
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onBlur={this.handleBlur}
							placeholder="Type your password"
						/>
					</div>

					<div className={'error-message ' + (errors.password ? 'show-error-message' : '')}>
						<h6>Invalid username or password</h6>
					</div>

					{this.getMessage()}

					{this.state.isLoading && <Loading loadingText={'Creating user...'} />}

					{!this.state.isLoading && (
						<div className="reg-btn-wrapper">
							<input
								type="submit"
								value="Register"
								className="btn btn-success btn-rounded Ripple-parent"
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
	{registerUser, loginUser, setActiveForm}
)(RegistrationForm);
