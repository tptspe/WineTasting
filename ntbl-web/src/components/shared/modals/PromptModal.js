import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

export default class PromptModal extends Component {
	handleYes = () => {
		if (this.props.yesCallback) {
			this.props.yesCallback();
		}
	};

	handleNo = () => {
		if (this.props.noCallback) {
			this.props.noCallback();
		}
		this.props.toggle();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
				<ModalBody>
					<p>Do you wish to continue from your last session?</p>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.handleNo}>
						No
					</Button>{' '}
					<Button color="primary" onClick={this.handleYes}>
						Yes
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

PromptModal.defaultProps = {
	title: 'Please choose an option below',
};
