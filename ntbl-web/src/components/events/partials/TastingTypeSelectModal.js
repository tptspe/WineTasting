import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

export default class TastingTypeSelectModal extends Component {
	handleSelect = (type, selectedTasting) => {
		this.props.toggle();
		if (this.props.selectCallback) {
			this.props.selectCallback(type, selectedTasting);
		}
	};

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Choose what type of tasting</ModalHeader>
				<ModalBody style={{textAlign: 'center'}}>
					<Button
						color="secondary"
						onClick={(e) => this.handleSelect('profound', this.props.selectedTasting)}
					>
						Profound
					</Button>
					<Button
						color="secondary"
						onClick={(e) => this.handleSelect('light', this.props.selectedTasting)}
					>
						Light
					</Button>
					<Button
						color="secondary"
						onClick={(e) => this.handleSelect('nectar', this.props.selectedTasting)}
					>
						Nectar
					</Button>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
