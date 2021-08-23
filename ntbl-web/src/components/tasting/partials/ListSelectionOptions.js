import React, {Component} from 'react';
import ListSelectionOption from './ListSelectionOption';

export default class ListSelectionOptions extends Component {
	render() {
		const {activeSelection, multiple} = this.props;
		let inputType = 'radio';

		if (multiple) inputType = 'checkbox';

		const activeSelectionOptions =
			activeSelection &&
			activeSelection.options.map((option, index) => {
				// Skip option if in hiddenOptions
				if (activeSelection.hiddenOptions && activeSelection.hiddenOptions.includes(option)) {
					return null;
				}

				let isChecked = false;

				if (multiple) {
					if (activeSelection.activeOption && activeSelection.activeOption.includes(option)) {
						isChecked = true;
					}
				} else {
					if (activeSelection.activeOption && activeSelection.activeOption === option) {
						isChecked = true;
					}
				}

				return (
					<ListSelectionOption
						key={index}
						inputType={inputType}
						option={option}
						index={index}
						activeSelection={activeSelection}
						isChecked={isChecked}
						handleOptionSelect={this.props.handleOptionSelect}
					/>
				);
			});

		return <ul className="list-group list-options">{activeSelectionOptions}</ul>;
	}
}
