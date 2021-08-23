import React, {Component} from 'react';
import {connect} from 'react-redux';

import {redirect} from 'src/commons/commons';
import {Loading} from 'src/components/shared';

import './Saving.scss';

class Saving extends Component {
	componentDidUpdate() {
		const {app, history} = this.props;

		// Redirect to afterSaveUrl after saving...
		if (!app.isSaving) {
			setTimeout(() => {
				redirect(history, app.afterSaveUrl);
			}, 1000);
		}
	}

	componentDidMount() {
		const {app, history} = this.props;

		// Redirect to afterSaveUrl after saving...
		if (!app.isSaving) {
			setTimeout(() => {
				redirect(history, app.afterSaveUrl);
			}, 1000);
		}
	}

	render() {
		return (
			<div className="saving-page">
				<Loading loadingText={this.props.app.loadingText} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
	};
}

export default connect(mapStateToProps)(Saving);
