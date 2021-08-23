import React, {Component} from 'react';
import {connect} from 'react-redux';

import {InfoForm} from '../partials';

class InfoStep extends Component {
	render() {
		return (
			<div className="step-container info-step">
				<div className="container">
					<InfoForm />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(mapStateToProps)(InfoStep);
