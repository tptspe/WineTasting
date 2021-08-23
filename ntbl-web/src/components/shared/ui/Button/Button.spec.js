import React from 'react';
import {cleanup, fireEvent, render} from 'react-testing-library';

import Button from './index';

const createProps = ({children, onHandleClick, disabled} = {}) => ({
	disabled,
	children,
	onHandleClick,
});

describe('Button componenet', () => {
	afterEach(cleanup);

	it('Button should render wihtout crashing', () => {
		const children = <div>Button</div>;
		const props = createProps({children});

		const {container} = render(<Button {...props} />);

		expect(container.firstChild).toBeTruthy();
	});

	it('Event should be fired on clicked', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const props = createProps({children, onHandleClick});

		const {container} = render(<Button {...props} />);

		expect(onHandleClick).not.toHaveBeenCalled();

		fireEvent.click(container.firstChild);

		expect(onHandleClick).toHaveBeenCalledTimes(1);
	});

	it('Button should be disabled', () => {
		const children = <div>Button</div>;
		const onHandleClick = jest.fn();
		const disabled = true;
		const props = createProps({children, onHandleClick, disabled});

		const {container} = render(<Button {...props} />);
		expect(container.firstChild.disabled).toBeTruthy();

		fireEvent.click(container.firstChild);
		expect(onHandleClick).not.toHaveBeenCalled();
	});
});
