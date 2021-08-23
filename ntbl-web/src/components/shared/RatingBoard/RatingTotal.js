import React, {Component} from 'react';

import {ratingConstants} from 'src/constants';
import {getTotalRatingPoints} from 'src/commons/commons';

import './RatingTotal.scss';

export default class RatingTotal extends Component {
	render() {
		const label = this.props.showLabel ? <p className="rp-label">points</p> : null;
		const totalPoints =
			this.props.ratings.parker_val && this.props.ratings.parker_val >= ratingConstants.BASE_POINTS
				? this.props.ratings.parker_val
				: getTotalRatingPoints(this.props.ratings);

		return (
			<div className="rating-total">
				<h2 className="rp-digits">{totalPoints}</h2>
				{label}
			</div>
		);
	}
}

RatingTotal.defaultProps = {
	showLabel: true,
	basePoints: ratingConstants.BASE_POINTS,
	max: ratingConstants.MAX,
};
