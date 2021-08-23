import React, {Component} from 'react';
import {connect} from 'react-redux';
import BoxSelection from './BoxSelection';
import {updateStepSelections} from 'src/actions/multiStepFormActions';

// styles
import './BoxSelectionGroup.scss';

class BoxSelectionGroup extends Component {
	constructor(props) {
		super(props);
		this.handleOptionSelect = this.handleOptionSelect.bind(this);
	}

	handleOptionSelect(event, selectionKey) {
		const {multiStepForm} = this.props;
		const {tastingType} = this.props.multiStepForm;
		const {selections, activeSelection} = this.props.data;
		const target = event.target;
		const value = target.value;
		let tastingSrc = multiStepForm.tastingSrc;

		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false

		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);

			if (tempSelection.key === selectionKey) {
				tempSelection.isActive = true;
				tempSelection.activeOption = value;
				newActiveSelection = tempSelection;
			}
		});

		/*
      todo: figure out and implement a way to decouple the switch logic below
    */

		// Add logic for showing and hiding box selections
		switch (selectionKey) {
			case 'color_':
				newSelections.forEach((newSelection, index) => {
					// Reset nuance
					if (newSelection.key === 'nuance_tint_') {
						newSelection.hideSelection = false;
						newSelection.activeOption = null;
						newSelection.options = tastingSrc[newActiveSelection.activeOption];
						newSelection.nuance_tint_ = newActiveSelection.activeOption;
					}

					// Clear clarity and appearance
					if (newSelection.key === 'clarity_' || newSelection.key === 'appearanceintensity_') {
						newSelection.hideSelection = true;
						newSelection.activeOption = null;
						delete newSelection.nuance_tint_;
						delete newSelection.clarity_;
					}
				});
				break;
			case 'nuance_tint_':
				if (tastingType !== 'light') {
					newSelections.forEach((newSelection, index) => {
						// show clarity
						if (newSelection.key === 'clarity_') {
							newSelection.hideSelection = false;
							newSelection.activeOption = null;
							newSelection.nuance_tint_ = newActiveSelection.activeOption;
						}

						// Clear appearance
						if (newSelection.key === 'appearanceintensity_') {
							newSelection.hideSelection = true;
							newSelection.activeOption = null;
							delete newSelection.nuance_tint_;
							delete newSelection.clarity_;
						}
					});
					break;
				} else {
					let nuance_tint_ = {};

					newSelections.forEach((newSelection, index) => {
						if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

						// show clarity
						if (newSelection.key === 'appearanceintensity_') {
							newSelection.hideSelection = false;
							newSelection.nuance_tint_ = nuance_tint_.activeOption;
							newSelection.clarity_ = newActiveSelection.activeOption;
						}
					});
					break;
				}
			case 'clarity_':
				let nuance_tint_ = {};

				newSelections.forEach((newSelection, index) => {
					if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

					// show clarity
					if (newSelection.key === 'appearanceintensity_') {
						newSelection.hideSelection = false;
						newSelection.nuance_tint_ = nuance_tint_.activeOption;
						newSelection.clarity_ = newActiveSelection.activeOption;
					}
				});
				break;
			default:
			// do nothing
		}

		this.props.updateStepSelections(this.props.step, {
			selections: newSelections,
			activeSelection: newActiveSelection,
		});
	}

	componentDidUpdate() {
		this.scrollEndPoint.scrollIntoView({
			behavior: 'smooth',
		});
	}

	render() {
		const {selections, activeSelection} = this.props.data;
		let boxSelections = 'no data available';

		if (selections && selections.length > 0) {
			boxSelections = selections.map((selection, index) => {
				let selectionClasses = [];

				if (selection.hideSelection) {
					selectionClasses.push('hidden');
				}

				return (
					<div key={index} ref={(node) => (this[selection.key] = node)}>
						<BoxSelection
							selection={selection}
							activeSelection={activeSelection}
							handleOptionSelect={this.handleOptionSelect}
							additionalClasses={selectionClasses}
						/>
					</div>
				);
			});
		}

		return (
			<div className="container">
				<div className="box-selection-wrapper">{boxSelections}</div>
				<div
					className="scroll-end-point"
					ref={(el) => {
						this.scrollEndPoint = el;
					}}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{updateStepSelections}
)(BoxSelectionGroup);
