import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, CardBody, CardImage, CardTitle, CardText} from 'mdbreact';

import {fetchSelectedEvent} from 'src/actions/eventActions';
import {redirect, getFullDateAndTime} from 'src/commons/commons';
import {RatingTotal} from 'src/components/shared';
import {routeConstants} from 'src/constants';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';

import './EventDetails.scss';

class EventDetails extends Component {
	componentDidMount() {
		const {
			events,
			match: {params},
		} = this.props;
		const eventDetails = events.find((eventDetails) => eventDetails.ref === params.eventRef);

		this.props.fetchSelectedEvent(params.eventRef, eventDetails);
	}

	get tastings() {
		const {selectedEvent = {}} = this.props;
		const tastings = selectedEvent.data && selectedEvent.data.tastings;

		let content = null;

		if (tastings == null || tastings.length <= 0) {
			content = <div>You currently have no tastings.</div>;
		}

		if (tastings) {
			content = tastings.map((wine) => {
				let wineImg = wine.images[0]
					? wine.images[0]
					: require('src/assets/images/wine-bottle-default.jpg');

				return (
					<div key={wine.ref} className={'wine-list-col col-md-3 mb-3'}>
						<Link to={`${routeConstants.WINE_DETAILS}/${wine.ref}`}>
							<Card className="wine-card">
								<CardImage className="img-fluid wine-img" src={wineImg} alt="Wine bottle" />
								<CardBody>
									<CardTitle>
										{wine.region}
										<br />
										{wine.name}
									</CardTitle>
									<CardText>
										<span>
											{wine.vintage}, {wine.country}
										</span>
										<br />
									</CardText>
									<button
										onClick={(e) => {
											redirect(this.props.history, `${routeConstants.WINE_DETAILS}/${wine.ref}`);
										}}
										className="btn btn-primary see-more-btn"
									>
										See more
									</button>
									<div className="rating-total-wrapper">
										<RatingTotal showLabel={false} ratings={wine.rating} />
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>
				);
			});
		}

		return content;
	}

	get event() {
		const selectedEvent = this.props.selectedEvent.data || {};
		const startDate =
			selectedEvent.start_date && getFullDateAndTime(new Date(selectedEvent.start_date));
		const endDate = selectedEvent.end_date && getFullDateAndTime(new Date(selectedEvent.end_date));

		if (selectedEvent === null) {
			return <h2>Unable to load data.</h2>;
		}

		return (
			<div className="container event-details-page">
				<div className="my-events-btn-wrapper">
					<Link to={routeConstants.MY_EVENTS} className="btn btn-primary">
						<FaLongArrowLeft className="arrow-icon" />
						&nbsp; My Events
					</Link>
				</div>
				<div className="jumbotron p-3 p-md-5 rounded bg-light">
					<div className="col-md-6 px-0">
						<h1 className="display-4 font-italic">Event: {selectedEvent.name}</h1>
						<p className="lead my-3">{selectedEvent.description}</p>
						<p>
							Start date: {startDate} | End date: {endDate}
						</p>
						<p>Visibility: {selectedEvent.visibility}</p>
						<p>
							Event Url: <span className="text-info">event/preview/{selectedEvent.ref}</span>
						</p>
					</div>
				</div>

				<div className="container-fluid">
					<div className="row">{this.tastings}</div>
				</div>
			</div>
		);
	}

	render() {
		const event = this.event;

		return <div className="container event-details-page">{event}</div>;
	}
}

function mapStateToProps(state) {
	return {
		events: state.events.data,
		selectedEvent: state.selectedEvent,
	};
}

export default connect(
	mapStateToProps,
	{fetchSelectedEvent}
)(EventDetails);
