import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {
	updateSelectedItem,
	initStepData,
	initEventTasting,
	updateStepSelections,
	resetForm,
	navigateAway,
	restartSession,
	restoreSession,
	setTastingType,
} from 'src/actions/multiStepFormActions';
import tasting from 'src/config/tasting';
import {PromptModal} from 'src/components/shared';
import {Light, Nectar, Profound} from 'src/components/tasting/types';

import 'src/assets/scss/shared/make-tasting-page.scss';

let unlisten = null;

class EventTasting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			prompt: false,
		};
		this.initEventTastingData = this.initEventTastingData.bind(this);
		this.prefillSelectedNotes = this.prefillSelectedNotes.bind(this);
		this.prefillAppearanceNotes = this.prefillAppearanceNotes.bind(this);
		this.initAppearance = this.initAppearance.bind(this);
		this.prefillRatingStep = this.prefillRatingStep.bind(this);
		this.prefillCommentStep = this.prefillCommentStep.bind(this);
		this.prefillInfoStep = this.prefillInfoStep.bind(this);
		props.setTastingType(this.props.tastingShowCaseData.type);

		const {multiStepForm} = props;
		const prevSession = multiStepForm.lastSessionData[this.props.tastingShowCaseData.type];

		if (
			this.props.tastingShowCaseData.type !== multiStepForm.tastingType ||
			(!multiStepForm.navigatedAway && (prevSession === null || prevSession === undefined))
		) {
			this.initEventTastingData();
		}
	}

	initEventTastingData() {
		let selectedTasting = this.props.tastingShowCaseData.selectedTasting;
		console.log(this.props, 'CONSTRUCTOR PROPS');
		/*
            Disable pre-filling of selected notes: 
                this.prefillSelectedNotes(selectedTasting.notes); 
                this.prefillRatingStep(selectedTasting.rating);
                this.prefillCommentStep(selectedTasting);
        */
		this.prefillInfoStep(selectedTasting);
	}

	prefillSelectedNotes(notes) {
		const type = this.props.tastingShowCaseData.type;
		const tastingData = tasting.data[type];
		const tastingSrc = tasting.source[type];

		this.prefillAppearanceNotes(notes, tastingData.appearance, tastingSrc);
	}

	prefillAppearanceNotes(notes, appearanceData, tastingSrc) {
		let selectedAppearance = {};

		appearanceData.keys.forEach((key) => {
			if (key === 'nuance_tint_') {
				let tintKey = selectedAppearance['color_'];
				if (tastingSrc[tintKey]) {
					tastingSrc[tintKey].forEach((l2key) => {
						let noteIndex = notes.indexOf(l2key);
						if (noteIndex !== -1) {
							selectedAppearance[key] = l2key;
						}
					});
				}
			} else {
				if (tastingSrc[key]) {
					tastingSrc[key].forEach((l2key) => {
						let noteIndex = notes.indexOf(l2key);
						if (noteIndex !== -1) {
							selectedAppearance[key] = l2key;
						}
					});
				}
			}
		});

		this.initAppearance(selectedAppearance, tastingSrc, 'appearance', appearanceData);
	}

	initAppearance(selectedAppearance, tastingSrc, key, appearanceData) {
		this.props.initEventTasting(selectedAppearance, tastingSrc, key, appearanceData);
	}

	handleOptionSelect(stepData, selectionKey, value) {
		const {tastingShowCaseData} = this.props;
		const {selections, activeSelection} = stepData;
		const type = tastingShowCaseData.type;
		const tastingSrc = tasting.source[type];

		let newActiveSelection = null;
		let newSelections = [];
		activeSelection.isActive = false; // set the previous active selection to false

		// set active selection
		selections.forEach((selection, index) => {
			let tempSelection = Object.assign({}, selection);
			newSelections.push(tempSelection);

			if (tempSelection.key === selectionKey) {
				tempSelection.isActive = true;
				tempSelection.activeOption = value;
				newActiveSelection = tempSelection;
			}
		});

		/*
      todo: figure out and implement a way to decouple the switch logic below
    */

		// Add logic for showing and hiding box selections
		switch (selectionKey) {
			case 'color_':
				newSelections.forEach((newSelection, index) => {
					// Reset nuance
					if (newSelection.key === 'nuance_tint_') {
						newSelection.hideSelection = false;
						newSelection.activeOption = null;
						newSelection.options = tastingSrc[newActiveSelection.activeOption];
						newSelection.nuance_tint_ = newActiveSelection.activeOption;
					}

					// Hide clarity and appearance
					if (newSelection.key === 'clarity_' || newSelection.key === 'appearanceintensity_') {
						newSelection.hideSelection = true;
					}
				});
				break;
			case 'nuance_tint_':
				newSelections.forEach((newSelection, index) => {
					// show clarity
					if (newSelection.key === 'clarity_') {
						newSelection.hideSelection = false;
						newSelection.activeOption = null;
						newSelection.nuance_tint_ = newActiveSelection.activeOption;
					}

					// Hide appearance
					if (newSelection.key === 'appearanceintensity_') {
						newSelection.hideSelection = true;
					}
				});
				break;
			case 'clarity_':
				let nuance_tint_ = {};

				newSelections.forEach((newSelection, index) => {
					if (newSelection.key === 'nuance_tint_') nuance_tint_ = newSelection;

					// show clarity
					if (newSelection.key === 'appearanceintensity_') {
						newSelection.hideSelection = false;
						newSelection.nuance_tint_ = nuance_tint_.activeOption;
						newSelection.clarity_ = newActiveSelection.activeOption;
					}
				});
				break;
			default:
			// do nothing
		}

		this.props.updateStepSelections(this.props.step, {
			selections: newSelections,
			activeSelection: newActiveSelection,
		});
	}

	prefillRatingStep(rating) {
		let newRatingData = {
			rating_balance_: rating.balance,
			rating_length_: rating.length,
			rating_intensity_: rating.intensity,
			rating_complexity_: rating.complexity,
			rating_senseofplace_: rating.senseofplace,
			rating_quality_: rating.quality,
			rating_drinkability_: rating.drinkability,
		};
		this.props.updateSelectedItem('rating', newRatingData);
	}

	prefillCommentStep(selectedTasting) {
		let newCommentsData = {
			wine_summary: selectedTasting.summary_wine,
			wine_personal: selectedTasting.summary_personal,
		};
		this.props.updateSelectedItem('comments', newCommentsData);
	}

	prefillInfoStep(selectedTasting) {
		let newInfoData = {
			tasting_name: selectedTasting.name,
			tasting_country: selectedTasting.country,
			tasting_region: selectedTasting.region,
			tasting_producer: selectedTasting.producer,
			tasting_vintage: selectedTasting.vintage,
			tasting_grape: selectedTasting.grape,
			tasting_price: selectedTasting.price,
			tasting_currency: selectedTasting.currency,
		};
		this.props.updateSelectedItem('info', newInfoData);
	}

	togglePrompt = () => {
		this.setState({
			prompt: !this.state.prompt,
		});
	};

	handleNo = () => {
		this.props.restartSession();
		this.props.history.go(this.props.location.pathname);
	};

	handleYes = () => {
		this.props.restoreSession(this.props.tastingShowCaseData.type);
		this.togglePrompt();
	};

	componentWillUnmount() {
		unlisten();
	}

	componentDidMount() {
		const {multiStepForm} = this.props;
		const hasPrevSession = multiStepForm.lastSessionData[this.props.tastingShowCaseData.type];

		if (multiStepForm.navigatedAway && hasPrevSession) {
			this.togglePrompt();
		}

		unlisten = this.props.history.listen((nextLocation, action) => {
			let currentLocation = this.props.location;
			if (currentLocation.pathname !== nextLocation.pathname) {
				this.props.navigateAway(this.props.tastingShowCaseData.type);
			}
		});
	}

	render() {
		if (this.props.tastingShowCaseData === undefined || this.props.tastingShowCaseData === null) {
			return <Redirect to="/404/not-found" />;
		}

		let tasting = null;
		let type = this.props.tastingShowCaseData.type;

		switch (type) {
			case 'nectar':
				tasting = <Nectar history={this.props.history} />;
				break;
			case 'profound':
				tasting = <Profound history={this.props.history} />;
				break;
			case 'light':
				tasting = <Light history={this.props.history} />;
				break;
			default:
				return <Redirect to="/404/not-found" />;
		}

		return (
			<div className="new-tasting">
				{tasting}
				<PromptModal
					title={'New ' + type + ' tasting'}
					isOpen={this.state.prompt}
					toggle={this.togglePrompt}
					noCallback={this.handleNo}
					yesCallback={this.handleYes}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		tastingShowCaseData: state.events.tastingShowCaseData,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{
		updateSelectedItem,
		initStepData,
		initEventTasting,
		updateStepSelections,
		resetForm,
		navigateAway,
		restartSession,
		restoreSession,
		setTastingType,
	}
)(EventTasting);
