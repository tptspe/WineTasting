import React, {Component} from 'react';
import {connect} from 'react-redux';

import './SearchClubBar.scss';

class SearchClubBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchKeyword: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const {
			clubs: {data = []},
			connectionStats: {online},
		} = this.props;

		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});

		if (this.props.onChangeCallback) {
			this.props.onChangeCallback(value, data, online);
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		const {clubs, online} = this.props;
		if (this.props.submitCallback) {
			this.props.submitCallback(this.state.searchKeyword, clubs, online);
		}
	}

	render() {
		return (
			<div className="container search-group-bar">
				<div className="row">
					<div className="col-12">
						<form
							onSubmit={this.handleSubmit}
							className="search-group-form"
							method="POST"
							action=""
						>
							<input
								type="text"
								id="search-input"
								name="searchKeyword"
								value={this.state.searchKeyword}
								className="form-control"
								placeholder="Search Clubs"
								onChange={this.handleChange}
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		clubs: state.clubs,
		connectionStats: state.offline,
	};
}

export default connect(mapStateToProps)(SearchClubBar);
