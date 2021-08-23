import React, {Component} from 'react';
import {getLabel} from 'src/commons/commons';

export default class InfoField extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		this.props.infoCallBack({[this.props.infoKey]: value});
	}

	handleBlur(event) {
		if (this.props.autoSuggestCallBack) {
			const target = event.target;
			const value = target.value;
			this.props.autoSuggestCallBack({[this.props.infoKey]: value});
		}
	}

	render() {
		const labelName = getLabel(this.props.infoKey, ['tasting_']);
		const id = 'tasting_' + labelName;
		const name = 'tasting_' + labelName;

		const label = this.props.infoKey ? (
			<label htmlFor={'wine_' + labelName} className="col-sm-2 col-form-label">
				{getLabel(this.props.infoKey, ['tasting_'])}
			</label>
		) : (
			'N/A'
		);
		const miniLabel = this.props.infoKey ? (
			<span className="mini-label">
				{this.props.required ? '* ' : null}
				{getLabel(this.props.infoKey, ['tasting_'])}
			</span>
		) : (
			'N/A'
		);
		const placeholder = this.props.placeholder ? this.props.placeholder : '';

		return (
			<div className="form-group row">
				{label}
				<div className="col-sm-10 info-field-wrapper">
					<input
						type="text"
						className="form-control info-field"
						id={id}
						name={name}
						placeholder={placeholder}
						value={this.props.value}
						onChange={this.handleChange}
						onBlur={this.handleBlur}
						disabled={this.props.disabled}
					/>
					{miniLabel}
				</div>
			</div>
		);
	}
}

InfoField.defaultProps = {
	required: false,
	disabled: false,
	value: '',
};
