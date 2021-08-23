import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

import {Loading} from 'src/components/shared';
import CreateEventForm from './CreateEventForm';

export default class CreateEventModal extends Component {
	createEventRef = React.createRef();

	handleSave = () => {
		this.createEventRef.current.handleSubmit();
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Add a new event</ModalHeader>
				<ModalBody>
					<CreateEventForm
						ref={this.createEventRef}
						saveCallback={this.props.saveCallback}
						eventWines={this.props.eventWines}
					/>
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
