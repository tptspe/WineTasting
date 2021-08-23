import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';
import CreateClubForm from './CreateClubForm';
import {Loading} from 'src/components/shared';

export default class CreateClubModal extends Component {
	createClubRef = React.createRef();

	handleSave = () => {
		this.createClubRef.current.handleSubmit();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Add a new club</ModalHeader>
				<ModalBody>
					<CreateClubForm ref={this.createClubRef} saveCallback={this.props.saveCallback} />
					{this.props.isSaving && <Loading loadingText={''} />}
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						Close
					</Button>{' '}
					<Button color="primary" onClick={this.handleSave}>
						Save changes
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
