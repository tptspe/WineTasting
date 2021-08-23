import React, {Component} from 'react';

export default class WinesFilterToggle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};

		this.toggleFilter = this.toggleFilter.bind(this);
	}

	toggleFilter(event) {
		let isOpen = !this.state.isOpen;

		this.setState({
			isOpen: isOpen,
		});

		this.props.toggleFilterCallback(isOpen);
	}

	render() {
		return (
			<div className="filter-toggle">
				<div
					className={'toggler ' + (this.props.isFilterOpen ? 'open' : 'close')}
					onClick={this.toggleFilter}
				/>
			</div>
		);
	}
}

WinesFilterToggle.defaultProps = {
	isFilterOpen: false,
};
