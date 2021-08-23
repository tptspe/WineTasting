import React, {Component} from 'react';

export default class InputText extends Component {
	render() {
		return (
			<div className="form-group row input-text">
				{this.props.label && (
					<label className="col-sm-2 col-form-label" htmlFor={this.props.id}>
						{this.props.label}
					</label>
				)}
				<div className="col-sm-10 field-wrapper">
					<input
						type="text"
						className="form-control"
						id={this.props.id}
						name={this.props.name}
						value={this.props.value}
						onChange={this.props.handleChange}
						placeholder={this.props.placeholder}
					/>
				</div>
			</div>
		);
	}
}
