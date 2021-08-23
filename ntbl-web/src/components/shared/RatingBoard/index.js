import React, {Component} from 'react';

import RatingTotal from './RatingTotal';
import RatingList from './RatingList';

export default class RatingBoard extends Component {
	render() {
		const {ratings, showTotal, disableRating} = this.props;
		let ratingTotal = null;

		if (showTotal) {
			ratingTotal = (
				<div className="rating-total-wrapper">
					<RatingTotal ratings={ratings} />
				</div>
			);
		}

		return (
			<div className="rating-board">
				{ratingTotal}
				<RatingList ratings={ratings} disableRating={disableRating} />
			</div>
		);
	}
}

RatingBoard.defaultProps = {
	showTotal: true,
	disableRating: false,
};
