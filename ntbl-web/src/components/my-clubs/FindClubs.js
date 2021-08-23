import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import debounce from 'lodash.debounce';
import {ListGroup, ListGroupItem} from 'mdbreact';

import {searchClubs} from 'src/actions/clubActions';
import {routeConstants} from 'src/constants';
import {SearchClubBar} from './partials';

import './MyClubs.scss';

class FindClubs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
		};
		this.onChangeCallback = this.onChangeCallback.bind(this);
		this.searchClubs = debounce(props.searchClubs, 350);
	}

	onChangeCallback(searchValue, clubs, online) {
		if (searchValue) {
			this.searchClubs(searchValue, clubs, online);
		}
	}

	get searchedClubs() {
		const {searchedClubs} = this.props;
		let content = null;
		let clubsToDisplay = searchedClubs;

		// if (searchedClubs.data && searchedClubs.data.length <= 0) {
		// 	clubsToDisplay = clubs;
		// }

		if (clubsToDisplay.data && clubsToDisplay.data.length <= 0) {
			content = <div>Type in a group's name or handle in the form above.</div>;
		}

		if (clubsToDisplay.data.length > 0) {
			let max = 140;
			content = (
				<ListGroup>
					{clubsToDisplay.data.map((club, i) => {
						return (
							<Link key={i} to={`${routeConstants.CLUB}/${club.handle}`}>
								<ListGroupItem>
									<p>
										{club.name} | @{club.handle}
									</p>
									<p>
										{club.description.length > max
											? `${club.description.substring(0, max).trim()}...`
											: club.description}
									</p>
								</ListGroupItem>
							</Link>
						);
					})}
				</ListGroup>
			);
		}

		return content;
	}

	render() {
		return (
			<div className="container my-groups-page">
				<h1 className="title clearfix">Find Clubs</h1>

				<SearchClubBar onChangeCallback={this.onChangeCallback} />

				{this.searchedClubs}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		searchedClubs: state.searchedClubs,
	};
}

export default connect(
	mapStateToProps,
	{searchClubs}
)(FindClubs);
