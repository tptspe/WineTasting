import React, {Component} from 'react';
import {connect} from 'react-redux';
import BoxSelectionOption from './BoxSelectionOption';
import l18n from 'src/assets/json/l18n.json';

class BoxSelection extends Component {
	render() {
		const {selection, additionalClasses} = this.props;
		let classes = ['container', 'box-selection'].concat(additionalClasses);

		let options = selection.options.map((option, index) => {
			return (
				<BoxSelectionOption
					key={index}
					option={option}
					selectionKey={selection.key}
					selectionName={selection.selectionName}
					isChecked={option === selection.activeOption}
					nuance={selection.nuance_tint_}
					clarity={selection.clarity_}
					handleOptionSelect={this.props.handleOptionSelect}
				/>
			);
		});

		return (
			<div className={classes.join(' ')}>
				<h2 className="box-selection-title">
					{l18n[selection.key] ? l18n[selection.key] : selection.key}
				</h2>
				<div className="row">{options}</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
	};
}

export default connect(mapStateToProps)(BoxSelection);
