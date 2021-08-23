import React, {Component} from 'react';
import {connect} from 'react-redux';
import l18n from 'src/assets/json/l18n.json';

class BoxSelectionOption extends Component {
	render() {
		const {selectionName, selectionKey, option, nuance, clarity, isChecked} = this.props;
		let paletteClasses = ['option-color-pallette', nuance, clarity, option];

		return (
			<div className="col-sm box-selection-option">
				<label className="form-check-label" htmlFor={'id_' + option}>
					{l18n[option] ? l18n[option] : option}
					<br />
					<div className={paletteClasses.join(' ')}> </div>
					<div className="inner">
						<input
							type="radio"
							id={'id_' + option}
							name={selectionName}
							value={option}
							onChange={(e) => this.props.handleOptionSelect(e, selectionKey)}
							checked={isChecked}
						/>
					</div>
				</label>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(mapStateToProps)(BoxSelectionOption);
