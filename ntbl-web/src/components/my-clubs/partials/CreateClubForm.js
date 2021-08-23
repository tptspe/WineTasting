import React, {Component} from 'react';
import {InputText} from 'src/components/shared';

export default class CreateClubForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			handle: '',
			description: '',
			visibility: 'open',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.clearFields = this.clearFields.bind(this);
	}

	handleSubmit(event) {
		let clubData = {
			name: this.state.name,
			handle: this.state.handle,
			description: this.state.description,
			visibility: this.state.visibility,
		};
		this.props.saveCallback(clubData, this.clearFields);
	}

	clearFields() {
		this.setState({
			name: '',
			handle: '',
			description: '',
			visibility: 'open',
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
		let radioStyle = {
			marginTop: '-3px',
		};

		let textAreaStyle = {
			padding: '7px',
			width: '100%',
			minHeight: '150px',
		};

		return (
			<div className="create-group-form">
				<form onSubmit={this.handleSubmit} className="create-group-form" method="POST">
					<InputText
						label="Name:"
						id="group-name"
						name="name"
						value={this.state.name}
						placeholder="Enter your club name"
						handleChange={this.handleChange}
					/>

					<InputText
						label="Handle:"
						id="group-handle"
						name="handle"
						value={this.state.handle}
						placeholder="Enter your club handle"
						handleChange={this.handleChange}
					/>

					<div className="form-group row">
						<label htmlFor="server-url" className="col-sm-2 col-form-label">
							Public:
						</label>

						<div className="col-sm-10 info-field-wrapper" style={{paddingTop: '6px'}}>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio1"
									value={'open'}
									checked={this.state.visibility === 'open'}
									onChange={this.handleChange}
									style={radioStyle}
								/>

								<label className="form-check-label" htmlFor="publicRadio1">
									Open
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio2"
									value={'hidden'}
									checked={this.state.visibility === 'hidden'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="publicRadio2">
									Hidden
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="visibility"
									id="publicRadio3"
									value={'private'}
									checked={this.state.visibility === 'private'}
									onChange={this.handleChange}
									style={radioStyle}
								/>
								<label className="form-check-label" htmlFor="publicRadio3">
									Private
								</label>
							</div>
						</div>
					</div>

					<textarea
						label="Handle:"
						id="group-description"
						name="description"
						value={this.state.description}
						placeholder="Club description"
						onChange={this.handleChange}
						style={textAreaStyle}
					/>
				</form>
			</div>
		);
	}
}
