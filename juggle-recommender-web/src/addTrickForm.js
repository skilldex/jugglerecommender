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
		num : "",
		difficulty : "",
		video : "",
		siteSwap : "",
		prereqs : [],
		tags : [],
		submitDisabled : true,
		nameErrorMessage: "",
		numErrorMessage: "",
		difficultyErrorMessage: "",
		videoErrorMessage: ""
	}

	componentDidMount=()=>{
		if(uiStore.editingPopupTrick){
			let trick = {...store.library[uiStore.popupTrick.id]}
			trick.name = trick.name.substr(0, trick.name.lastIndexOf("("))
			//convert tag strings to tag objects
			if(trick.tags){
				trick.tags = trick.tags.map((tag)=>{
					return {
						id : tag,
						text : tag
					}
				})
			}
			//convert prereq strings to tag objects
			if(trick.prereqs){
				trick.prereqs = trick.prereqs.map((prereq)=>{
					return {
						id : prereq,
						text : prereq
					}
				})	
			}
			console.log(trick)
			this.setState({...trick})

		}
		this.setState({submitDisabled : false,})
	}
	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleNumChange=(e)=>{
		this.setState({
			num:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleDiffChange=(e)=>{
		this.setState({
			difficulty:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleVideoChange=(e)=>{
		this.setState({
			video:e.target.value
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
    	const suffix = this.state.num === 3 ? '' : " ("+this.state.num+"b)"
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
    	if (utilities.isEmptyOrSpaces(this.state.num)){
    		this.setState({submitDisabled:true})
    	}else{
    		if (utilities.isNotOnlyDigits(this.state.num)){
				this.setState({numErrorMessage:'must be a number.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({numErrorMessage:''})
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
    	if (utilities.isEmptyOrSpaces(this.state.video)){
			this.setState({submitDisabled:true})
		}else{
			if (store.getUsableVideoURL(this.state.video)==='notValid'){
				this.setState({videoErrorMessage:'Not a valid URL.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({videoErrorMessage:''})
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
				const suffix = "("+this.state.num+"b)"
				const date = new Date()
				const name = this.state.name+suffix
				const trick = {
					name : name,
					num : this.state.num,
					difficulty : this.state.difficulty,
					contributor : authStore.user.username, 
					video : this.state.video,
					siteswap :  this.state.siteSwap,
					prereqs : prereqs,
					tags : tags,
					
				}
				if(uiStore.editingPopupTrick){
					trick["timeUpdated"] = date.getTime()
					alert(trick.name+" edited!")
				}else{
					alert(trick.name+" added!")
					trick["timeSubmitted"] = date.getTime()
				}
				
				store.addTrickToDatabase(trick)
				this.clearState()

		}
	}
	

	cancel=()=>{
		this.clearState()
		uiStore.toggleAddingTrick()
	}

	clearState=()=>{
		this.setState({name : ""})
		this.setState({num : ""})
		this.setState({difficulty : ""})
		this.setState({video : ""})
		this.setState({siteSwap : ""})
		this.setState({prereqs : []})
		this.setState({tags : []})
		this.setState({submitDisabled : false})
		this.setState({numErrorMessage : ""})
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
					          handleTagClick={this.handleTagClick}
					     />
		const titleText = uiStore.editingPopupTrick ? "Edit Pattern" : "Add Pattern"
		const form = 	
						<div className="form">
							<h3>{titleText}</h3>
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
									<span className="warning">{this.state.numErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.num} 
											onBlur={this.handleNumChange}
											onChange={this.handleNumChange}/>
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
									<span className="warning">{this.state.videoErrorMessage}</span>
									<input className="formInputs" 
											value={this.state.video} 
											onBlur={this.handleVideoChange}
											onChange={this.handleVideoChange}
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

