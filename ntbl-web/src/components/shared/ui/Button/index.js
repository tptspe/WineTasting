import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const Button = ({onHandleClick, children, disabled}) => (
	<button className="Button__Default" onClick={onHandleClick} disabled={disabled}>
		{children}
	</button>
);

Button.propTypes = {
	disabled: PropTypes.bool,
	onHandleClick: PropTypes.func,
	children: PropTypes.node.isRequired,
};

export default Button;
