import React, {Component} from 'react';
import sortingConfig from 'src/assets/json/sorting-config.json';
import l18n from 'src/assets/json/l18n.json';

export default class WinesSortButtons extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(value) {
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
				<button
					key={i}
					className={'btn btn-primary ' + (isSelected ? 'active' : '')}
					onClick={(e) => this.handleClick(value)}
				>
					{label ? label : option}
				</button>
			);
		});

		return (
			<div className="sort-wines-control sort-btns">
				<div className="form-group row">
					<label htmlFor="wine-name" className="col-2 col-sm-2 col-form-label">
						Sort by:
					</label>
					<div className="col-10 col-sm-10 info-field-wrapper">
						<div className="wine-sort-btns">{sortByOptions}</div>
					</div>
				</div>
			</div>
		);
	}
}
