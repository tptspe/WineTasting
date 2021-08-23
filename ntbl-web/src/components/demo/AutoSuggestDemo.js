import React, {Component} from 'react';
import {connect} from 'react-redux';

import {InfoStep} from 'src/components/tasting/steps';
import MultiStepForm from 'src/components/tasting/MultiStepForm';

import info from 'src/assets/json/tasting/info.json';

import 'src/assets/scss/shared/make-tasting-page.scss';

class AutoSuggestDemo extends Component {
	render() {
		const steps = [
			{name: 'Info', component: <InfoStep stepKey="info" requiredFields={info.required} />},
		];

		return (
			<div className="mulit-step-form-wrapper">
				<MultiStepForm showNavigation={false} steps={steps} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		wines: state.wines,
		user: state.user,
	};
}

export default connect(mapStateToProps)(AutoSuggestDemo);
