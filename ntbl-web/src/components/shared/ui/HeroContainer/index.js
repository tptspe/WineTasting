import React from 'react';
import PropTypes from 'prop-types';
import {MdMenu} from 'react-icons/lib/md';

import './HeroContainer.scss';

const HeroContainer = ({children, handleMenuClick}) => (
	<div className="HeroContainer__Wrapper">
		<header>
			<h1>Tasting Tool</h1>
			<h2>by Noteable</h2>
		</header>
		<div className="HeroContainer__Menu" onClick={handleMenuClick}>
			<MdMenu />
			<span>Menu</span>
		</div>
		<div>{children}</div>
	</div>
);

HeroContainer.propTypes = {
	children: PropTypes.node,
	handleMenuClick: PropTypes.func,
};

export default HeroContainer;
