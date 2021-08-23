import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

import {navigateForm, copyAromaNotes, initTastingSrc} from 'src/actions/multiStepFormActions';
import appConfig from 'src/config/app';

import nose from 'src/assets/json/tasting/nose.json';
import logic from 'src/assets/json/tasting/logic.json';

import './MultiStepForm.scss';

const getNavStates = (indx, length) => {
	let styles = [];
	for (let i = 0; i < length; i++) {
		if (i < indx) {
			styles.push('done');
		} else if (i === indx) {
			styles.push('doing');
		} else {
			styles.push('todo');
		}
	}
	return {current: indx, styles: styles};
};

const checkNavState = (currentStep, stepsLength, currentSubStep = 0, subStepLength = 0) => {
	/*
    Show both buttons when...
    1. The current step is greater than 0 and less than the steps length
    2. There's an available substep and the currentSubStep is greater than 0 but less than the subStepLength
  */

	if (
		(currentStep > 0 && currentStep < stepsLength - 1) ||
		(subStepLength > 0 && currentSubStep > 0 && currentSubStep < subStepLength)
	) {
		return {
			showPreviousBtn: true,
			showNextBtn: true,
			showSaveBtn: false,
		};
	} else if (currentStep === 0) {
		return {
			showPreviousBtn: false,
			showNextBtn: true,
			showSaveBtn: false,
		};
	} else {
		return {
			showPreviousBtn: true,
			showNextBtn: false,
			showSaveBtn: true,
		};
	}
};

class MultiStepForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPreviousBtn: props.multiStepForm.navState.navButtons.showPreviousBtn,
			showNextBtn: props.multiStepForm.navState.navButtons.showNextBtn,
			showSaveBtn: props.multiStepForm.navState.navButtons.showSaveBtn,
			disableNextBtn: props.multiStepForm.navState.navButtons.disableNextBtn,
			disableSaveBtn: props.multiStepForm.navState.navButtons.disableSaveBtn,
			isSaving: false,
			compState: props.multiStepForm.navState.compState,
			subCompState: props.multiStepForm.navState.subCompState,
			navState: props.multiStepForm.navState.progressBarState
				? props.multiStepForm.navState.progressBarState
				: getNavStates(0, this.props.steps.length),
		};
		props.initTastingSrc(props.tastingSrc);
	}

	setNavState = (next, nextSubStep = 0) => {
		const {compState} = this.state;
		const {steps} = this.props;

		this.setState({
			navState: getNavStates(next, steps.length),
		});

		if (next < steps.length) {
			this.setState({
				compState: next,
				subCompState: nextSubStep,
			});
		}

		let buttonState = {};

		// if the current component has substeps, include/handle next and prev button for the substeps
		if (steps[compState].subSteps && nextSubStep < steps[compState].subSteps.length) {
			buttonState = checkNavState(
				next,
				steps.length,
				nextSubStep,
				steps[compState].subSteps.length
			);
		} else {
			buttonState = checkNavState(next, steps.length);
		}

		this.setState(buttonState);
		this.props.navigateForm(next, nextSubStep, getNavStates(next, steps.length), buttonState);
	};

	handleKeyDown = (evt) => {
		if (evt.which === 37) {
			this.previous();
		}
		if (evt.which === 39) {
			this.next();
		}
	};

	jumpToStep = (evt) => {
		if (appConfig.DEV_MODE) {
			if (
				evt.currentTarget.value === this.props.steps.length - 1 &&
				this.state.compState === this.props.steps.length - 1
			) {
				this.setNavState(this.props.steps.length);
			} else {
				this.setNavState(evt.currentTarget.value);
			}
		}
	};

	next = () => {
		const {compState, subCompState} = this.state;
		const {steps} = this.props;
		let currentComponent = steps[compState].component;

		// Reset next button when navigating the form
		this.disableNextOrSaveBtn(false);

		if (currentComponent) {
			this.setNavState(this.state.compState + 1);
		} else {
			if (subCompState + 1 < steps[compState].subSteps.length) {
				this.setNavState(this.state.compState, subCompState + 1);
			} else {
				this.setNavState(this.state.compState + 1);
			}
		}
	};

	previous = () => {
		const {compState, subCompState} = this.state;
		const {steps} = this.props;
		let currentComponent = steps[compState].component;

		// Reset next button when navigating the form
		this.disableNextOrSaveBtn(false);

		if (currentComponent) {
			// Check if the next component has a substep, if true, start from the last subcomponent
			let nextSubStep = steps[this.state.compState - 1].subSteps;
			if (nextSubStep) {
				this.setNavState(this.state.compState - 1, nextSubStep.length - 1);
			} else {
				this.setNavState(this.state.compState - 1);
			}
		} else {
			if (subCompState > 0) {
				this.setNavState(this.state.compState, subCompState - 1);
			} else {
				if (this.state.compState > 0) {
					// Check if the next component has a substep, if true, start from the last subcomponent
					let nextSubStep = steps[this.state.compState - 1].subSteps;
					if (nextSubStep) {
						this.setNavState(this.state.compState - 1, nextSubStep.length - 1);
					} else {
						this.setNavState(this.state.compState - 1);
					}
				}
			}
		}
	};

	save = () => {
		this.setState({
			disableSaveBtn: true,
			isSaving: true,
		});
		this.props.formSubmitCallback();
	};

	copyAromaNotes = () => {
		const {selectedItems, tastingType} = this.props.multiStepForm;
		const name = this.getCurrentComponent().props.name;
		const aromaKeys =
			tastingType === 'light' ? ['notes_'] : nose[1].keys.concat(nose[2].keys).concat(nose[3].keys);
		const selectedNoseItems = selectedItems.nose;
		const aromaNotes = {};

		// Get all aroma notes from nose['floral_']
		if (selectedNoseItems && (name === 'step2' || name === 'step3' || name === 'step4')) {
			Object.keys(selectedNoseItems).forEach((key) => {
				if (aromaKeys.includes(key)) {
					aromaNotes[key] = selectedNoseItems[key];
				}
			});
			this.props.copyAromaNotes(aromaNotes, 'palate', name);
		}
	};

	getClassName = (className, i) => {
		return className + '-' + this.state.navState.styles[i];
	};

	getCurrentComponent() {
		const {compState, subCompState} = this.state;

		let currentStep = this.props.steps[compState];
		let currentComponent = null;

		if (currentStep.component) {
			currentComponent = currentStep.component;
		} else {
			currentComponent = currentStep.subSteps[subCompState];
		}

		return currentComponent;
	}

	disableNextOrSaveBtn(disable = true) {
		if (disable) {
			// Handle the save button only when the user is on the last step
			if (this.state.compState === this.props.steps.length - 1) {
				if (!this.state.disableSaveBtn) {
					this.setState({
						disableSaveBtn: true,
					});
				}
			} else {
				if (!this.state.disableNextBtn) {
					this.setState({
						disableNextBtn: true,
					});
				}
			}
		} else {
			// Handle the save button only when the user is on the last step
			if (this.state.compState === this.props.steps.length - 1) {
				if (this.state.disableSaveBtn) {
					this.setState({
						disableSaveBtn: false,
					});
				}
			} else {
				if (this.state.disableNextBtn) {
					this.setState({
						disableNextBtn: false,
					});
				}
			}
		}
	}

	handleRequiredFields() {
		const currentComponent = this.getCurrentComponent();
		const requiredFields = currentComponent.props.requiredFields;
		const stepKey = currentComponent.props.stepKey;
		const selectedItems = this.props.multiStepForm.selectedItems[stepKey];

		/*
			Logic for handling required items
			1. Check if there are required fields for the current step
			2. Get multiForm SelectedItems for the current step
			3. If there are any require fields, check if they already exists on multiStepForm.selectedItems and have actual values
			4. If all the required fields exists and have values, enable the next or save button else disable it
		*/

		if (requiredFields !== undefined && requiredFields !== null && requiredFields.length > 0) {
			if (selectedItems === undefined || selectedItems === null) {
				this.disableNextOrSaveBtn(true);
			} else {
				let filledOut = true;

				requiredFields.forEach((field) => {
					if (
						selectedItems &&
						(selectedItems[field] === undefined ||
							selectedItems[field] === null ||
							selectedItems[field] === '' ||
							selectedItems[field].length <= 0)
					) {
						if (stepKey !== 'appearance' && logic[field] && logic[field]['notif']) {
							// handle notif logic
							logic[field]['notif'].forEach((item) => {
								if (selectedItems[field] && !selectedItems[field].includes(item)) {
									filledOut = false;
								}
							});
						} else if (stepKey !== 'appearance' && logic[field] && logic[field]['onlyif']) {
							// handle onlyif logic
							logic[field]['onlyif'].forEach((item) => {
								if (selectedItems[field] && !selectedItems[field].includes(item)) {
									filledOut = false;
								}
							});
						} else {
							filledOut = false;
						}
					}
				});

				if (filledOut) {
					this.disableNextOrSaveBtn(false);
				} else if (this.state.isSaving) {
					this.disableNextOrSaveBtn(true);
				} else {
					this.disableNextOrSaveBtn(true);
				}
			}
		}
	}

	componentDidUpdate(prevProps) {
		this.handleRequiredFields();

		if (
			this.getCurrentComponent().props.stepKey !== 'appearance' &&
			this.props.multiStepForm.resetScroll
		) {
			window.scrollTo(0, 0);
		}

		if (
			this.props.multiStepForm.navState.compState !== this.state.compState ||
			this.props.multiStepForm.navState.subCompState !== this.state.subCompState
		) {
			let nextNavState = this.props.multiStepForm.navState.progressBarState
				? this.props.multiStepForm.navState.progressBarState
				: this.state.navState;

			this.setNavState(
				this.props.multiStepForm.navState.compState,
				this.props.multiStepForm.navState.subCompState
			);

			this.setState({
				navState: nextNavState,
			});
		}
	}

	render() {
		return (
			<div className="multi-step-form" onKeyDown={this.handleKeyDown}>
				<ol className="progtrckr">{this.renderSteps()}</ol>
				{this.getCurrentComponent()}
				{this.renderNavigation()}
			</div>
		);
	}

	renderSteps = () => {
		return this.props.steps.map((s, i) => (
			<li className={this.getClassName('progtrckr', i)} key={i} value={i} onClick={this.jumpToStep}>
				<em>{i + 1}</em>
				<span>{this.props.steps[i].name}</span>
			</li>
		));
	};

	renderNavigation = () => {
		return (
			<div
				className="multi-step-form-nav"
				style={this.props.showNavigation ? {} : {display: 'none'}}
			>
				<div className="container clearfix">
					<button
						className="prev-btn"
						style={this.state.showPreviousBtn ? {} : {display: 'none'}}
						onClick={this.previous}
					>
						<FaAngleLeft className="prev-icon" />
						Back
					</button>
					<Link to="/">
						<button className="prev-btn">
							<FaAngleLeft className="prev-icon" />
							Home
						</button>
					</Link>
					<button
						className={'next-btn ' + (this.state.disableNextBtn ? 'disabled' : '')}
						style={this.state.showNextBtn ? {} : {display: 'none'}}
						onClick={this.next}
						disabled={this.state.disableNextBtn}
					>
						Next
						<FaAngleRight className="next-icon" />
					</button>

					{this.getCurrentComponent().props.stepKey === 'palate' &&
						this.getCurrentComponent().props.name === 'step2' && (
							<button
								className={'copy-btn ' + (this.props.multiStepForm.copiedNotes ? 'copied' : '')}
								onClick={this.copyAromaNotes}
							>
								Copy all aroma notes
							</button>
						)}

					<button
						className={'save-btn ' + (this.state.disableSaveBtn ? 'disabled' : '')}
						style={this.state.showSaveBtn ? {} : {display: 'none'}}
						onClick={this.save}
						disabled={this.state.disableSaveBtn}
					>
						Save
					</button>
				</div>
			</div>
		);
	};
}

MultiStepForm.defaultProps = {
	showNavigation: true,
};

function mapStateToProps(state) {
	return {
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{navigateForm, copyAromaNotes, initTastingSrc}
)(MultiStepForm);
