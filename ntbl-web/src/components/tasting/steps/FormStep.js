import React, {Component} from 'react';
import {connect} from 'react-redux';

import {BoxSelectionGroup, ListSelection} from '../partials';
import {initStepData} from 'src/actions/multiStepFormActions';

class FormStep extends Component {
	constructor(props) {
		super(props);
		this.getContent = this.getContent.bind(this);
	}

	componentDidMount() {
		const {data, isSubStep, name, multiStepForm, stepKey} = this.props;
		const {tastingSrc} = multiStepForm;
		let step = multiStepForm.steps[stepKey];

		if (isSubStep) {
			if (step === undefined || step.subSteps === undefined || step.subSteps[name] === undefined) {
				this.props.initStepData(tastingSrc, stepKey, data, isSubStep, name);
			}
		} else {
			if (step === undefined || (Object.keys(step).length === 0 && step.constructor === Object)) {
				this.props.initStepData(tastingSrc, stepKey, data);
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {data, isSubStep, name, multiStepForm, stepKey} = nextProps;
		const {tastingSrc} = multiStepForm;
		let step = multiStepForm.steps[stepKey];

		if (isSubStep) {
			if (step === undefined || step.subSteps === undefined || step.subSteps[name] === undefined) {
				this.props.initStepData(tastingSrc, stepKey, data, isSubStep, name);
				return false;
			}
		} else {
			if (step === undefined || (Object.keys(step).length === 0 && step.constructor === Object)) {
				this.props.initStepData(tastingSrc, stepKey, data);
				return false;
			}
		}

		return true;
	}

	getContent() {
		let {isSubStep, name, multiple, stepKey, multiStepForm, type} = this.props;
		let step = multiStepForm.steps[stepKey];
		let stepData = {};
		let content = null;

		if (step) {
			stepData = step.stepData;

			if (isSubStep) stepData = step.subSteps[name].data;
		}

		if (type && type === 'box') {
			content = <BoxSelectionGroup step={stepKey} data={stepData} />;
		} else {
			content = (
				<ListSelection
					step={stepKey}
					isSubStep={isSubStep}
					name={name}
					data={stepData}
					multiple={multiple}
				/>
			);
		}

		return content;
	}

	render() {
		let content = this.getContent();

		return <div className="step-container">{content}</div>;
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{initStepData}
)(FormStep);
