import React, {Component} from 'react';
import l18n from 'src/assets/json/l18n.json';

export default class ListSelectionOption extends Component {
	render() {
		const {inputType, option, index, activeSelection, isChecked} = this.props;

		return (
			<li className="list-group-item">
				<label htmlFor={'id-' + option + index} className={'class-' + option}>
					<input
						type={inputType}
						id={'id-' + option + index}
						name={activeSelection.key}
						aria-label="Radio button for following text input"
						value={option}
						onChange={(e) => this.props.handleOptionSelect(e)}
						checked={isChecked}
					/>
					{l18n[option] ? l18n[option] : option}
				</label>
			</li>
		);
	}
}
