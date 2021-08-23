import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'mdbreact';
import FaCog from 'react-icons/lib/fa/cog';

import {saveAdvancedOptions} from 'src/actions/appActions';

class AdvancedSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			serverUrl: '',
		};

		this.toggle = this.toggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveOptions = this.saveOptions.bind(this);
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		this.setState({serverUrl: value});
	}

	saveOptions(event) {
		this.props.saveAdvancedOptions({serverUrl: this.state.serverUrl});
		setTimeout(() => {
			this.toggle();
		}, 1000);
	}

	componentDidMount() {
		if (this.props.app.advancedOptions.serverUrl !== this.state.serverUrl) {
			this.setState({serverUrl: this.props.app.advancedOptions.serverUrl});
		}
	}

	render() {
		return (
			<Container className="advance-section-wrapper">
				<Button color="light" onClick={this.toggle}>
					<FaCog className="advance-icon" />
					Advanced
				</Button>
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Advanced Options</ModalHeader>
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
									value={this.state.serverUrl}
									onChange={this.handleChange}
								/>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={this.toggle}>
							Close
						</Button>{' '}
						<Button color="primary" onClick={this.saveOptions}>
							Save changes
						</Button>
					</ModalFooter>
				</Modal>
			</Container>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(
	mapStateToProps,
	{saveAdvancedOptions}
)(AdvancedSection);
