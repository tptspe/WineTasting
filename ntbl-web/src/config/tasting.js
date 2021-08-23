// Profound imports
import profound from 'src/assets/json/tasting/level3.json';
import p_appearance from 'src/assets/json/tasting/profound/appearance.json';
import p_nose from 'src/assets/json/tasting/profound/nose.json';
import p_palate from 'src/assets/json/tasting/profound/palate.json';

// Light imports
import light from 'src/assets/json/tasting/light.json';
import l_appearance from 'src/assets/json/tasting/light/appearance.json';
import l_nose from 'src/assets/json/tasting/light/nose.json';
import l_palate from 'src/assets/json/tasting/light/palate.json';

const tasting = {
	data: {
		profound: {
			appearance: p_appearance,
			nose: p_nose,
			palate: p_palate,
		},
		light: {
			appearance: l_appearance,
			nose: l_nose,
			palate: l_palate,
		},
		nectar: {
			appearance: p_appearance,
			nose: p_nose,
			palate: p_palate,
		},
	},
	source: {
		profound: profound,
		light: light,
		nectar: profound,
	},
};

export default tasting;
