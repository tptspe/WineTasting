import React, {Component} from 'react';
import {connect} from 'react-redux';
import info from 'src/assets/json/tasting/info.json';
import dev from 'src/assets/json/dev.json';
import l18n from 'src/assets/json/l18n.json';
// import crp from 'src/assets/json/crp.json';
import {updateSelectedItem} from 'src/actions/multiStepFormActions';
import {getAutoSuggest, getAutoSuggestPendingStatus} from 'src/actions/infoActions';
import InfoField from './InfoField';
import AutoSuggestWrapper from './AutoSuggestWrapper';
import debounce from 'lodash/debounce';
import appConfig from 'src/config/app';

class InfoForm extends Component {
	constructor(props) {
		super(props);
		this.updateSelectedInfo = this.updateSelectedInfo.bind(this);
		this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
		this.autofillForm = this.autofillForm.bind(this);
		this.getAutoSuggest = debounce(props.getAutoSuggest, 500);
		if (
			(props.multiStepForm.selectedItems.info === undefined ||
				props.multiStepForm.selectedItems.info === null) &&
			props.multiStepForm.mode === 'form'
		) {
			this.resetForm();
		}
	}

	resetForm() {
		let tastingSrc = this.props.multiStepForm.tastingSrc;

		let infoKey = info.keys[0];
		tastingSrc[infoKey].forEach((infoName, index) => {
			this.updateSelectedInfo({[infoName]: ''});
		});
	}

	async updateSelectedInfo(value) {
		this.props.updateSelectedItem('info', value);
		this.props.getAutoSuggestPendingStatus();
		await this.getAutoSuggest(value, this.props.info, this.props.multiStepForm.selectedItems);
	}

	handleAutoSuggest(value) {
		// temporarily disabled
		// this.props.getAutoSuggest(value);
	}

	autofillForm(event) {
		event.preventDefault();
		let tastingSrc = this.props.multiStepForm.tastingSrc;
		let infoKey = info.keys[0];
		let infoAutoFill = dev.autofill[infoKey];

		tastingSrc[infoKey].forEach((infoName, index) => {
			this.updateSelectedInfo({[infoName]: infoAutoFill[infoName]});
		});
	}

	getAutoFillButton() {
		let autoFillBtn = null;

		if (appConfig.DEV_MODE) {
			autoFillBtn = (
				<div className="auto-fill-wrapper" style={{textAlign: 'center'}}>
					<button onClick={this.autofillForm}>AutoFill</button>
				</div>
			);
		}

		return autoFillBtn;
	}

	getInfoFields() {
		let mode = this.props.multiStepForm.mode;
		let tastingSrc = this.props.multiStepForm.tastingSrc;
		let infoKey = info.keys[0];
		let infoData = this.props.multiStepForm.selectedItems.info;
		let autoSuggestSrc = [];
		let infoFields = [];

		const {autoSuggests, isLoading} = this.props.info;

		if (infoData) {
			infoFields = tastingSrc[infoKey].map((infoName, index) => {
				if (
					0 &&
					(infoName === 'tasting_name' ||
						infoName === 'tasting_country' ||
						infoName === 'tasting_region' ||
						infoName === 'tasting_producer') &&
					mode === 'form'
				) {
					autoSuggestSrc = autoSuggests && autoSuggests[infoName] ? autoSuggests[infoName] : [];
					return (
						<AutoSuggestWrapper
							key={index}
							infoKey={infoName}
							src={autoSuggestSrc}
							isLoading={isLoading}
							label={l18n[infoName + '_ui'] ? l18n[infoName + '_ui'] : ''}
							infoCallBack={this.updateSelectedInfo}
							autoSuggestCallBack={this.handleAutoSuggest}
							placeholder={l18n[infoName + '_placeholder'] ? l18n[infoName + '_placeholder'] : ''}
							value={infoData && infoData[infoName] ? infoData[infoName] : ''}
							disabled={mode === 'showcase'}
						/>
					);
				} else {
					return (
						<InfoField
							key={index}
							infoKey={infoName}
							placeholder={l18n[infoName + '_placeholder'] ? l18n[infoName + '_placeholder'] : ''}
							infoCallBack={this.updateSelectedInfo}
							autoSuggestCallBack={this.handleAutoSuggest}
							required={info.required.includes(infoName)}
							value={infoData && infoData[infoName] ? infoData[infoName] : ''}
							disabled={mode === 'showcase'}
						/>
					);
				}
			});
		}

		return infoFields;
	}

	render() {
		return (
			<form action="" className="info-form">
				{this.getInfoFields()}
				{this.getAutoFillButton()}
			</form>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		multiStepForm: state.multiStepForm,
		info: state.info,
	};
}

export default connect(
	mapStateToProps,
	{updateSelectedItem, getAutoSuggest, getAutoSuggestPendingStatus}
)(InfoForm);
