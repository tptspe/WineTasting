import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'mdbreact';

import {closeSideNav, setOffCanvas} from 'src/actions/appActions';
import {routeConstants} from 'src/constants';

import './SideNav.scss';

class SideNav extends Component {
	closeNav(e) {
		e.preventDefault();
		this.props.closeSideNav();
	}

	componentDidUpdate() {
		const {offCanvas, app} = this.props;
		let offCanvasClass = '';

		if (offCanvas) {
			offCanvasClass = 'off-canvas';
			// this.props.setOffCanvas(true, offCanvasClass);
			this.props.handleNavOffSet(true, offCanvasClass, app.isSideNavOpen);
		}
	}

	render() {
		const {app, user, offCanvas} = this.props;
		let sideNavStatus = 'nav-close';
		let offCanvasClass = '';
		let navBar = null;
		let sideNavOverlayClassnames = ['side-nav-bg-overlay'];

		if (app.isSideNavOpen) {
			sideNavStatus = 'nav-open';
			sideNavOverlayClassnames.push('visible');
		} else {
			sideNavStatus = 'nav-close';
		}

		if (offCanvas) {
			offCanvasClass = 'off-canvas';
		}

		if (user.isLoggedIn) {
			navBar = (
				<div>
					<NavLink
						to={routeConstants.NEW_TASTING}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						New Tasting
					</NavLink>

					<NavLink
						to={routeConstants.WINES}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						My Tastings
					</NavLink>

					<NavLink
						to={routeConstants.MY_CLUBS}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Clubs
					</NavLink>

					<NavLink
						to={routeConstants.MY_EVENTS}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Events
					</NavLink>

					<hr />

					<NavLink
						to={routeConstants.SETTINGS}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Settings
					</NavLink>

					<NavLink
						to={routeConstants.LOGOUT}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Logout
					</NavLink>
				</div>
			);
		} else {
			navBar = (
				<div>
					<NavLink
						to={routeConstants.SETTINGS}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Settings
					</NavLink>
					<NavLink
						to={routeConstants.HOME}
						onClick={(e) => {
							this.props.closeSideNav();
						}}
					>
						Login
					</NavLink>
				</div>
			);
		}

		return (
			<div className="side-nav-wrapper">
				<div
					id="AppSideNav"
					className={['side-nav', sideNavStatus, offCanvasClass].join(' ')}
					onClick={this.handleClick}
				>
					<a
						href="/"
						className="closebtn"
						onClick={(e) => {
							this.closeNav(e);
						}}
					>
						&times;
					</a>
					{navBar}
				</div>
				<div
					className={sideNavOverlayClassnames.join(' ')}
					onClick={(e) => {
						this.closeNav(e);
					}}
				/>
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

export default connect(
	mapStateToProps,
	{closeSideNav, setOffCanvas}
)(SideNav);
