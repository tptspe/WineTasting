import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import dateFns from 'date-fns';
import {Card, CardBody, CardImage, CardTitle, CardText, Collapse} from 'mdbreact';
import FaLongArrowRight from 'react-icons/lib/fa/long-arrow-right';

import {fetchWines, searchWines, filterWines, saveSortCollapseState} from 'src/actions/wineActions';
import {
	redirect,
	daysAgo,
	areSameDates,
	withinDateRange,
	isEmpty,
	sortByName,
} from 'src/commons/commons';
import {CollapseHeader, RatingTotal} from 'src/components/shared';
import {SearchBar, WinesControls, WinesFilters} from './partials';

import sortingConfig from 'src/assets/json/sorting-config.json';
import l18n from 'src/assets/json/l18n.json';
import {routeConstants} from 'src/constants';

import './MyWines.scss';

const wineNameCharLimit = 13;

class MyWines extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFilterOpen: false,
			collapse: {},
		};
		this.submitCallback = this.submitCallback.bind(this);
		this.filterCallback = this.filterCallback.bind(this);
		this.onChangeCallback = this.onChangeCallback.bind(this);
		this.toggleFilterCallback = this.toggleFilterCallback.bind(this);
		this.initWines(props);
	}

	toggleFilterCallback(isFilterOpen) {
		this.setState({
			isFilterOpen: isFilterOpen,
		});
	}

	toggleCollapse(collapseKey, defaultCollapseVal = false) {
		let newCollapse = JSON.parse(JSON.stringify(this.state.collapse));
		let collapseVal =
			newCollapse[collapseKey] !== undefined ? newCollapse[collapseKey] : defaultCollapseVal;
		newCollapse[collapseKey] = !collapseVal;

		this.setState({
			collapse: newCollapse,
		});

		this.props.saveSortCollapseState({collapse: newCollapse}, this.props.wines.sortStatus);
	}

	filterCallback(checkedFilters) {
		this.props.filterWines(checkedFilters, this.props.wines.sortBy);
	}

	submitCallback(keyword) {
		this.props.searchWines(keyword, this.props.wines.sortBy);
	}

	onChangeCallback(searchValue) {
		if (searchValue) {
			this.props.searchWines(searchValue, this.props.wines.sortBy);
		} else {
			this.initWines(this.props);
		}
	}

	componentDidUpdate() {
		// Update collapse based on its persisted state
		const collapseState = this.props.wines.sortStatus.collapseState;

		if (collapseState) {
			let persistedCollapse = collapseState.collapse;

			// Apply persisted collapse if it exists and hasn't been initialized yet
			if (persistedCollapse && Object.keys(this.state.collapse).length <= 0) {
				this.setState({
					collapse: persistedCollapse,
				});
			}
		}
	}

	initWines(props) {
		const sortBy = this.props.wines.sortBy;
		this.props.fetchWines(sortBy);
	}

	loopWines(wines) {
		sortByName(wines);
		let numOfCols = this.state.isFilterOpen ? 'col-4' : 'col-3';
		let loop = wines.map((wine) => {
			let wineImg =
				wine.images && wine.images[0]
					? wine.images[0]
					: require('src/assets/images/wine-bottle-default.jpg');

			// Reduce wine name length to 13 so that card height is consistent for all.
			const trimWine =
				wine.name.length > wineNameCharLimit
					? `${wine.name.trim().substr(0, wineNameCharLimit)}...`
					: wine.name;

			return (
				<div key={wine.id} className={'wine-list-col ' + numOfCols}>
					<Link to={`${routeConstants.WINE_DETAILS}/${wine.ref}`}>
						<Card className="wine-card">
							<CardImage className="img-fluid wine-img" src={wineImg} alt="Wine bottle" />
							<CardBody>
								<CardTitle>
									{wine.region}
									<br />
									{trimWine}
								</CardTitle>
								<CardText>
									<span>
										{wine.vintage}, {wine.country}
									</span>
									<br />
								</CardText>
								<button
									onClick={(e) => {
										redirect(this.props.history, `${routeConstants.WINE_DETAILS}/${wine.ref}`);
									}}
									className="btn btn-primary see-more-btn"
								>
									See more
								</button>
								<div className="rating-total-wrapper">
									<RatingTotal showLabel={false} ratings={wine.rating} />
								</div>
							</CardBody>
						</Card>
					</Link>
				</div>
			);
		});

		return loop;
	}

	getSortedContent(wines, collapseKey, groupClassName = '', title = '', collapseDefault = true) {
		let randomKey =
			collapseKey +
			Math.random()
				.toString(36)
				.substring(7);
		let isOpen =
			this.state.collapse[collapseKey] !== undefined
				? this.state.collapse[collapseKey]
				: collapseDefault;

		return (
			<div key={randomKey} className={groupClassName}>
				<CollapseHeader
					title={title}
					isOpen={isOpen}
					toggleCollapseCallback={(e) => this.toggleCollapse(collapseKey, collapseDefault)}
				/>
				<Collapse isOpen={isOpen}>
					<div className="row">{this.loopWines(wines)}</div>
				</Collapse>
			</div>
		);
	}

	getCountryView(winesByCountry) {
		let groupClassName = 'wines-by-country';
		let _unspecifiedWines = null;
		let _unspecifiedKey = '_unspecified';

		if (winesByCountry) {
			return (
				<div className="wine-list-row row">
					<div className={'wines-containers-cols-container col-12'}>
						{Object.keys(winesByCountry).map((key, i) => {
							if (key !== '_unspecified') {
								let winesToLoop = winesByCountry[key];
								return (
									winesToLoop.length > 0 &&
									this.getSortedContent(winesToLoop, key, groupClassName, key)
								);
							} else {
								_unspecifiedWines = winesByCountry[key];
								return null;
							}
						})}

						{_unspecifiedWines &&
							_unspecifiedWines.length > 0 &&
							this.getSortedContent(
								_unspecifiedWines,
								_unspecifiedKey,
								groupClassName,
								l18n[_unspecifiedKey]
							)}
					</div>
				</div>
			);
		}
	}

	getRatingView(winesByRating) {
		let ratingSort = sortingConfig['rating_sort_'].groups;
		let groupClassName = 'wines-by-rating';
		let _unspecifiedKey = '_unspecified';
		let _unspecifiedWines = winesByRating[_unspecifiedKey] ? winesByRating[_unspecifiedKey] : [];

		if (winesByRating) {
			return (
				<div className="wine-list-row row">
					<div className={'wines-containers-cols-container col-12'}>
						{Object.keys(ratingSort).map((sortKey) => {
							let winesToLoop = winesByRating[sortKey];
							return (
								winesToLoop &&
								winesToLoop.length > 0 &&
								this.getSortedContent(winesToLoop, sortKey, groupClassName, l18n[sortKey])
							);
						})}

						{_unspecifiedWines.length > 0 &&
							this.getSortedContent(
								_unspecifiedWines,
								_unspecifiedKey,
								groupClassName,
								l18n[_unspecifiedKey]
							)}
					</div>
				</div>
			);
		}
	}

	getDateView(winesByDate) {
		let dateSort = sortingConfig['date_sort_'].groups;
		let groupClassName = 'wines-by-date';
		let yearlySorts = winesByDate['yearly_sorts'];

		if (winesByDate && Object.keys(winesByDate).length > 0) {
			return (
				<div className="wine-list-row row">
					<div className={'wines-containers-cols-container col-12'}>
						{Object.keys(dateSort).map((sortKey) => {
							let dateGroup = dateSort[sortKey];
							let type = Object.keys(dateGroup)[0];
							let winesToLoop = winesByDate[type];
							return (
								winesToLoop &&
								winesToLoop.length > 0 &&
								this.getSortedContent(winesToLoop, sortKey, groupClassName, l18n[sortKey])
							);
						})}

						{yearlySorts &&
							Object.keys(yearlySorts).length > 0 &&
							Object.keys(yearlySorts)
								.reverse()
								.map((key, i) => {
									let winesToLoop = yearlySorts[key];
									return (
										winesToLoop.length > 0 &&
										this.getSortedContent(winesToLoop, key, groupClassName, key)
									);
								})}
					</div>
				</div>
			);
		}
	}

	getPriceView(wines) {
		let key = 'price';
		if (wines) {
			return (
				<div className="wine-list-row row">
					<div className={'wines-containers-cols-container col-12'}>
						{wines.length > 0 &&
							this.getSortedContent(wines, key, 'wines-by-price', l18n['ui_' + key])}
					</div>
				</div>
			);
		}
	}

	getDefaultView(wines) {
		if (wines) {
			return (
				<div className="wine-list-row row">
					<div className={'wines-containers-cols-container col-12'}>
						<div className="row">{this.loopWines(wines)}</div>
					</div>
				</div>
			);
		}
	}

	organizeContent(wines) {
		let content = null;
		let data = wines.data;
		let sortBy = wines.sortBy;
		let sortedWines = {};

		if (!data) {
			return '';
		}

		switch (sortBy) {
			case 'country':
				data.forEach((wine) => {
					let countryKey = wine.country ? wine.country : '_unspecified';
					if (!sortedWines[countryKey]) {
						sortedWines[countryKey] = [];
					}
					sortedWines[countryKey].push(wine);
				});

				content = this.getCountryView(sortedWines);
				break;
			case 'rating':
				data.forEach((wine) => {
					let ratingSort = sortingConfig['rating_sort_'].groups;
					let wineRating = wine.rating;
					let ratingKey = null;

					Object.keys(ratingSort).forEach((sortKey) => {
						let ratingGroup = ratingSort[sortKey];
						let type = Object.keys(ratingGroup)[0];
						let value = ratingGroup[type];

						if (isEmpty(wineRating) || isEmpty(wineRating.parker_val)) {
							ratingKey = '_unspecified';
							return null;
						}

						if (type === 'above') {
							if (wineRating.parker_val > value) {
								ratingKey = sortKey;
							}
						} else if (type === 'between') {
							if (wineRating.parker_val >= value[0] && wineRating.parker_val <= value[1]) {
								ratingKey = sortKey;
							}
						} else if (type === 'below') {
							if (wineRating.parker_val < value) {
								ratingKey = sortKey;
							}
						}
					});

					if (!sortedWines[ratingKey]) {
						sortedWines[ratingKey] = [];
					}

					sortedWines[ratingKey].push(wine);
				});

				content = this.getRatingView(sortedWines);
				break;
			case 'price':
				content = this.getPriceView(data);
				break;
			case 'date':
				let yearlySorts = {};

				data.forEach((wine) => {
					let dateSort = sortingConfig['date_sort_'].groups;
					let wineCreatedAt = wine.created_at;

					if (wineCreatedAt) {
						let wineCreatedDate = dateFns.parse(wineCreatedAt.date);
						let dateKey = null;

						Object.keys(dateSort).forEach((sortKey) => {
							let dateGroup = dateSort[sortKey];
							let type = Object.keys(dateGroup)[0];
							let value = dateGroup[type];
							let dateRange = daysAgo(value);

							if (type === 'today' || type === 'yesterday') {
								// Check if wine is created today
								if (areSameDates(wineCreatedDate, dateRange)) {
									dateKey = dateKey === null && type;
									if (!sortedWines[dateKey]) {
										sortedWines[dateKey] = [];
									}
									sortedWines[dateKey].push(wine);
								}
							} else if (type === 'aweekago' || type === 'amonthago') {
								// Check if wine is within the past week
								if (withinDateRange(wineCreatedDate, dateRange)) {
									dateKey = dateKey === null && type;
									if (!sortedWines[dateKey]) {
										sortedWines[dateKey] = [];
									}
									sortedWines[dateKey].push(wine);
								}
							}
						});

						// Sort wines by year
						if (dateKey === null && wineCreatedDate.getUTCFullYear()) {
							dateKey = wineCreatedDate.getUTCFullYear();
							if (!yearlySorts[dateKey]) {
								yearlySorts[dateKey] = [];
							}
							yearlySorts[dateKey].push(wine);
						}
					}
				});

				if (yearlySorts && Object.keys(yearlySorts).length > 0) {
					sortedWines['yearly_sorts'] = yearlySorts;
				}

				content = this.getDateView(sortedWines);
				break;
			default:
				content = this.getDefaultView(data);
		}

		return content;
	}

	get wines() {
		const {wines} = this.props;
		let content = null;

		if ((wines.data == null || wines.data.length <= 0) && wines.error === null) {
			content = <div>You currently have no wines.</div>;
		}

		if (wines.error) {
			content = <div style={{color: 'red'}}>Unable to fetch data from the server</div>;
		}

		if (wines.data && wines.data.length) {
			content = this.organizeContent(wines);
		}

		return content;
	}

	render() {
		const {
			wines: {data = []},
		} = this.props;
		const wines = this.wines;
		const isFilterOpen = this.state.isFilterOpen;

		let winesContainerCols = isFilterOpen ? 'col-9' : 'col-12';

		return (
			<div className="container my-wines-page">
				<h1 className="title clearfix">
					My Wines
					<Link
						to={routeConstants.NEW_TASTING}
						className={'btn btn-primary ' + (this.props.wines ? 'with-wines' : '')}
					>
						New Tasting <FaLongArrowRight className="arrow-icon" />
					</Link>
				</h1>

				<SearchBar submitCallback={this.submitCallback} onChangeCallback={this.onChangeCallback} />

				<div className="container-fluid">
					<div className="row">
						<div className={winesContainerCols}>
							{data && !!data.length && (
								<WinesControls
									toggleFilterCallback={this.toggleFilterCallback}
									isFilterOpen={this.state.isFilterOpen}
								/>
							)}
							{wines}
						</div>

						{isFilterOpen && (
							<div className="filters-wines-container col-3">
								<WinesFilters filterCallback={this.filterCallback} />
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		wines: state.wines,
		user: state.user,
	};
}

export default connect(
	mapStateToProps,
	{
		fetchWines,
		searchWines,
		filterWines,
		saveSortCollapseState,
	}
)(MyWines);
