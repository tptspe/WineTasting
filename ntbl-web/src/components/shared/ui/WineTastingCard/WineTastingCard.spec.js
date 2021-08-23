import React from 'react';
import {cleanup, render} from 'react-testing-library';

import WineTastingCard from './index';

const createProps = ({wine, tasting}) => ({
	wine,
	tasting,
});

describe('WineTastingCard', () => {
	afterEach(cleanup);

	it('Should render without crashing', () => {
		const {container} = render(<WineTastingCard />);
		expect(container.firstChild).toBeTruthy();
	});

	it('Should render sample info', () => {
		const props = createProps({
			wine: {
				name: 'Palacio de Anglona Tempranillo',
				producer: 'Hombre',
				vintage: 2008,
				region: 'Rioja',
				country: 'Spain',
			},
			tasting: {
				score: 91,
				date: '2019-04-21T23:42:50Z',
				location: 'Avedøre, Denmark',
			},
		});
		const {getByText} = render(<WineTastingCard {...props} />);
		expect(getByText('Palacio de Anglona Tempranillo')).toBeTruthy();
		expect(getByText('Hombre')).toBeTruthy();
		expect(getByText('2008')).toBeTruthy();
		expect(getByText('Rioja, Spain')).toBeTruthy();
		expect(getByText('91')).toBeTruthy();
		expect(getByText('Tasting date: 21.4.2019')).toBeTruthy();
		expect(getByText('Location: Avedøre, Denmark'));
	});
});
