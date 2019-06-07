import React, {Component} from 'react';
import uiStore from "./uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"
import authStore from "./authStore"
import store from "./store"
import { WithContext as ReactTags } from 'react-tag-input';
import './filter.css';
import {TAGS} from './tags';

const presetTags = TAGS.map((tag) => {
  return {
  	size: null,
    id: tag,
    text: tag,
  }
})

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

@observer
class AddTrickForm extends Component {
	state = {
		name : "",
		numBalls : "",
		difficulty : "",
		videoURL : "",
		siteSwap : "",
		prereqs : [],
		tags : []

	}

	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value
		})
	}
	handleNumBallsChange=(e)=>{
		this.setState({
			numBalls:e.target.value
		})
	}
	handleDiffChange=(e)=>{
		this.setState({
			difficulty:e.target.value
		})
	}
	handleVideoURLChange=(e)=>{
		this.setState({
			videoURL:e.target.value
		})
	}
	handleSSChange=(e)=>{
		this.setState({
			siteSwap:e.target.value
		})
	}

    handleTagAddition=(tag)=> {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }
    handleTagDelete=(i)=> {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
	submit=()=>{
		var tags = this.state.tags.map(function(item) {
			return item['text'];
		});
				
		const trick = {
			name : this.state.name,
			num : this.state.numBalls,
			difficulty : this.state.difficulty,
			contributor : authStore.user.username, 
			video : this.state.videoURL,
			siteswap :  this.state.siteSwap,
			prereqs : ["Cascade"],
			tags : tags
		}
		store.addTrickToDatabase(trick)
	}
	cancel=()=>{
		
	}
	render (){
		//TODO add prereqs and tags as react tags 

		const form = 	
						<div className="form">
							<label>Trick name</label><br/><input value={this.state.name} onChange={this.handleNameChange}/><br/>
							<label>Number of balls</label><br/><input value={this.state.numBalls} onChange={this.handleNumBallsChange}/><br/>
							<label>Difficulty</label><br/><input value={this.state.difficulty} onChange={this.handleDiffChange}/><br/>
							<label>Video URL</label><br/><input value={this.state.videoURL} onChange={this.handleVideoURLChange}/><br/>
							<label>Siteswap</label><br/><input value={this.state.siteSwap} onChange={this.handleSSChange}/><br/>
							<ReactTags
						          autofocus = {false}
						          inputFieldPosition="bottom"
						          tags={this.state.tags}
						          minQueryLength={1}
						          suggestions={presetTags}
						          delimiters={delimiters}
						          handleDelete={this.handleTagDelete}
						          handleAddition={this.handleTagAddition}
						          handleTagClick={this.handleTagClick}/>
							<button onClick={this.submit}>submit</button>
							<button onClick={uiStore.toggleAddingTrick}>cancel</button>
						</div>

		console.log("form", form)
		return(
				<div>
					{uiStore.addingTrick ? form : null}
				</div>
			)
	}
}
export default AddTrickForm

