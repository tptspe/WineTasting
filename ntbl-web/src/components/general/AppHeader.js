import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MdMenu} from 'react-icons/lib/md';

import {openSideNav} from 'src/actions/appActions';
import {routeConstants} from 'src/constants';

import './AppHeader.scss';

const OFFLINE_RESET_TIME = 180000;

class AppHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse: false,
			isOfflineClosed: false,
			isWideEnough: false,
			fadeNav: false,
			showNewTastingBtn: false,
		};
		this.onClick = this.onClick.bind(this);
	}

	onCloseOfflineMsg = () => {
		this.setState({isOfflineClosed: true});

		// Reminder: Show the offline notifier after 3 minutes.
		setTimeout(() => {
			console.log('here');
			this.setState({
				isOfflineClosed: false,
			});
		}, OFFLINE_RESET_TIME);
	};

	onClick() {
		this.setState({
			collapse: !this.state.collapse,
		});
	}

	handleClick(e) {
		e.preventDefault();
		this.props.openSideNav();
	}

	componentDidUpdate() {
		const {currentRoute} = this.props;

		if (currentRoute === routeConstants.NEW_TASTING && this.state.fadeNav === false) {
			this.setState({
				fadeNav: true,
			});
		}

		if (currentRoute !== routeConstants.NEW_TASTING && this.state.fadeNav === true) {
			this.setState({
				fadeNav: false,
			});
		}
	}

	render() {
		const {isOfflineClosed} = this.state;
		const {online, outbox} = this.props.connectionStatus;
		const showOffineMessage = !online && !isOfflineClosed;

		return (
			<div className="app-header">
				{showOffineMessage && (
					<div className="offline-title">
						Oh, you are offline! Don't worry, you can keep doing most things anyway.
						<button className="btn" onClick={this.onCloseOfflineMsg}>
							Ok, got it
						</button>
					</div>
				)}
				{online && !!outbox.length && <h4>Syncing....</h4>}
				<div className="toggle-menu-btn">
					<MdMenu
						onClick={(e) => {
							this.handleClick(e);
						}}
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		connectionStatus: state.offline,
	};
}

export default connect(
	mapStateToProps,
	{openSideNav}
)(AppHeader);
