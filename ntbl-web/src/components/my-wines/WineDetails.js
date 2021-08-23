import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Card, CardBody, CardImage, CardTitle} from 'mdbreact';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import dateFns from 'date-fns';

import {fetchSelectedWine} from 'src/actions/wineActions';
import {RatingBoard, RatingTotal} from 'src/components/shared';
import {routeConstants} from 'src/constants';

import './WineDetails.scss';

class WineDetails extends Component {
	componentDidMount() {
		const {
			wine,
			match: {params},
		} = this.props;

		const wineDetails = wine.find((wineDetail) => wineDetail.ref === params.wineRef);
		this.props.fetchSelectedWine(params.wineRef, wineDetails);
	}

	prepareRating(ratings) {
		let newRatings = Object.assign({}, ratings);

		if (Object.keys(newRatings).includes('parker_val')) {
			delete newRatings['parker_val'];
		}

		Object.keys(newRatings).forEach((key) => {
			newRatings[`rating_${key}_`] = newRatings[key];
			delete newRatings[key];
		});

		return newRatings;
	}

	get wine() {
		const selectedWine = this.props.selectedWine.data;
		const selectedWineError = this.props.selectedWine.error;
		let preparedRatings = null;
		let featuredBG = require('src/assets/images/wine-details-bg.jpg');
		let featuredImage = require('src/assets/images/wine-bottle-default.jpg');

		if (selectedWine && selectedWine.rating) {
			preparedRatings = this.prepareRating(selectedWine.rating);
		}

		if (selectedWine && selectedWine.images && selectedWine.images.length > 0) {
			featuredImage = selectedWine.images[0];
		}

		return (
			<div className="container wine-details">
				<div className="all-wines-btn-wrapper">
					<Link to={routeConstants.WINES} className="btn btn-primary">
						<FaLongArrowLeft className="arrow-icon" />
						All tastings
					</Link>
				</div>
				<Card className="selected-wine-card">
					<div className="featured-image-bg">
						<img src={featuredBG} alt="Wine background" />
					</div>
					<CardImage className="img-fluid featured-image" src={featuredImage} />
					<CardBody>
						{selectedWine && (
							<div>
								<CardTitle>
									{selectedWine.producer}
									<br />
									<span className="wine-name">{selectedWine.name}</span>
									<br />
									{selectedWine.vintage}
								</CardTitle>
								<div className="card-text wine-info">
									<div className="wine-attributes-wrapper clearfix">
										<div className="wine-attributes">
											<span>
												{selectedWine.region ? `${selectedWine.region},` : null}{' '}
												{selectedWine.country ? selectedWine.country : null}
											</span>
											<br />
											<span>{selectedWine.grape ? selectedWine.grape : null}</span>
											<br />
											<span>
												{selectedWine.created_at && selectedWine.created_at.date
													? dateFns.parse(selectedWine.created_at.date).toLocaleDateString()
													: null}
											</span>
											<br />
											<span>
												{selectedWine.price && selectedWine.currency
													? `${selectedWine.price} ${selectedWine.currency}`
													: null}
											</span>
											<br />
										</div>
										<div className="rating-total-wrapper">
											<RatingTotal ratings={preparedRatings} />
										</div>
									</div>
									<hr />

									<div className="comments-sections">
										<div className="wine-summary">
											<h4>Summary</h4>
											<p>
												{selectedWine.summary_wine
													? `${selectedWine.summary_wine}`
													: `No available summary`}
											</p>
										</div>
										<div className="personal-summary">
											<h4>Comment</h4>
											<p>
												{selectedWine.summary_personal
													? `${selectedWine.summary_personal}`
													: `No available comments`}
											</p>
										</div>
									</div>
									<hr />

									<div className="assessment-sections">
										<h4>Assessment</h4>
										<RatingBoard ratings={preparedRatings} showTotal={false} disableRating={true} />
									</div>
								</div>
							</div>
						)}

						{selectedWineError && (
							<div style={{color: 'red'}}>Unable to fetch data from the server</div>
						)}

						{(selectedWine === undefined || selectedWine === null) &&
							selectedWineError === null && <div style={{color: 'red'}}>Data unavailable</div>}
					</CardBody>
				</Card>
			</div>
		);
	}

	render() {
		const wine = this.wine;
		return <div className="my-wines-page">{wine}</div>;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		wine: state.wines.data,
		selectedWine: state.selectedWine,
	};
}

export default connect(
	mapStateToProps,
	{fetchSelectedWine}
)(WineDetails);
