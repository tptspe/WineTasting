import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateSelectedItem} from 'src/actions/multiStepFormActions';
import {ratingConstants} from 'src/constants';
import RatingListItem from './RatingListItem';

import rating from 'src/assets/json/tasting/rating.json';
import level3 from 'src/assets/json/tasting/level3.json';

class RatingList extends Component {
	constructor(props) {
		super(props);
		this.handleRatingSelect = this.handleRatingSelect.bind(this);
		this.getFinalValue = this.getFinalValue.bind(this);
	}

	// Get the equivalent of value (between 0 - 1), given that this.props.max is equal to 1
	getFinalValue(value) {
		let percentageValue = 100 / (this.props.max / value);
		let finalValue = percentageValue / 100;
		return finalValue;
	}

	getOriginalValue(finalValue) {
		let rawValue = finalValue * 100;
		let originalValue = (rawValue * this.props.max) / 100;
		return originalValue;
	}

	handleRatingSelect(ratingKey, ratingName, value) {
		// update redux store
		this.props.updateSelectedItem('rating', {[ratingName]: this.getFinalValue(value)});
	}

	getRatingItems() {
		let ratingKey = rating.keys[0];

		const ratingItems = level3[ratingKey].map((ratingName, index) => {
			const ratings = this.props.ratings;
			let initialVal = this.props.initial;

			if (ratings && ratings[ratingName] != null) {
				initialVal = this.getOriginalValue(ratings[ratingName]);
			}

			return (
				<RatingListItem
					key={index}
					ratingName={ratingName}
					ratingKey={ratingKey}
					initialVal={initialVal}
					max={this.props.max}
					handleRatingSelect={this.handleRatingSelect}
					disableRating={this.props.disableRating}
				/>
			);
		});

		return ratingItems;
	}

	render() {
		return <ul className="rating-list">{this.getRatingItems()}</ul>;
	}
}

RatingList.defaultProps = {
	initial: ratingConstants.INITIAL,
	max: ratingConstants.MAX,
};

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{updateSelectedItem}
)(RatingList);
