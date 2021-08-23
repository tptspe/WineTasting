import React, {Component} from 'react';
import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';

import {InputText} from 'src/components/shared';

export default class FeedbackForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			message: '',
			success: false,
			errors: {
				name: '',
				email: '',
			},
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.clearFields = this.clearFields.bind(this);
	}

	handleSubmit(event) {
		const {submitCallback, toggleFeedbackForm} = this.props;

		let feedback = {
			name: this.state.name,
			email: this.state.email,
			message: this.state.message,
		};

		if (this.validateForm(feedback)) {
			submitCallback(feedback, this.clearFields);
			this.setState({success: true});

			// auto close feedback form after 2 seconds
			setTimeout(() => {
				this.setState({success: false});
				toggleFeedbackForm();
			}, 2500);
		}
	}

	validateForm(feedback) {
		let numOfErrors = 0;
		let errors = {};

		Object.keys(feedback).forEach((key) => {
			let value = feedback[key];

			if (key === 'name' || key === 'email') {
				if (_.isEmpty(value)) {
					errors[key] = `The ${key} field is required`;
					numOfErrors++;
				}
			}

			if (key === 'email') {
				if (!isEmail(value)) {
					errors[key] = `Invalid ${key} format`;
					numOfErrors++;
				}
			}
		});
		this.setState({errors});
		return numOfErrors ? false : true;
	}

	clearFields() {
		this.setState({
			name: '',
			email: '',
			message: '',
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

	render() {
		let {errors, success} = this.state;
		let feedback = this.props.feedback;

		return (
			<form className="feedback-form">
				<InputText
					label="Name:"
					id="feedback-name"
					name="name"
					value={this.state.name}
					placeholder="Enter your name"
					handleChange={this.handleChange}
				/>

				{errors.name && (
					<div className="alert alert-danger" role="alert">
						<strong>{errors.name}</strong>
					</div>
				)}

				<InputText
					label="Email:"
					id="feedback-email"
					name="email"
					value={this.state.email}
					placeholder="Enter your email"
					handleChange={this.handleChange}
				/>

				{errors.email && (
					<div className="alert alert-danger" role="alert">
						<strong>{errors.email}</strong>
					</div>
				)}

				<div className="form-group">
					<textarea
						label="Message:"
						id="feedback-message"
						name="message"
						value={this.state.message}
						placeholder="Please enter your message"
						onChange={this.handleChange}
					/>
				</div>

				{feedback.error && (
					<div className="alert alert-danger" role="alert">
						<strong>{feedback.error.message}</strong>
					</div>
				)}

				{success && feedback.success && (
					<div className="alert alert-success" role="alert">
						<strong>
							Thank you&nbsp;
							<span role="img" aria-label="heart">
								❤
							</span>
						</strong>
					</div>
				)}

				<div className="form-group submit-btn-container">
					<input
						className="btn btn-primary"
						type="button"
						value="Send Feedback"
						onClick={this.handleSubmit}
					/>
				</div>
			</form>
		);
	}
}
