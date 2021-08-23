import React, {Component} from 'react';
import IoAndroidBulb from 'react-icons/lib/io/android-bulb';

export default class FeedbackFloatingButton extends Component {
	render() {
		return (
			<div className="feedback-floating-btn">
				<button className="btn btn-primary" onClick={this.props.handleClick}>
					<IoAndroidBulb className="arrow-icon" />
				</button>
			</div>
		);
	}
}
