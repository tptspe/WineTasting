import React from 'react';
import PropTypes from 'prop-types';
import {format} from 'date-fns';

import WineInfo from '../WineInfo';
import './WineTastingCard.scss';

const formatDate = (date) => format(date, 'DD.M.YYYY');

const WineTastingCard = ({
	wine: {name, producer, vintage, region, country} = {},
	tasting: {score, date, location} = {},
}) => (
	<div className="WineTastingCard__Container">
		<WineInfo name={name} producer={producer} vintage={vintage} region={region} country={country} />
		<div className="WineTastingCard__Score">
			<div className="WineTastingCard__ScoreLabel">
				<strong>Nectar Score</strong>
				<br />
				100 point scale
			</div>
			<div className="WineTastingCard__ScoreIcon">
				<div className="hexagon">
					<div className="value">{score}</div>
				</div>
			</div>
		</div>
		<div className="WineTastingCard__Footer">
			<time dateTime={date}>Tasting date: {formatDate(date)}</time>
			<br />
			<span>Location: {location}</span>
		</div>
	</div>
);

WineTastingCard.propTypes = {
	wine: PropTypes.shape({
		name: PropTypes.string.isRequired,
		producer: PropTypes.string.isRequired,
		vintage: PropTypes.number.isRequired,
		region: PropTypes.string.isRequired,
		country: PropTypes.string.isRequired,
	}),
	tasting: PropTypes.shape({
		score: PropTypes.number,
		date: PropTypes.string,
		location: PropTypes.string,
	}),
};

export default WineTastingCard;
