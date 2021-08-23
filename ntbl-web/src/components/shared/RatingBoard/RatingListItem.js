import React, {Component} from 'react';

import Rating from './Rating/react-rating';

import level3 from 'src/assets/json/tasting/level3.json';
import l18n from 'src/assets/json/l18n.json';

export default class RatingListItem extends Component {
	render() {
		const {ratingName, ratingKey, initialVal, max} = this.props;
		const ratingLabels = level3[ratingName];

		return (
			<li className="rating-item clearfix">
				<div className="rating-name">
					<h4>{l18n[ratingName]}</h4>
				</div>

				<div className="rating-scale">
					<span className="scale-min">{l18n[ratingLabels[0]]}</span>
					<Rating
						className="scale"
						initialRating={initialVal}
						start={-1}
						stop={max}
						quiet={true}
						emptySymbol="dot dot-empty"
						fullSymbol="dot dot-full"
						onChange={(value) => {
							this.props.handleRatingSelect(ratingKey, ratingName, value);
						}}
						readonly={this.props.disableRating}
					/>

					<span className="scale-max">{l18n[ratingLabels[1]]}</span>
				</div>
			</li>
		);
	}
}
