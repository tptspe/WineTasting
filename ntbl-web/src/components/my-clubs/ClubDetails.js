import React, {Component} from 'react';
import dateFns from 'date-fns';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import {Card, CardBody, CardTitle, CardText, CardFooter} from 'mdbreact';

import {fetchSelectedClub, updateClub, clearSelectedClub} from 'src/actions/clubActions';
import {Loading} from 'src/components/shared';
import {routeConstants} from 'src/constants';

import './ClubDetails.scss';

class ClubDetails extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editmode: false,
			groupHandle: '',
			groupDescription: '',
		};

		this.switchMode = this.switchMode.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
	}

	switchMode() {
		const {ref = ''} = this.props.selectedClub.data;

		if (ref) {
			this.setState({
				editmode: !this.state.editmode,
			});
		}
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
	}

	saveChanges(groupRef) {
		const selectedClub = this.props.selectedClub.data;
		const userRelations = selectedClub ? selectedClub.userRelations : [];

		let isOwnerOrAdmin = userRelations.includes('owner') || userRelations.includes('admin');
		let isContrib = userRelations.includes('contrib');

		let groupData = {
			ref: selectedClub.ref,
			name: selectedClub.name,
			handle: selectedClub.handle,
			created_at: selectedClub.created_at,
			visibility: selectedClub.visibility,
			description: selectedClub.description,
			userRelations: selectedClub.userRelations,
			updated_at: dateFns.format(new Date(), 'YYYY-MM-DD HH:MM:SS'),
		};

		if (isOwnerOrAdmin) {
			groupData['handle'] = this.state.groupHandle;
		}

		if (isOwnerOrAdmin || isContrib) {
			groupData['description'] = this.state.groupDescription;
		}

		if (!userRelations.length) {
			groupData = {relation: ['member']};
		}

		this.setState({
			editmode: false,
		});

		this.props.updateClub(groupRef, groupData);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const selectedClub = nextProps.selectedClub.data;

		if (selectedClub && prevState.groupHandle === '') {
			return {
				groupHandle: selectedClub.handle,
			};
		}

		if (selectedClub && prevState.groupDescription === '') {
			return {
				groupDescription: selectedClub.description,
			};
		}

		return null;
	}

	componentDidMount() {
		const {
			clubs,
			match: {params},
		} = this.props;
		this.props.fetchSelectedClub(params.groupHandle, clubs);
	}

	componentWillUnmount() {
		this.props.clearSelectedClub();
	}

	get group() {
		const {editmode, groupHandle, groupDescription} = this.state;
		const selectedClub = this.props.selectedClub.data;
		const userRelations = selectedClub ? selectedClub.userRelations : [];
		const isMemberOnly = !!userRelations.length && userRelations.includes('member');
		const hasRef = selectedClub && selectedClub.ref;

		// Disable save button when there is no change.
		const disableBtn =
			selectedClub &&
			selectedClub.handle === groupHandle &&
			selectedClub.description === groupDescription;

		const saveBtnClass = classnames('save-btn', {
			disabled: disableBtn && selectedClub.ref,
		});

		const editBtnClass = classnames('edit-btn', {
			disabled: !hasRef,
		});

		let isOwnerOrAdmin = userRelations.includes('owner') || userRelations.includes('admin');
		let isContrib = userRelations.includes('contrib');

		if (selectedClub === null) {
			return <h2>Unable to load data.</h2>;
		}

		const txtBtn = !!userRelations.length ? 'Save' : 'Become member';

		return (
			<div className="group-details">
				<div className="my-groups-btn-wrapper">
					<Link to={routeConstants.MY_CLUBS} className="btn btn-primary">
						<FaLongArrowLeft className="arrow-icon" />
						My Clubs
					</Link>
					{!hasRef && <span> (Please go online to make changes).</span>}
				</div>
				<Card className="group-info">
					{(isOwnerOrAdmin || isContrib) && (
						<button className={editBtnClass} onClick={this.switchMode}>
							Edit Club
						</button>
					)}
					<CardBody>
						<CardTitle tag="h5">
							{selectedClub.name} |{' '}
							{editmode && isOwnerOrAdmin ? (
								<input
									className="group-handle edit"
									type="text"
									value={groupHandle}
									name="groupHandle"
									onChange={this.handleChange}
								/>
							) : (
								<span className="group-handle">@{selectedClub.handle}</span>
							)}
						</CardTitle>
						<div className="group-about">
							<h3>Description</h3>
							<CardText>
								{editmode && (isOwnerOrAdmin || isContrib) ? (
									<textarea
										className="group-description"
										value={groupDescription}
										name="groupDescription"
										onChange={this.handleChange}
									/>
								) : (
									selectedClub.description
								)}
							</CardText>
						</div>
						<div className="save-btn-container">
							{!isMemberOnly && editmode && (
								<button className={saveBtnClass} onClick={() => this.saveChanges(selectedClub.ref)}>
									{txtBtn}
								</button>
							)}
							{this.props.selectedClub.isSaving && <Loading loadingText={''} />}
						</div>
					</CardBody>
					<CardFooter small muted>
						<span>{selectedClub.public ? 'Public' : 'Closed'} Club</span> |{' '}
						{selectedClub.created_at
							? 'created at: ' + dateFns.parse(selectedClub.created_at).toLocaleDateString()
							: null}
					</CardFooter>
				</Card>
			</div>
		);
	}

	render() {
		const group = this.group;
		return <div className="container group-details-page">{group}</div>;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		clubs: state.clubs.data,
		connectionStatus: state.offline,
		selectedClub: state.selectedClub,
	};
}

export default connect(
	mapStateToProps,
	{fetchSelectedClub, clearSelectedClub, updateClub}
)(ClubDetails);
