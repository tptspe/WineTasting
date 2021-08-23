import React from 'react';
import {cleanup, fireEvent, render} from 'react-testing-library';

import CheckBox from './CheckBox';

const createProps = ({isChecked, onChangeCallback} = {}) => ({
	itemKey: 'html-input-key',
	label: 'Fixture',
	isChecked,
	onChangeCallback,
});

describe('CheckBox', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<CheckBox />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should find label', () => {
		const props = createProps();
		const {getByText} = render(<CheckBox {...props} />);
		expect(getByText('Fixture')).toBeTruthy();
	});

	it('Should be unchecked by default', () => {
		const props = createProps();
		const {getByLabelText} = render(<CheckBox {...props} />);

		const checkbox = getByLabelText('Fixture');
		expect(checkbox.checked).toBe(false);
	});

	it('Should check the checkbox', () => {
		const isChecked = false;
		const onChangeCallback = jest.fn();
		const props = createProps({isChecked, onChangeCallback});
		const {getByLabelText} = render(<CheckBox {...props} />);

		expect(onChangeCallback).not.toHaveBeenCalled();

		const checkbox = getByLabelText('Fixture');
		expect(checkbox.checked).toBe(false);

		fireEvent.click(checkbox);
		expect(onChangeCallback).toHaveBeenCalledTimes(1);
		expect(onChangeCallback).toHaveBeenCalledWith('html-input-key', true);
	});

	it('Should uncheck the checkbox', () => {
		const isChecked = true;
		const onChangeCallback = jest.fn();
		const props = createProps({isChecked, onChangeCallback});
		const {getByLabelText} = render(<CheckBox {...props} />);

		expect(onChangeCallback).not.toHaveBeenCalled();

		const checkbox = getByLabelText('Fixture');
		expect(checkbox.checked).toBe(true);

		fireEvent.click(checkbox);
		expect(onChangeCallback).toHaveBeenCalledTimes(1);
		expect(onChangeCallback).toHaveBeenCalledWith('html-input-key', false);
	});
});
