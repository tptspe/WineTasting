import React, {Component} from 'react';
import {connect} from 'react-redux';
import WinesSortButtons from './WinesSortButtons';
import {sortWines} from 'src/actions/wineActions';

import './SearchBar.scss';

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchKeyword: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.sortCallback = this.sortCallback.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});

		this.props.onChangeCallback(value);
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.submitCallback(this.state.searchKeyword);
	}

	sortCallback(sortBy) {
		this.props.sortWines(this.props.wines, sortBy);
	}

	render() {
		return (
			<div className="container search-bar">
				<div className="row">
					<div className="col-6 input-group mb-3">
						<form
							onSubmit={this.handleSubmit}
							className="search-tasting-form"
							method="POST"
							action=""
						>
							<input
								type="text"
								id="search-input"
								name="searchKeyword"
								value={this.state.searchKeyword}
								className="form-control"
								placeholder="Search Library"
								onChange={this.handleChange}
							/>
						</form>
					</div>

					<div className="col-6">
						<WinesSortButtons
							selectedSortBy={this.props.wines.sortBy}
							sortCallback={this.sortCallback}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		wines: state.wines,
	};
}

export default connect(
	mapStateToProps,
	{sortWines}
)(SearchBar);
