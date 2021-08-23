import React from 'react';
import {cleanup, render} from 'react-testing-library';

import WineInfo from './index';

const createProps = ({name, producer, vintage, region, country}) => ({
	name,
	producer,
	vintage,
	region,
	country,
});

describe('WineInfo', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<WineInfo />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render sample info', () => {
		const props = createProps({
			name: 'Palacio de Anglona Tempranillo',
			producer: 'Hombre',
			vintage: 2008,
			region: 'Rioja',
			country: 'Spain',
		});
		const {getByText} = render(<WineInfo {...props} />);
		expect(getByText('Palacio de Anglona Tempranillo')).toBeTruthy();
		expect(getByText('Hombre')).toBeTruthy();
		expect(getByText('2008')).toBeTruthy();
		expect(getByText('Rioja, Spain')).toBeTruthy();
	});
});
