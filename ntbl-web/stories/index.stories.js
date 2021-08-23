import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import Button from 'src/components/shared/ui/Button';
import HeroContainer from '../src/components/shared/ui/HeroContainer';
import StarRating from 'src/components/shared/ui/StarRating';
import TastingTypeCard from 'src/components/shared/ui/TastingTypeCard';
import WineInfo from '../src/components/shared/ui/WineInfo';
import WineTastingCard from '../src/components/shared/ui/WineTastingCard';

storiesOf('Button', module)
	.add('Default Button', () => <Button onHandleClick={action('clicked')}>Hello Button</Button>)
	.add('Disabled Button', () => (
		<Button onHandleClick={action('clicked')} disabled={true}>
			Hello Button
		</Button>
	));

storiesOf('Hero Container', module)
	.add('Empty children', () => <HeroContainer handleMenuClick={action('Menu clicked')} />)
	.add('With sample text', () => (
		<HeroContainer handleMenuClick={action('Menu clicked')}>
			You can display anything inside the hero container here :)
		</HeroContainer>
	));

storiesOf('New Tasting Card', module)
	.add('Profound', () => <TastingTypeCard name="Profound" requiredMinutes="10-15" />)
	.add('Light', () => <TastingTypeCard name="Light" requiredMinutes="5-10" />)
	.add('Nectar', () => <TastingTypeCard name="Nectar" requiredMinutes="2" />);

storiesOf('Star Rating', module)
	.add('Star Rating Default', () => <StarRating onHandleClick={action('Rating selected')} />)
	.add('Star Rating With Value', () => (
		<StarRating
			rating={3}
			onHandleClick={action('Rating selected')}
			onHandleClick={action('Rating selected')}
		/>
	))
	.add('Star Rating Read only', () => (
		<StarRating onHandleClick={action('Rating selected')} readOnly={true} rating={4} />
	));

storiesOf('Wine Info', module).add('Sample info', () => (
	<WineInfo
		name="Palacio de Anglona Tempranillo"
		producer="Hombre"
		vintage={2008}
		region="Rioja"
		country="Spain"
	/>
));

storiesOf('Wine Tasting Card', module).add('Sample info', () => (
	<WineTastingCard
		wine={{
			name: 'Palacio de Anglona Tempranillo',
			producer: 'Hombre',
			vintage: 2008,
			region: 'Rioja',
			country: 'Spain',
		}}
		tasting={{
			score: 91,
			date: '2019-04-21T22:58:35Z',
			location: 'Avedøre, Denmark',
		}}
	/>
));
