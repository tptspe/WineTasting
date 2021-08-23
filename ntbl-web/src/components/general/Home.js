import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {routeConstants} from '../../constants';

class Home extends Component {
	render() {
		return (
			<div className="home-page">
				<h1>Home</h1>
				<ul>
					<li>
						<Link to={routeConstants.WINES}>My Wines</Link>
					</li>
					<li>
						<Link to={routeConstants.TASTING}>Tasting</Link>
					</li>
					<li>
						<Link to={routeConstants.SETTINGS}>Settings</Link>
					</li>
				</ul>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps)(Home);
