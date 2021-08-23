import React, {Component} from 'react';
import {connect} from 'react-redux';

import {closeModal} from 'src/actions/appErrorModalActions';
import {logoutUser} from 'src/actions/userActions';
import {ErrorModal} from 'src/components/shared';

class AppErrorModal extends Component {
	constructor(props) {
		super(props);
		this.close = this.close.bind(this);
		this.actionCallback = this.actionCallback.bind(this);
	}

	close() {
		this.props.closeModal();
	}

	actionCallback() {
		if (this.props.appErrorModal.logout) {
			this.props.logoutUser();
		}
	}

	render() {
		return (
			<div className="app-error-modal wrapper">
				<ErrorModal
					message={this.props.appErrorModal.message}
					closeBtnLabel="Go back"
					isOpen={this.props.appErrorModal.isOpen}
					close={this.close}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		appErrorModal: state.appErrorModal,
	};
}

export default connect(
	mapStateToProps,
	{closeModal, logoutUser}
)(AppErrorModal);
