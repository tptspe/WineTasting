import React, {Component} from 'react';
import FaSpinner from 'react-icons/lib/fa/spinner';

export default class Loading extends Component {
	render() {
		return (
			<div className="loading-wrapper">
				<div className="loading-text">{this.props.loadingText}</div>
				<div className="loading-icon">
					<FaSpinner className="fa-spin" />
				</div>
			</div>
		);
	}
}

Loading.defaultProps = {
	loadingText: 'Loading...',
};
