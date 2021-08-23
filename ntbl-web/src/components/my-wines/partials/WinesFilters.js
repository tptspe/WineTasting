import React, {Component} from 'react';
import {CheckBox} from 'src/components/shared';
import filters from 'src/assets/json/filters.json';
import level3 from 'src/assets/json/tasting/level3.json';
import l18n from 'src/assets/json/l18n.json';

// styles
import './WinesFilters.scss';

function initDropDowns() {
	let newDropDowns = {};
	if (filters) {
		filters.keys.forEach((key, i) => {
			newDropDowns[key] = 'folded';
		});
	}
	return newDropDowns;
}

export default class WinesFilters extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			dropDowns: initDropDowns(),
			checkedFilters: [],
		};
		this.toggleFilter = this.toggleFilter.bind(this);
		this.checkBoxCallback = this.checkBoxCallback.bind(this);
	}

	toggleFilter(event) {
		let isOpen = !this.state.isOpen;
		this.setState({
			isOpen: isOpen,
		});
		this.props.toggleFilterCallback(isOpen);
	}

	toggleDropDown(event, key) {
		event.stopPropagation();
		let newDropDowns = JSON.parse(JSON.stringify(this.state.dropDowns));
		newDropDowns[key] = this.state.dropDowns[key] === 'folded' ? 'unfolded' : 'folded';

		this.setState({
			dropDowns: newDropDowns,
		});
	}

	checkBoxCallback(itemKey, checked) {
		let newCheckedFilters = this.state.checkedFilters.map((filter) => {
			return filter;
		});

		if (checked) {
			// Check if the itemKey is a filter-list-key/parent key, if true, CHECK all
			if (filters && filters.keys && filters.keys.includes(itemKey)) {
				newCheckedFilters.push(itemKey);
				if (level3[itemKey]) {
					level3[itemKey].forEach((filter) => {
						newCheckedFilters.push(filter);
					});
				}
			} else {
				newCheckedFilters.push(itemKey);
			}
		} else {
			// Check if the itemKey is a filter-list-key/parent key, if true, UNCHECK all
			if (filters && filters.keys && filters.keys.includes(itemKey)) {
				newCheckedFilters.splice(newCheckedFilters.indexOf(itemKey), 1);
				if (level3[itemKey]) {
					level3[itemKey].forEach((filter) => {
						newCheckedFilters.splice(newCheckedFilters.indexOf(filter), 1);
					});
				}
			} else {
				newCheckedFilters.splice(newCheckedFilters.indexOf(itemKey), 1);
			}
		}
		this.setState({checkedFilters: newCheckedFilters});
		this.props.filterCallback(newCheckedFilters);
	}

	get filters() {
		let {dropDowns, checkedFilters} = this.state;
		let filterList = [];

		if (filters) {
			filters.keys.forEach((key, i) => {
				let filterListItems = [];

				if (level3[key]) {
					filterListItems = level3[key].map((filterKey, i) => {
						return (
							<li key={i} className="filter-list-item">
								<CheckBox
									key={i}
									itemKey={filterKey}
									label={l18n[filterKey] ? l18n[filterKey] : filterKey}
									isChecked={checkedFilters.includes(filterKey)}
									onChangeCallback={this.checkBoxCallback}
								/>
							</li>
						);
					});
				}

				filterList.push(
					<li key={i} className={'filter ' + dropDowns[key]}>
						<div className="filter-list-key" onClick={(e) => this.toggleDropDown(e, key)}>
							<CheckBox
								key={i}
								itemKey={key}
								label={l18n[key] ? l18n[key] : key}
								isChecked={checkedFilters.includes(key)}
								onChangeCallback={this.checkBoxCallback}
							/>
							<div className="drop-arrow" />
						</div>
						<ul className={'filter-group'}>{filterListItems}</ul>
					</li>
				);
			});
		}

		return <ul>{filterList}</ul>;
	}

	render() {
		return (
			<div className="filters-wines">
				<h4 className="filters-header">Filter your tastings</h4>
				{this.filters}
			</div>
		);
	}
}
