import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateSelectedItem} from 'src/actions/multiStepFormActions';
import CommentArea from '../partials/CommentArea';

import comments from 'src/assets/json/tasting/comments.json';

class CommentStep extends Component {
	constructor(props) {
		super(props);
		this.updateSelectedComments = this.updateSelectedComments.bind(this);
	}

	updateSelectedComments(value) {
		this.props.updateSelectedItem('comments', value);
	}

	getCommentAreas() {
		const {multiStepForm} = this.props;
		let commentsKey = comments.keys[0];
		let tastingSrc = multiStepForm.tastingSrc;
		let selectedItems = multiStepForm.selectedItems;
		let commentData = multiStepForm.selectedItems.comments;

		let commentAreas = tastingSrc[commentsKey].map((commentName, index) => {
			return (
				<div key={index} className="comment-area-wrapper">
					<CommentArea
						commentKey={commentName}
						selectedItems={selectedItems}
						commentCallBack={this.updateSelectedComments}
						content={commentData ? commentData[commentName] : ''}
						showControls={commentName === 'wine_personal' ? false : true}
					/>
				</div>
			);
		});

		return commentAreas;
	}

	render() {
		return (
			<div className="step-container comments-step">
				<div className="container">{this.getCommentAreas()}</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		multiStepForm: state.multiStepForm,
	};
}

export default connect(
	mapStateToProps,
	{updateSelectedItem}
)(CommentStep);
