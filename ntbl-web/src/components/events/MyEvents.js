import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import MdAdd from 'react-icons/lib/md/add';
import MdEvent from 'react-icons/lib/md/event';
import {ListGroup, ListGroupItem} from 'mdbreact';

import {fetchEvents, addEvent} from 'src/actions/eventActions';
import {routeConstants} from 'src/constants';
import {CreateEventModal} from './partials';

import './MyEvents.scss';

class MyEvents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
		};
		this.toggle = this.toggle.bind(this);
		this.saveEvent = this.saveEvent.bind(this);
	}

	componentDidMount() {
		this.props.fetchEvents();
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	saveEvent(eventData, saveCallback = null) {
		let addEventCallback = () => {
			if (saveCallback) {
				saveCallback();
			}
			this.toggle();
		};

		this.props.addEvent(eventData, addEventCallback);
	}

	get events() {
		const {events} = this.props;

		let content = null;

		if (events.data.length <= 0 && events.error === null) {
			content = <div>You currently have no events.</div>;
		}

		if (events.error) {
			content = <div style={{color: 'red'}}>Unable to fetch data from the server</div>;
		}

		if (events.data.length > 0) {
			content = (
				<ListGroup>
					{events.data.map((event, i) => {
						return (
							<Link key={i} to={`${routeConstants.EVENT}/${event.ref}`}>
								<ListGroupItem>{event.name}</ListGroupItem>
							</Link>
						);
					})}
				</ListGroup>
			);
		}

		return content;
	}

	render() {
		const {wines} = this.props;
		const eventWines = wines.data.map((wine) => {
			return {
				value: wine.ref,
				label: wine.name,
			};
		});

		return (
			<div className="container my-events-page">
				<h1 className="title clearfix">
					My Events
					<Link to={routeConstants.EVENT} className={'btn btn-primary create-event-btn'}>
						Attend event <MdEvent className="arrow-icon" />
					</Link>
					<button className={'btn btn-primary create-event-btn'} onClick={() => this.toggle()}>
						Create event <MdAdd className="arrow-icon" />
					</button>
				</h1>
				{this.events}

				<CreateEventModal
					isOpen={this.state.modal}
					saveCallback={this.saveEvent}
					toggle={this.toggle}
					eventWines={eventWines}
					isSaving={this.props.events.isSaving}
				/>
			</div>
		);
	}
}

MyEvents.defaultProps = {
	events: {data: []},
	wines: {data: []},
	fetchEvents: () => {},
};

export {MyEvents as UnconnectedMyEvents};

function mapStateToProps(state) {
	return {
		app: state.app,
		wines: state.wines,
		events: state.events,
	};
}

export default connect(
	mapStateToProps,
	{fetchEvents, addEvent}
)(MyEvents);
