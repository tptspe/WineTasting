import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateSelectedItem} from 'src/actions/multiStepFormActions';
import {RatingBoard} from 'src/components/shared';

import rating from 'src/assets/json/tasting/rating.json';

class RatingStep extends Component {
	constructor(props) {
		super(props);
		this.initSelectedRatings = this.initSelectedRatings.bind(this);

		// Initialize selected ratings only when it's not yet initialized
		if (props.multiStepForm.selectedItems.rating === undefined) {
			this.initSelectedRatings();
		}
	}

	// Populate and set default values to selectedRatings based on the default initial value
	initSelectedRatings() {
		const {multiStepForm} = this.props;
		let ratingKey = rating.keys[0];
		let newSelectedRatings = {};
		let tastingSrc = multiStepForm.tastingSrc || [];

		// Set the default value for all rating fields
		tastingSrc[ratingKey] &&
			tastingSrc[ratingKey].forEach((ratingName, index) => {
				newSelectedRatings[ratingName] = 0.45; // Set the default to 0.5 for all rating fields
			});

		// Update reduxStore
		this.props.updateSelectedItem('rating', newSelectedRatings);
		return newSelectedRatings;
	}

	getSelectedRatings() {
		const selectedRatings = this.props.multiStepForm.selectedItems.rating
			? this.props.multiStepForm.selectedItems.rating
			: {};
		return selectedRatings;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.multiStepForm.selectedItems.rating === undefined) {
			this.initSelectedRatings();
			return false;
		}
		return true;
	}

	render() {
		return (
			<div className="step-container rating-step">
				<div className="container">
					<h5 className="sub-header">100 Points scale</h5>
					<RatingBoard ratings={this.getSelectedRatings()} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{updateSelectedItem}
)(RatingStep);
