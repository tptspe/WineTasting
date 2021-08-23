import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './NotFound.scss';

export default class NotFound extends Component {
	render() {
		return (
			<div className="not-found-page container">
				<div className="content">
					<h2 className="header-not-found">Page Not Found</h2>
					<div className="message">
						<p>
							We are sorry but the page you are looking for doesn't exist or is no longer available.
						</p>
						<p>
							Please click{' '}
							<Link to="/" className="home-page-link">
								here
							</Link>{' '}
							to go back to our home page.
						</p>
					</div>
					<h1 className="header-404">404</h1>
				</div>
			</div>
		);
	}
}
