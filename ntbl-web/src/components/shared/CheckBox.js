import React, {Component} from 'react';

import './CheckBox.scss';

export default class CheckBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			test: false,
		};
		this.changeHandler = this.changeHandler.bind(this);
	}

	changeHandler(event) {
		let target = event.target;
		let name = target.name;
		let checked = event.target.checked;

		if (this.props.onChangeCallback) {
			this.props.onChangeCallback(name, checked);
		}
	}

	render() {
		return (
			<div className="check-box-wrapper">
				<label htmlFor={this.props.itemKey}>
					<span>{this.props.label}</span>
				</label>
				<input
					type="checkbox"
					id={this.props.itemKey}
					name={this.props.itemKey}
					checked={this.props.isChecked}
					onChange={this.changeHandler}
				/>
				<div className="simbox">
					<div className="front" />
					<div className="back" />
				</div>
			</div>
		);
	}
}

CheckBox.defaultProps = {
	isChecked: false,
	onChangeCallback: null,
};
