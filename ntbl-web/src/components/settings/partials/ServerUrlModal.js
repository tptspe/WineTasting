import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

export default class ServerUrlModal extends Component {
	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Advanced Options</ModalHeader>
				<ModalBody>
					<div className="form-group row">
						<label htmlFor="server-url" className="col-sm-3 col-form-label">
							Server Url:
						</label>
						<div className="col-sm-9 info-field-wrapper">
							<input
								type="text"
								className="form-control info-field"
								id="server-url"
								name="server-url"
								placeholder="Please enter the Server's url"
								value={this.props.serverUrl}
								onChange={this.props.handleChange}
							/>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						Close
					</Button>{' '}
					<Button color="primary" id="btnSaveServerUrl" onClick={this.props.saveOptions}>
						Save changes
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
