import React, {Component} from 'react';
import {connect} from 'react-redux';
import ListSelectors from './ListSelectors';
import ListSelectionOptions from './ListSelectionOptions';
import {updateStepSelections, removeSelectedItem} from 'src/actions/multiStepFormActions';

// styles
import './ListSelection.scss';

class ListSelection extends Component {
	constructor(props) {
		super(props);
		this.handleSelectionSelect = this.handleSelectionSelect.bind(this);
		this.handleOptionSelect = this.handleOptionSelect.bind(this);
		this.setNextSelection = this.setNextSelection.bind(this);
	}

	getSelections(propData, multiple = false) {
		let activeSelection = null;
		let data = Object.assign({}, propData);

		const selections = Object.keys(data).map((selection, index) => {
			// Add selection as key to data for tracking
			data[selection].key = selection;
			data[selection].activeOption = null;

			if (multiple) {
				data[selection].activeOption = [];
			}

			if (index === 0) {
				data[selection].isActive = true;
				activeSelection = data[selection];
			}

			return data[selection];
		});

		return {
			selections,
			activeSelection,
		};
	}

	handleSelectionSelect(selectionKey) {
		const {selections, activeSelection} = this.props.data;
		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false

		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);
			tempSelection.isActive = false;

			if (tempSelection.key === selectionKey) {
				tempSelection.isActive = true;
				newActiveSelection = {...tempSelection};
			}
		});

		this.props.updateStepSelections(
			this.props.step,
			{
				selections: newSelections,
				activeSelection: newActiveSelection,
			},
			this.props.isSubStep,
			this.props.name
		);
	}

	setNextSelection(currentIndex) {
		let {activeSelection, selections} = this.props.data;
		let nextIndex = currentIndex + 1;
		let nextSelection = selections[nextIndex];

		if (nextSelection) {
			if (nextSelection.hideSelection) {
				nextSelection = this.setNextSelection(nextIndex);
			} else {
				activeSelection.isActive = false;
				nextSelection.isActive = true;
			}
		} else {
			activeSelection.isActive = true;
		}

		return nextSelection;
	}

	handleOptionSelect(event) {
		let {activeSelection, selections} = this.props.data;

		const {multiple} = this.props;
		const target = event.target;
		const value = target.value;
		let nextSelection = null;

		if (multiple) {
			if (activeSelection.activeOption === undefined || activeSelection.activeOption == null)
				activeSelection.activeOption = [];

			if (!activeSelection.activeOption.includes(value)) {
				activeSelection.activeOption.push(value);
			} else {
				activeSelection.activeOption.splice(activeSelection.activeOption.indexOf(value), 1);
			}

			selections.forEach((selection, currentIndex) => {
				if (selection.key === activeSelection.key) {
					selection.activeOption = activeSelection.activeOption;
				}
			});
		} else {
			activeSelection.activeOption = value;

			// Deactivate current selection and activate the next available selections (Only works for single selections)
			selections.forEach((selection, currentIndex) => {
				if (selection.key === activeSelection.key) {
					selection.activeOption = activeSelection.activeOption;
					nextSelection = this.setNextSelection(currentIndex);
				}
			});
		}

		// If nextSelection is set, make it the activeSelection
		if (nextSelection) {
			activeSelection = nextSelection;
		}

		this.props.updateStepSelections(
			this.props.step,
			{selections, activeSelection},
			this.props.isSubStep,
			this.props.name
		);
	}

	render() {
		const {multiple} = this.props;
		const {selections, activeSelection} = this.props.data;

		let content = 'no data available';

		if (selections && selections.length > 0) {
			content = (
				<div>
					<ListSelectors
						multiple={multiple}
						selections={selections}
						handleSelectionSelect={this.handleSelectionSelect}
					/>
					<ListSelectionOptions
						multiple={multiple}
						activeSelection={activeSelection}
						handleOptionSelect={this.handleOptionSelect}
					/>
				</div>
			);
		}

		return <div className="container radio-list-selection">{content}</div>;
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
	{updateStepSelections, removeSelectedItem}
)(ListSelection);
