import React, {Component} from 'react';
import {connect} from 'react-redux';
import WinesFilterToggle from './WinesFilterToggle';

// styles
import './WinesControls.scss';

class WinesControls extends Component {
	render() {
		return (
			<div className="wines-controls-wrapper clearfix">
				<WinesFilterToggle
					toggleFilterCallback={this.props.toggleFilterCallback}
					isFilterOpen={this.props.isFilterOpen}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		wines: state.wines,
	};
}

export default connect(mapStateToProps)(WinesControls);
