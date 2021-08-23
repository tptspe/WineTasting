import React, {Component} from 'react';

import './ErrorBoundaryFallback.scss';

export default class ErrorBoundary extends Component {
	reset = () => {
		localStorage.clear();
		window.location.href = '/';
	};

	get errorPage() {
		return (
			<div className="error-boundary-page container">
				<div className="content">
					<h2 className="header-error-boundary">Oops! Something went wrong.</h2>
					<div className="message">
						<p>
							We are very sorry for the inconvenience but an error on the website obstructed your
							action. <br />
							To make sure all data is OK you have been logged out.
						</p>
						<p>
							Please click{' '}
							<button onClick={this.reset} className="home-page-link">
								here
							</button>{' '}
							to login again.
						</p>
						<p>&nbsp;</p>
						<p>
							<i>The error has been logged and will be thurley dealt with.</i>
						</p>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return this.errorPage;
	}
}
