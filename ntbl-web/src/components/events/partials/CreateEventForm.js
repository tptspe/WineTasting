import React, {Component} from 'react';
import DatePicker from 'react-date-picker';
import Select from 'react-select';

import {InputText} from 'src/components/shared';

export default class CreateEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			visibility: '',
			start_date: new Date(),
			end_date: new Date(),
			wine_refs: [],
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleWinesChange = this.handleWinesChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearFields = this.clearFields.bind(this);
	}

	handleSubmit(event) {
		this.props.saveCallback(this.state, this.clearFields);
	}

	clearFields() {
		this.setState({
			name: '',
			description: '',
			visibility: '',
			start_date: '',
			end_date: '',
			wine_refs: [],
		});
	}

	handleDateChange(field, value) {
		this.setState({
			[field]: value,
		});
	}

	handleChange(event) {
		const target = event.target;
		let value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	handleWinesChange(eventWines) {
		this.setState({
			wine_refs: eventWines.map((wine) => {
				return wine.value;
			}),
		});
	}

	render() {
		const options = this.props.eventWines;

		let textAreaStyle = {
			padding: '7px',
			minHeight: '150px',
			minWidth: '100%',
		};

		return (
			<div className="create-event-form">
				<form onSubmit={this.handleSubmit} className="create-event-form" method="POST">
					<InputText
						label="Name:"
						id="event-name"
						name="name"
						value={this.state.name}
						placeholder="Enter your event name"
						handleChange={this.handleChange}
					/>

					<div className="row form-group mb-3">
						<div className="col-3">
							<label className="col-form-label" htmlFor="event-start-date">
								Start Date:
							</label>
						</div>
						<div className="col-9">
							<DatePicker
								label="Start Date:"
								id="event-start-date"
								name="start_date"
								value={this.state.start_date}
								placeholder="Enter your event start date"
								onChange={(value) => this.handleDateChange('start_date', value)}
							/>
						</div>
					</div>

					<div className="row form-group mb-3">
						<div className="col-3">
							<label className="col-form-label" htmlFor="event-end-date">
								End Date:
							</label>
						</div>
						<div className="col-9">
							<DatePicker
								label="End Date:"
								id="event-end-date"
								name="end_date"
								value={this.state.end_date}
								placeholder="Enter your event end date"
								onChange={(value) => this.handleDateChange('end_date', value)}
							/>
						</div>
					</div>

					<div className="row form-group mb-3">
						<div className="col-3">
							<label className="col-form-label" htmlFor="">
								Visibility:
							</label>
						</div>
						<div className="col-9">
							<select
								value={this.state.visibility}
								name="visibility"
								onChange={this.handleChange}
								className="custom-select"
							>
								<option value="open">Open</option>
								<option value="hidden">Hidden</option>
								<option value="private">Private</option>
							</select>
						</div>
					</div>

					<div className="row mb-3">
						<div className="col-12">
							<textarea
								id="event-description"
								name="description"
								value={this.state.description}
								placeholder="Event description"
								onChange={this.handleChange}
								style={textAreaStyle}
							/>
						</div>
					</div>

					<div className="row mb-3">
						<div className="col-12">
							<h6>Add wines: </h6>
							<Select
								value={this.state.eventWines}
								onChange={this.handleWinesChange}
								options={options}
								isMulti
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}
