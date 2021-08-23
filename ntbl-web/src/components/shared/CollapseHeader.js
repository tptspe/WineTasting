import React, {Component} from 'react';
import FaMinus from 'react-icons/lib/fa/minus';
import FaPlus from 'react-icons/lib/fa/plus';

export default class CollapseHeader extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
	}

	toggle(sortBy) {
		this.props.toggleCollapseCallback();
	}

	render() {
		return (
			<h4 className="collapse-header" onClick={this.toggle}>
				{this.props.title}
				{this.props.isOpen ? (
					<FaMinus className="collapse-trigger" />
				) : (
					<FaPlus className="collapse-trigger" />
				)}
			</h4>
		);
	}
}

CollapseHeader.defaultProps = {
	title: 'The title',
	isOpen: false,
};
