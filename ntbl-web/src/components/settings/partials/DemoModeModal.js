import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';

export default class DemoModeModal extends Component {
	render() {
		let radioStyle = {
			marginTop: '-3px',
		};

		return (
			<Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Advanced Options</ModalHeader>
				<ModalBody>
					<div className="form-group row">
						<label htmlFor="server-url" className="col-sm-4 col-form-label">
							Demo mode:
						</label>

						<div className="col-sm-8 info-field-wrapper" style={{paddingTop: '6px'}}>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="demoMode"
									id="modeRadio1"
									value={1}
									style={radioStyle}
									onChange={this.props.handleChange}
									checked={this.props.demoMode}
								/>

								<label className="form-check-label" htmlFor="modeRadio1">
									Yes
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="demoMode"
									id="modeRadio2"
									value={0}
									style={radioStyle}
									onChange={this.props.handleChange}
									checked={!this.props.demoMode}
								/>
								<label className="form-check-label" htmlFor="modeRadio2">
									No
								</label>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.props.toggle}>
						Close
					</Button>{' '}
					<Button color="primary" onClick={this.props.saveOptions}>
						Save changes
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
