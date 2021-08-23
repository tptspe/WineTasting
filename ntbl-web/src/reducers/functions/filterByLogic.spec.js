import filterByLogic from './filterByLogic';

// mock the logic config because we only want to test the filter logic here
// changes to the configuration shouldn't affect these unit tests
jest.mock('src/assets/json/tasting/logic.json', () => ({
	// tomato leaf should be displayed to all wine colours but white
	note_tomato_leaf: {
		notif: ['color_white_'],
	},
	// whitish leaf should be displayed only to white wine
	note_whitish_leaf: {
		onlyif: ['color_white_'],
	},
}));

const setup = ({color_}) => ({
	step: 'nose',
	data: {
		selections: [
			{
				key: 'herbaceous_',
				options: ['note_grass', 'note_tomato_leaf', 'note_whitish_leaf'],
				hiddenOptions: [],
			},
		],
		activeSelection: {
			key: 'herbaceous_',
			options: ['note_grass', 'note_tomato_leaf', 'note_whitish_leaf'],
			hiddenOptions: [],
		},
	},
	selectedItems: {
		appearance: {
			color_,
		},
		nose: {},
	},
});

describe('filterByLogic', () => {
	describe('notif logic', () => {
		it('Should hide tomato leaf from white wine', () => {
			const {step, data, selectedItems} = setup({color_: 'color_white_'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('herbaceous_');
			expect(firstSelection.hiddenOptions).toContain('note_tomato_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('herbaceous_');
			expect(activeSelection.hiddenOptions).toContain('note_tomato_leaf');
		});

		it('Should display tomato leaf to rosé wine', () => {
			const {step, data, selectedItems} = setup({color_: 'color_rose_'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('herbaceous_');
			expect(firstSelection.hiddenOptions).not.toContain('note_tomato_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('herbaceous_');
			expect(activeSelection.hiddenOptions).not.toContain('note_tomato_leaf');
		});
	});

	describe('onlyif logic', () => {
		it('Should hide whitish leaf from rosé wine', () => {
			const {step, data, selectedItems} = setup({color_: 'color_rose_'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('herbaceous_');
			expect(firstSelection.hiddenOptions).toContain('note_whitish_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('herbaceous_');
			expect(activeSelection.hiddenOptions).toContain('note_whitish_leaf');
		});

		it('Should display whitish leaf to white wine', () => {
			const {step, data, selectedItems} = setup({color_: 'color_white_'});
			filterByLogic(step, data, selectedItems);

			const [firstSelection] = data.selections;
			expect(firstSelection.key).toBe('herbaceous_');
			expect(firstSelection.hiddenOptions).not.toContain('note_whitish_leaf');

			const {activeSelection} = data;
			expect(activeSelection.key).toBe('herbaceous_');
			expect(activeSelection.hiddenOptions).not.toContain('note_whitish_leaf');
		});
	});
});
