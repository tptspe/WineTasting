import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

import {resetPassword} from 'src/actions/userActions';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modalMessage: '',
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle(event, email) {
		event.preventDefault();
		let message = null;

		if (email) {
			message = `We have sent a reset link to the email ${email}.`;
			this.props.resetPassword(email);
		} else {
			message = 'Please enter a valid email.';
		}

		this.setState({
			modal: !this.state.modal,
			modalMessage: message,
		});
	}

	render() {
		return (
			<div className="forgot-password">
				<div className="forgot-password-link">
					<button onClick={(e) => this.toggle(e, this.props.email)}>Forgot your password?</button>
				</div>
				<Modal className="forgot-password-modal" isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Forgot Password</ModalHeader>
					<ModalBody>
						<p>{this.state.modalMessage}</p>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={(e) => this.toggle(e, null)}>
							Confirm
						</Button>{' '}
					</ModalFooter>
				</Modal>
			</div>
		);
	}
}

ForgotPassword.defaultProps = {
	email: null,
};

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(
	mapStateToProps,
	{resetPassword}
)(ForgotPassword);
