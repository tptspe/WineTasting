import React, {Component} from 'react';
import {connect} from 'react-redux';
import l18n from 'src/assets/json/l18n.json';

class ListSelector extends Component {
	render() {
		const {selection, selectedOption, classNames, handleClick} = this.props;

		return (
			<div className={classNames} onClick={() => handleClick(selection.key)}>
				<div className="selected-selection">
					<p>{l18n[selection.key] ? l18n[selection.key] : selection.key}</p>
					<p className={'selected-option ' + (selectedOption ? 'has-option' : '')}>
						{l18n[selectedOption] ? l18n[selectedOption] : selectedOption}
					</p>
				</div>
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

export default connect(mapStateToProps)(ListSelector);
