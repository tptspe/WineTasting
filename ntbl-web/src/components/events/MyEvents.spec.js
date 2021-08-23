import React from 'react';
import {MemoryRouter as Router} from 'react-router-dom';
import {render, cleanup, fireEvent} from 'react-testing-library';

import {UnconnectedMyEvents as MyEvents} from './MyEvents';

jest.mock('./partials/CreateEventModal', () =>
	jest.fn(({isOpen, saveCallback, toggle, eventWines = [], isSaving}) => (
		<div className="CreateEventModalMock">
			<p>CreateEventModal {isOpen ? 'Open' : 'Closed'}</p>
			<p>{isSaving ? 'Saving...' : ''}</p>
			<ul>
				{eventWines.map((wine) => (
					<li key={wine.value}>
						{wine.value} - {wine.label}
					</li>
				))}
			</ul>
			<button onClick={saveCallback}>Save event</button>
			<button onClick={toggle}>Close modal</button>
		</div>
	))
);

const renderMyEvents = (props) =>
	render(
		<Router>
			<MyEvents {...props} />
		</Router>
	);

describe('MyEvents', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = renderMyEvents();
		expect(container.firstChild).toBeTruthy();
	});

	it('Should fetch events', () => {
		const fetchEvents = jest.fn();
		renderMyEvents({fetchEvents});
		expect(fetchEvents).toBeCalledTimes(1);
	});

	it('Should have no events', () => {
		const {getByText, queryByText} = renderMyEvents({events: {data: [], error: null}});
		expect(getByText('You currently have no events.')).toBeTruthy();
		expect(queryByText('Unable to fetch data from the server')).toBeNull();
	});

	it('Should display error message', () => {
		const {getByText, queryByText} = renderMyEvents({events: {data: [], error: 'foo'}});
		expect(getByText('Unable to fetch data from the server')).toBeTruthy();
		expect(queryByText('You currently have no events.')).toBeNull();
	});

	it('Should display events list', () => {
		const {getByText, queryByText} = renderMyEvents({
			events: {
				data: [
					{ref: '123', name: 'First event'},
					{ref: '456', name: 'Second event'},
					{ref: '789', name: 'Third event'},
				],
				error: null,
			},
		});
		expect(getByText('First event')).toBeTruthy();
		expect(getByText('Second event')).toBeTruthy();
		expect(getByText('Third event')).toBeTruthy();
		expect(queryByText('You currently have no events.')).toBeNull();
		expect(queryByText('Unable to fetch data from the server')).toBeNull();
	});

	it('Should not display create event modal', () => {
		const {getByText} = renderMyEvents();
		expect(getByText('CreateEventModal Closed')).toBeTruthy();
	});

	it('Should open create event modal', () => {
		const {getByText} = renderMyEvents();
		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);
		expect(getByText('CreateEventModal Open')).toBeTruthy();
	});

	it('Should pass list of wines to the create event modal', () => {
		const {getByText} = renderMyEvents({
			wines: {
				data: [{ref: '111', name: 'First wine'}, {ref: '222', name: 'Second wine'}],
			},
		});

		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);

		expect(getByText('111 - First wine')).toBeTruthy();
		expect(getByText('222 - Second wine')).toBeTruthy();
	});

	it('Should close create event modal', () => {
		const {getByText} = renderMyEvents();
		expect(getByText('CreateEventModal Closed')).toBeTruthy();

		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);
		expect(getByText('CreateEventModal Open')).toBeTruthy();

		const closeBtn = getByText('Close modal');
		fireEvent.click(closeBtn);
		expect(getByText('CreateEventModal Closed')).toBeTruthy();
	});

	it('Should dispatch action to save event', () => {
		const addEvent = jest.fn();
		const {getByText} = renderMyEvents({addEvent});

		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);

		expect(addEvent).not.toHaveBeenCalled();
		const saveEventBtn = getByText('Save event');
		fireEvent.click(saveEventBtn);
		expect(addEvent).toHaveBeenCalledTimes(1);
	});

	it('Should not pass saving indicator to modal', () => {
		const {getByText, queryByText} = renderMyEvents();

		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);

		expect(queryByText('Saving...')).toBeNull();
	});

	it('Should pass saving indicator to modal', () => {
		const {getByText} = renderMyEvents({
			events: {
				data: [],
				isSaving: true,
			},
		});

		const createEventBtn = getByText('Create event');
		fireEvent.click(createEventBtn);

		expect(getByText('Saving...')).toBeTruthy();
	});
});
