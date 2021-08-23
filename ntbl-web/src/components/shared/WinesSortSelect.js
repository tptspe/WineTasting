import React, {Component} from 'react';

import sortingConfig from 'src/assets/json/sorting-config.json';
import l18n from 'src/assets/json/l18n.json';

export default class WinesSortSelect extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		this.props.sortCallback(value);
	}

	render() {
		let sortByOptions = sortingConfig.options.map((option, i) => {
			let value =
				sortingConfig[option] && sortingConfig[option].value ? sortingConfig[option].value : option;
			let label =
				sortingConfig[option] && sortingConfig[option].label
					? l18n[sortingConfig[option].label]
					: option;
			let isSelected = this.props.selectedSortBy === value ? true : false;

			return (
				<option key={i} value={value} selected={isSelected}>
					{label ? label : option}
				</option>
			);
		});

		return (
			<div className="sort-wines-control">
				<div className="form-group row">
					<label htmlFor="wine-name" className="col-sm-3 col-form-label">
						Sort by:
					</label>
					<div className="col-sm-9 info-field-wrapper">
						<select name="" id="" onChange={this.handleChange}>
							{sortByOptions}
						</select>
					</div>
				</div>
			</div>
		);
	}
}
