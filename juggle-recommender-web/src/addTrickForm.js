import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'



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
		tags : [],
		submitDisabled : true,
		nameErrorMessage: "",
		numBallsErrorMessage: "",
		difficultyErrorMessage: "",
		videoUrlErrorMessage: ""
	}

	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleNumBallsChange=(e)=>{
		this.setState({
			numBalls:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleDiffChange=(e)=>{
		this.setState({
			difficulty:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleVideoURLChange=(e)=>{
		this.setState({
			videoURL:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleSSChange=(e)=>{
		this.setState({
			siteSwap:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handlePrereqAddition=(tag)=> {
		if (store.library[tag.id]){
	        this.setState(state => ({ prereqs: [...state.prereqs, tag] }));
	        this.checkIfFormIsSubmittable()
	    }
    }
    handlePrereqDelete=(i)=> {
        const { prereqs } = this.state;
        this.setState({
         prereqs: prereqs.filter((tag, index) => index !== i),
        });
    }
    handleTagAddition=(tag)=> {

    	if (store.tagsSuggestions.includes(tag.id)){
	        this.setState(state => ({ tags: [...state.tags, tag] }));
	        this.checkIfFormIsSubmittable()
	    }
    }
    handleTagDelete=(i)=> {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
    checkIfFormIsSubmittable=()=>{
    	const suffix = this.state.numBalls === 3 ? '' : " ("+this.state.numBalls+"b)"
    	this.setState({submitDisabled:false})
    	if (utilities.isEmptyOrSpaces(this.state.name)){
    		this.setState({submitDisabled:true})
    	}else{
    		if(store.library[this.state.name+suffix]){
				this.setState({nameErrorMessage:'Pattern already exists.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({nameErrorMessage:''})
			} 
    	}
    	if (utilities.isEmptyOrSpaces(this.state.numBalls)){
    		this.setState({submitDisabled:true})
    	}else{
    		if (utilities.isNotOnlyDigits(this.state.numBalls)){
				this.setState({numBallsErrorMessage:'must be a number.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({numBallsErrorMessage:''})
			}    		
    	}
    	if (utilities.isEmptyOrSpaces(this.state.difficulty)){
    		this.setState({submitDisabled:true})
    	}else{
    		if (utilities.isNotOnlyDigits(this.state.difficulty) ||
    			(this.state.difficulty<1 || this.state.difficulty>10)){    			
					this.setState({difficultyErrorMessage:'must be a number (1-10).'})
					this.setState({submitDisabled:true})
				}else{
					this.setState({difficultyErrorMessage:''})				 
				}  		
    	}
    	if (utilities.isEmptyOrSpaces(this.state.videoURL)){
			this.setState({submitDisabled:true})
		}else{
			if (store.getUsableVideoURL(this.state.videoURL)==='notValid'){
				this.setState({videoUrlErrorMessage:'Not a valid URL.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({videoUrlErrorMessage:''})
			}
		}
    }

	submit=()=>{
			if (this.state.submitDisabled){
				document.getElementById("submitButton").focus();
			}
			if (!this.state.submitDisabled){
				
				var tags = this.state.tags.map(function(item) {
					return item['text'];
				});
				var prereqs = this.state.prereqs.map(function(item) {
					return item['text'];
				});		
				const suffix = "("+this.state.numBalls+"b)"
				const date = new Date()
				const trick = {
					name : this.state.name+suffix,
					num : this.state.numBalls,
					difficulty : this.state.difficulty,
					contributor : authStore.user.username, 
					video : this.state.videoURL,
					siteswap :  this.state.siteSwap,
					prereqs : prereqs,
					tags : tags,
					timeSubmitted : date.getTime()
				}

				store.addTrickToDatabase(trick)
				this.clearState()
				alert(trick.name+" added!")
		}
	}
	

	cancel=()=>{
		this.clearState()
		uiStore.toggleAddingTrick()
	}

	clearState=()=>{
		this.setState({name : ""})
		this.setState({numBalls : ""})
		this.setState({difficulty : ""})
		this.setState({videoURL : ""})
		this.setState({siteSwap : ""})
		this.setState({prereqs : []})
		this.setState({tags : []})
		this.setState({submitDisabled : false})
		this.setState({numBallsErrorMessage : ""})
		this.setState({difficultyErrorMessage : ""})
	}

	render (){

		const patternsObj = Object.keys(store.library).map((pattern) => {
		  return {
		  	size: null,
		    id: pattern,
		    text: pattern,
		  }
		})

		const prereqsInput = <ReactTags
					          autofocus = {false}
					          placeholder = ''
					          inputFieldPosition="bottom"
					          tags={this.state.prereqs}
					          minQueryLength={1}
					          suggestions={patternsObj}
					          delimiters={delimiters}
					          handleDelete={this.handlePrereqDelete}
					          handleAddition={this.handlePrereqAddition}
					          handleTagClick={this.handlePrereqClick}/>

		const tagInput = <ReactTags
					          autofocus = {false}
					          placeholder = ''
					          inputFieldPosition="bottom"
					          tags={this.state.tags}
					          minQueryLength={0}
					          suggestions={store.presetTags}
					          delimiters={delimiters}
					          handleDelete={this.handleTagDelete}
					          handleAddition={this.handleTagAddition}
					          handleTagClick={this.handleTagClick}/>

		const form = 	
						<div className="form">
							<h3>Add Pattern</h3>
							<div className="innerForm">
								<div className="inputContainer">
									<span className="redText">*</span>
									<span className="inputLabel">Trick name</span><br/>
									<span className="warning">{this.state.nameErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.name} 
											onBlur={this.handleNameChange}
											onChange={this.handleNameChange}/>
								</div>
								<div className="inputContainer">
									<span className="inputLabel">Tags</span>{tagInput}
								</div>
								<div className="inputContainer">
									<span className="inputLabel">Prereqs</span>{prereqsInput}
								</div>

								<div className="inputContainer">
									<span className="redText">*</span>
									<span className="inputLabel">Number of balls</span>
									<span className="warning">{this.state.numBallsErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.numBalls} 
											onBlur={this.handleNumBallsChange}
											onChange={this.handleNumBallsChange}/>
								</div>
								<div className="inputContainer">
									<span className="redText">*</span>
									<span className="inputLabel">Difficulty</span>
									<span className="warning">{this.state.difficultyErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.difficulty} 
											onBlur={this.handleDiffChange}
											onChange={this.handleDiffChange}/>
								</div>
								<div className="inputContainer">
									<span className="redText">*</span>
									<span className="inputLabel">Instagram or Youtube Video <br/>(only containing added trick)</span>
									<span className="warning">{this.state.videoUrlErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.videoURL} 
											onBlur={this.handleVideoURLChange}
											onChange={this.handleVideoURLChange}
									/>
								</div>
								<div className="inputContainer">
									<span className="inputLabel">Siteswap</span>
									<input className="formInputs" 
											value={this.state.siteSwap} 
											onBlur={this.handleSSChange}
											onChange={this.handleSSChange}
									/>
								</div>
							</div>
								<button id = "submitButton"
										className={this.state.submitDisabled?
											"formButton disabledSubmitButton":"formButton"}
										onClick={this.submit}>submit</button>
								<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
								<button className="formButton"onClick={this.cancel}>cancel</button>
						</div>
		return(
				<div>
					{uiStore.addingTrick ? form : null}
				</div>
			)
	}
}
export default AddTrickForm

