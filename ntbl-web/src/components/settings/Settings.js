import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Collapse} from 'mdbreact';
import FaMinus from 'react-icons/lib/fa/minus';
import FaPlus from 'react-icons/lib/fa/plus';

import {md5} from 'src/commons/commons';
import AdvancedOption from './partials/AdvancedOption';

import './Settings.scss';

class Settings extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);

		this.state = {
			collapse: false,
		};
	}

	toggle() {
		this.setState({collapse: !this.state.collapse});
	}

	render() {
		const {email} = this.props.user.userData;
		let gravatarUrl = '';

		if (email) {
			gravatarUrl = `https://www.gravatar.com/avatar/${md5(email)}?s=150`;
		}

		return (
			<div className="settings-page container">
				<h1 className="page-header">Settings</h1>
				<h4 className="collapse-header" id="settings-advanced" onClick={this.toggle}>
					Advanced
					{this.state.collapse ? (
						<FaMinus className="collapse-trigger" />
					) : (
						<FaPlus className="collapse-trigger" />
					)}
				</h4>

				{email && (
					<div className="logged-in-user-info">
						<span className="ugravatar">
							{gravatarUrl && <img src={gravatarUrl} alt="gravatar" />}
						</span>
						<span className="uemail">{email}</span>
					</div>
				)}

				<Collapse isOpen={this.state.collapse}>
					<AdvancedOption />
				</Collapse>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		user: state.user,
	};
}

export default connect(mapStateToProps)(Settings);
