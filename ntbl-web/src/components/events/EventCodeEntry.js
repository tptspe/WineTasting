import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {Link} from 'react-router-dom';

import {attendEvent, resetEventShowcase} from 'src/actions/eventActions';
import {InputText} from 'src/components/shared';
import {routeConstants} from 'src/constants';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';

class EventCodeEntry extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.attendEvent(this.state.code);
	}

	handleChange(event) {
		const target = event.target;
		this.setState({[target.name]: target.value});
	}

	componentDidUpdate(prevProps) {
		if (this.props.events.redirectOwner && this.props.events.selectedEvent) {
			this.props.resetEventShowcase();
			this.props.history.push(`${routeConstants.EVENT}/${this.props.events.selectedEvent}`);
		}

		if (this.props.events.attendEventPermitted && this.props.events.selectedEvent) {
			this.props.history.push(
				`${routeConstants.EVENT}/${this.props.events.selectedEvent}/tastings`
			);
		}
	}

	render() {
		const {online} = this.props.connectionStatus;

		const attendEventBtnClass = classnames({
			'btn btn-primary': 'true',
			disabled: !online,
		});

		return (
			<div className="attend-event-page container event-details-page">
				<div className="content">
					<div className="my-events-btn-wrapper">
						<Link to={routeConstants.MY_EVENTS} className="btn btn-primary">
							<FaLongArrowLeft className="arrow-icon" />
							My Events
						</Link>
					</div>
					<h2 className="header-not-found mb-3">Please enter the event code below: </h2>
					<div className="create-event-form">
						<form onSubmit={this.handleSubmit} className="create-event-form" method="POST">
							<InputText
								id="event-code"
								name="code"
								value={this.state.code}
								placeholder=""
								handleChange={this.handleChange}
							/>

							<input className={attendEventBtnClass} type="submit" value="Attend Event" />
							{!online && <span>* Please get online to attend events.</span>}
						</form>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		events: state.events,
		connectionStatus: state.offline,
	};
}

export default connect(
	mapStateToProps,
	{attendEvent, resetEventShowcase}
)(EventCodeEntry);
