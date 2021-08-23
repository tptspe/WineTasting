import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {PromptModal} from 'src/components/shared';
import {
	resetForm,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
} from 'src/actions/multiStepFormActions';
import {Light, Nectar, Profound} from './types';

let unlisten = null;

class NewTasting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			prompt: false,
		};

		const {
			match: {params},
		} = props;
		props.setTastingType(params.type);

		if (this.props.multiStepForm.mode === 'showcase') {
			this.props.resetForm();
		}
	}

	togglePrompt = () => {
		this.setState({
			prompt: !this.state.prompt,
		});
	};

	handleNo = () => {
		this.props.restartSession();
	};

	handleYes = () => {
		const {
			match: {params},
		} = this.props;
		this.props.restoreSession(params.type);
		this.togglePrompt();
	};

	componentDidMount() {
		const {
			multiStepForm,
			match: {params},
		} = this.props;
		const hasPrevSession = multiStepForm.lastSessionData[params.type];
		// Show prompt when there is no navigation and has prev session and any error.
		if (multiStepForm.navigatedAway && hasPrevSession && !multiStepForm.error) {
			this.togglePrompt();
		}

		// Just restore the value if there is error while creating.
		if (multiStepForm.error) {
			const {
				match: {params},
			} = this.props;
			this.props.restoreSession(params.type);
		}

		unlisten = this.props.history.listen((nextLocation, action) => {
			let currentLocation = this.props.location;
			if (currentLocation.pathname !== nextLocation.pathname) {
				this.props.navigateAway(params.type);
			}
		});
	}

	componentWillUnmount() {
		unlisten();
	}

	render() {
		const {
			match: {params},
		} = this.props;

		let tasting = null;

		switch (params.type) {
			case 'nectar':
				tasting = <Nectar history={this.props.history} />;
				break;
			case 'profound':
				tasting = <Profound history={this.props.history} />;
				break;
			case 'light':
				tasting = <Light history={this.props.history} />;
				break;
			default:
				return <Redirect to="/404/not-found" />;
		}

		return (
			<div className="new-tasting">
				{tasting}
				<PromptModal
					title={'New ' + params.type + ' tasting'}
					isOpen={this.state.prompt}
					toggle={this.togglePrompt}
					noCallback={this.handleNo}
					yesCallback={this.handleYes}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{resetForm, navigateAway, restartSession, restoreSession, setTastingType}
)(NewTasting);
