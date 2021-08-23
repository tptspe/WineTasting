import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

export default class ErrorModal extends Component {
	handleClick = () => {
		if (this.props.actionCallback) {
			this.props.actionCallback();
		}
	};

	render() {
		let closeBtnLabel = this.props.closeBtnLabel ? this.props.closeBtnLabel : 'Close';
		let actionBtnLabel = this.props.actionBtnLabel ? this.props.actionBtnLabel : 'OK';
		let title = this.props.title ? this.props.title : 'Error Found';
		let message = this.props.message ? this.props.message : 'Cannot complete action. Error found.';

		return (
			<Modal isOpen={this.props.isOpen}>
				<ModalHeader toggle={this.props.close}>{title}</ModalHeader>
				<ModalBody>
					<div className="row">
						<div className="col">{message}</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.close}>
						{closeBtnLabel}
					</Button>{' '}
					{this.props.actionCallback && (
						<Button color="primary" onClick={this.handleClick}>
							{actionBtnLabel}
						</Button>
					)}
				</ModalFooter>
			</Modal>
		);
	}
}
