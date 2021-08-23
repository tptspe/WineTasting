import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Button} from 'mdbreact';
import FaEdit from 'react-icons/lib/fa/edit';

import {saveAdvancedOptions} from 'src/actions/appActions';
import DemoModeModal from './DemoModeModal';
import ServerUrlModal from './ServerUrlModal';

class AdvancedOption extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: {
				serverUrl: false,
				demoMode: false,
			},
			serverUrl: '',
			demoMode: false,
		};

		this.toggle = this.toggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveOptions = this.saveOptions.bind(this);
	}

	toggle(name) {
		this.setState({
			modal: {
				[name]: !this.state.modal[name],
			},
		});
	}

	handleChange(event, name) {
		const target = event.target;
		let value = target.value;

		if (name === 'demoMode') {
			value = Boolean(Number(value));
		}

		this.setState({[name]: value});
	}

	saveOptions(name) {
		this.props.saveAdvancedOptions({
			serverUrl: this.state.serverUrl,
			demoMode: this.state.demoMode,
		});

		setTimeout(() => {
			this.toggle(name);
		}, 1000);
	}

	componentDidMount() {
		if (this.props.app.advancedOptions.serverUrl !== this.state.serverUrl) {
			this.setState({serverUrl: this.props.app.advancedOptions.serverUrl});
		}

		if (this.props.app.advancedOptions.demoMode !== this.state.demoMode) {
			this.setState({demoMode: this.props.app.advancedOptions.demoMode});
		}
	}

	render() {
		return (
			<Container className="advance-option-wrapper">
				<div className="the-option">
					<span className="label">Server Url:</span>{' '}
					<span className="val">{this.state.serverUrl}</span>{' '}
					<Button color="light" id="btnEditServerUrl" onClick={() => this.toggle('serverUrl')}>
						<FaEdit />
					</Button>
				</div>

				<div className="the-option">
					<span className="label">Demo Mode:</span>{' '}
					<span className="val">{this.state.demoMode ? 'ON' : 'OFF'}</span>{' '}
					<Button color="light" onClick={() => this.toggle('demoMode')}>
						<FaEdit />
					</Button>
				</div>

				<ServerUrlModal
					isOpen={this.state.modal.serverUrl}
					serverUrl={this.state.serverUrl}
					saveOptions={() => this.saveOptions('serverUrl')}
					handleChange={(event) => this.handleChange(event, 'serverUrl')}
					toggle={() => this.toggle('serverUrl')}
				/>

				<DemoModeModal
					isOpen={this.state.modal.demoMode}
					demoMode={this.state.demoMode}
					saveOptions={() => this.saveOptions('demoMode')}
					handleChange={(event) => this.handleChange(event, 'demoMode')}
					toggle={() => this.toggle('demoMode')}
				/>
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
)(AdvancedOption);
