import React, {Component} from 'react';
import {connect} from 'react-redux';

import tasting from 'src/config/tasting';
import {redirect} from 'src/commons/commons';
import info from 'src/assets/json/tasting/info.json';
import {submitForm} from 'src/actions/multiStepFormActions';
import {routeConstants, tastingsConstants} from 'src/constants';

import MultiStepForm from '../MultiStepForm';
import {InfoStep, RatingStep} from '../steps';

import 'src/assets/scss/shared/make-tasting-page.scss';

class Nectar extends Component {
	constructor(props) {
		super(props);
		this.handleFormSubmission = this.handleFormSubmission.bind(this);
	}

	handleFormSubmission() {
		const {
			history,
			offline: {online},
		} = this.props;
		// Do a dummy sending of selectedItems...

		redirect(history, routeConstants.SAVE);
		this.props.submitForm(this.props.multiStepForm.selectedItems, tastingsConstants.NECTAR, online);
	}

	render() {
		const {multiStepForm} = this.props;
		const tastingSrc = tasting.source['nectar'];

		const steps = [
			{name: 'Rating', component: <RatingStep stepKey="rating" />},
			{name: 'Info', component: <InfoStep stepKey="info" requiredFields={info.required} />},
		];

		let message = null;

		if (multiStepForm && multiStepForm.status !== null && multiStepForm.status.message !== null) {
			let classNames = 'status-message';

			if (multiStepForm.status.status === 'success') {
				classNames = 'alert alert-success';
			}

			if (multiStepForm.status.status === 'error') {
				classNames = 'alert alert-danger';
			}

			message = <div className={classNames}>{multiStepForm.status.message}</div>;
		}

		return (
			<div className="mulit-step-form-wrapper nectar">
				<MultiStepForm
					tastingSrc={tastingSrc}
					showNavigation={true}
					steps={steps}
					formSubmitCallback={this.handleFormSubmission}
				/>
				{message}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		offline: state.offline,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{submitForm}
)(Nectar);
