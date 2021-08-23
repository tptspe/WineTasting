import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

class PrivateRoute extends React.Component {
	render() {
		const {user, history, component: Component, ...rest} = this.props;

		if (!user.isLoggedIn) {
			return <Redirect to="/" />;
		}

		return <Route {...rest} render={(props) => user.isLoggedIn && <Component {...props} />} />;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps)(PrivateRoute);
