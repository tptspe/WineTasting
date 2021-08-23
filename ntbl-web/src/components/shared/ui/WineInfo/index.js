import React from 'react';
import PropTypes from 'prop-types';

import sampleWinePlaceholder from './sample-wine-placeholder.jpg';
import './WineInfo.scss';

const addComma = (words) => words.filter((word) => !!word).join(', ');

const WineInfo = ({name, producer, vintage, region, country}) => (
	<div className="WineInfo__Container">
		<img className="WineInfo__Picture" src={sampleWinePlaceholder} alt={name} />
		<h2 className="WineInfo__ProducerName">{producer}</h2>
		<h1 className="WineInfo__NameHeader">{name}</h1>
		<time className="WineInfo__Vintage">{vintage}</time>
		<h3 className="WineInfo__Location">{addComma([region, country])}</h3>
	</div>
);

WineInfo.propTypes = {
	name: PropTypes.string,
	producer: PropTypes.string,
	vintage: PropTypes.number,
	region: PropTypes.string,
	country: PropTypes.string,
};

export default WineInfo;
