import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {setTastingType} from 'src/actions/multiStepFormActions';
import {routeConstants} from 'src/constants';

import './SelectTasting.scss';

class SelectTasting extends Component {
	render() {
		return (
			<div className="select-tasting-page container">
				<div className="row">
					<div className="col">
						<Link
							to={`${routeConstants.NEW_TASTING}/nectar`}
							onClick={(e) => this.props.setTastingType('profound')}
							className="btn"
						>
							Nectar
						</Link>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Link
							to={`${routeConstants.NEW_TASTING}/light`}
							onClick={(e) => this.props.setTastingType('profound')}
							className="btn"
						>
							Light
						</Link>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Link
							to={`${routeConstants.NEW_TASTING}/profound`}
							onClick={(e) => this.props.setTastingType('profound')}
							className="btn"
						>
							Profound
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	null,
	{setTastingType}
)(SelectTasting);
