import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import MdAdd from 'react-icons/lib/md/add';
import MdSearch from 'react-icons/lib/md/search';
import {ListGroup, ListGroupItem} from 'mdbreact';

import {CreateClubModal} from './partials';
import {fetchClubs, addClub} from 'src/actions/clubActions';
import {routeConstants} from 'src/constants';

import './MyClubs.scss';

class MyClubs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
		};
		this.toggle = this.toggle.bind(this);
		this.saveGroup = this.saveGroup.bind(this);
	}

	componentDidMount() {
		this.props.fetchClubs();
	}

	toggle() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	saveGroup(groupData, saveCallback = null) {
		let addGroupCallback = () => {
			if (saveCallback) {
				saveCallback();
			}
			this.toggle();
		};

		this.props.addClub(groupData, addGroupCallback);
	}

	get groups() {
		const {clubs} = this.props;
		let content = null;

		if (clubs.data.length <= 0 && clubs.error === null) {
			content = <div>You currently have no clubs.</div>;
		}

		if (clubs.error) {
			content = <div style={{color: 'red'}}>Unable to fetch data from the server</div>;
		}

		if (clubs.data.length > 0) {
			content = (
				<ListGroup>
					{clubs.data.map((club, i) => {
						return (
							<Link key={i} to={`${routeConstants.CLUB}/${club.handle}`}>
								<ListGroupItem>{club.name}</ListGroupItem>
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
				<h1 className="title clearfix">
					My Clubs
					<button
						className={'btn btn-primary create-group-btn'}
						onClick={() => this.toggle('createGroup')}
					>
						Create club <MdAdd className="arrow-icon" />
					</button>
					<Link to={routeConstants.FIND_CLUBS} className={'btn btn-primary'}>
						Find Clubs <MdSearch className="arrow-icon" />
					</Link>
				</h1>
				{this.groups}

				<CreateClubModal
					isOpen={this.state.modal}
					saveCallback={this.saveGroup}
					handleChange={this.handleChange}
					toggle={this.toggle}
					isSaving={this.props.clubs.isSaving}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
		clubs: state.clubs,
	};
}

export default connect(
	mapStateToProps,
	{fetchClubs, addClub}
)(MyClubs);
