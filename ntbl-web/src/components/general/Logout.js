import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {logoutUser} from 'src/actions/userActions';

class Logout extends Component {
	componentWillMount() {
		this.props.logoutUser();
	}

	render() {
		return <Redirect to="/" />;
	}
}

export default connect(
	null,
	{logoutUser}
)(Logout);
