import React, {Component} from 'react';
import {connect} from 'react-redux';

import {submitForm} from 'src/actions/multiStepFormActions';
import {redirect} from 'src/commons/commons';
import tasting from 'src/config/tasting';
import {CommentStep, FormStep, InfoStep, RatingStep} from '../steps';
import MultiStepForm from '../MultiStepForm';

import appearance from 'src/assets/json/tasting/light/appearance.json';
import nose from 'src/assets/json/tasting/light/nose.json';
import palate from 'src/assets/json/tasting/light/palate.json';
import observations from 'src/assets/json/tasting/light/observations.json';
import info from 'src/assets/json/tasting/info.json';
import {routeConstants, tastingsConstants} from 'src/constants';

import 'src/assets/scss/shared/make-tasting-page.scss';

class Light extends Component {
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
		this.props.submitForm(this.props.multiStepForm.selectedItems, tastingsConstants.LIGHT, online);
	}

	render() {
		const {multiStepForm} = this.props;
		const tastingSrc = tasting.source['light'];

		const steps = [
			{
				name: 'Appearance',
				component: (
					<FormStep
						stepKey="appearance"
						data={appearance}
						requiredFields={appearance.required}
						type="box"
					/>
				),
			},
			{
				name: 'Nose',
				component: false, //set component to false to render the substeps
				subSteps: nose.map((noseData, index) => {
					return (
						<FormStep
							stepKey="nose"
							data={noseData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={noseData.isMultiple}
							requiredFields={noseData.required}
						/>
					);
				}),
			},
			{
				name: 'Palate',
				component: false, //set component to false to render the substeps
				subSteps: palate.map((palateData, index) => {
					return (
						<FormStep
							stepKey="palate"
							data={palateData}
							name={'step' + (index + 1)}
							isSubStep="true"
							multiple={palateData.isMultiple}
							requiredFields={palateData.required}
						/>
					);
				}),
			},
			{
				name: 'Observations',
				component: (
					<FormStep
						stepKey="observations"
						requiredFields={observations.required}
						data={observations}
					/>
				),
			},
			{name: 'Rating', component: <RatingStep stepKey="rating" />},
			{
				name: 'Comments',
				component: <CommentStep stepKey="comments" />,
			},
			{name: 'Info', component: <InfoStep stepKey="info" requiredFields={info.required} />},
		];

		let message = null;

		if (multiStepForm && multiStepForm.error && multiStepForm.error.message !== null) {
			let classNames = 'status-message';

			if (multiStepForm.error.status === 'success') {
				classNames = 'alert alert-success';
			}

			if (multiStepForm.error.status === 'error') {
				classNames = 'alert alert-danger';
			}

			message = <div className={classNames}>{multiStepForm.error.message}</div>;
		}

		return (
			<div className="mulit-step-form-wrapper">
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
)(Light);
