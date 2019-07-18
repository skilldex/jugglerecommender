import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'


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
		url : "",
		video : "",
		videoStartTime: "",
		videoEndTime: "",
		siteswap : "",
		prereqs : [],
		related : [],
		postreqs : [],
		tags : [],
		submitDisabled : true,
		nameErrorMessage: "",
		numErrorMessage: "",
		difficultyErrorMessage: "",
		tutorialErrorMessage: "",
		siteswapErrorMessage: "",
		videoErrorMessage: "",
		videoTimeErrorMessage:'',
		timeSubmitted : "",
		autoCompletedName : false,
		trickNameBeingEdited: "",
		showTimeInputs: false,
		explanation: '',
	}

	componentDidMount=()=>{
		if(uiStore.editingDetailTrick){
			let trick = {...store.library[uiStore.detailTrick.id]}
			console.log(trick)
			trick.name = trick.name.substr(0, trick.name.lastIndexOf("("))
			this.setState({trickNameBeingEdited:trick.name})
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
			//convert related strings to tag objects
			if(trick.related){
				trick.related = trick.related.map((related)=>{
					return {
						id : related,
						text : related
					}
				})	
			}
			//convert postreq strings to tag objects
			if(trick.dependents){
				trick.postreqs = trick.dependents.map((postreq)=>{
					return {
						id : postreq,
						text : postreq
					}
				})	
			}
			if(trick.videoStartTime || trick.videoEndTime){
				this.setState({showTimeInputs : true})
			}			
			this.setState({...trick})
			this.setState({submitDisabled : false,})

		}	
	}
	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value,
			autoCompletedName : false
		})
		this.checkIfFormIsSubmittable()
	}
	handleExplanationChange=(e)=>{
		this.setState({
			explanation:e.target.value,
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
	handleTutorialChange=(e)=>{
		this.setState({
			url:e.target.value
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
			siteswap:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleStartTimeChange=(e)=>{
		this.setState({
			videoStartTime:e.target.value
		})
		this.checkIfFormIsSubmittable()
	}
	handleEndTimeChange=(e)=>{		
		this.setState({
			videoEndTime:e.target.value
		})
		this.checkIfFormIsSubmittable()
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
	handleRelatedAddition=(tag)=> {
		if (store.library[tag.id]){
	        this.setState(state => ({ related: [...state.related, tag] }));
	        this.checkIfFormIsSubmittable()
	    }
    }
    handleRelatedDelete=(i)=> {
        const { related } = this.state;
        this.setState({
         	related: related.filter((tag, index) => index !== i),
        });
    }
	handlePostreqAddition=(tag)=> {
		if (store.library[tag.id]){
	        this.setState(state => ({ postreqs: [...state.postreqs, tag] }));
	        this.checkIfFormIsSubmittable()
	    }
    }
    handlePostreqDelete=(i)=> {
        const { postreqs } = this.state;
        this.setState({
         	postreqs: postreqs.filter((tag, index) => index !== i),
        });
    }
    checkIfFormIsSubmittable=()=>{
    	this.setState({submitDisabled:false})
    	if (utilities.isEmptyOrSpaces(this.state.name)){
			this.setState({nameErrorMessage:'Pattern name blank.'})
			this.setState({submitDisabled:true})
    	}else{
    		this.setState({nameErrorMessage:''})
    		let tricksInLibraryKeys = []
			let tricksInLibraryModifiedKey = []
			let tricksInLibraryModifiedName = []
			for (let key in store.library) {
				let modifiedKey = key.toLowerCase()
				if (modifiedKey.includes("b)")){
					modifiedKey = modifiedKey.substr(0,modifiedKey.lastIndexOf("("))
				}
				let modifiedName = store.library[key].name.toLowerCase()
				if (modifiedName.includes("b)")){
					modifiedName = modifiedName.substr(0,modifiedName.lastIndexOf("("))
				}
			    tricksInLibraryKeys.push(key)
				tricksInLibraryModifiedName.push(modifiedName)
			    tricksInLibraryModifiedKey.push(modifiedKey)
			};
			let indecesToCheck = []
			const stateName = this.state.name
			tricksInLibraryModifiedName.forEach(function (item, index) {
    			if(item === stateName.toLowerCase()){
    				indecesToCheck.push(index)
    			}
			});
			tricksInLibraryModifiedKey.forEach(function (item, index) {
    			if(item === stateName.toLowerCase()){
    				indecesToCheck.push(index)
    			}
			});
    		const stateNum = this.state.num
    		let patternAlreadyExists = false
    		if (indecesToCheck.length>0){
    			indecesToCheck.forEach(function (item, index) {
	    			if (parseInt(stateNum,10) === 
	    				parseInt(store.library[tricksInLibraryKeys[item]].num,10) ||
	    				store.library[tricksInLibraryKeys[item]+"("+stateNum+"b)"]){
	    				patternAlreadyExists = true
					}
				});
			if (this.state.trickNameBeingEdited.toLowerCase() === this.state.name.toLowerCase()){
				patternAlreadyExists = false
			}
    		}if (patternAlreadyExists){
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
    	if (!utilities.isEmptyOrSpaces(this.state.url)){
			if(this.state.url.includes('http') && 
				this.state.url.includes('.')){
					this.setState({tutorialErrorMessage:''})
				}else{
					this.setState({tutorialErrorMessage:'Not a valid tutorial URL.'})
					this.setState({submitDisabled:true})					
				}
		}else{
			this.setState({tutorialErrorMessage:''})
		}
    	if (utilities.isEmptyOrSpaces(this.state.difficulty)){
    		this.setState({submitDisabled:true})
    	}else{
    		if (utilities.isNotOnlyDigitsOrDecimal(this.state.difficulty) ||
    			(this.state.difficulty<1 || this.state.difficulty>10)){    			
					this.setState({difficultyErrorMessage:'must be (1.0-10.0).'})
					this.setState({submitDisabled:true})
				}else{
					this.setState({difficultyErrorMessage:''})	
				}  		
    	}
    	if (utilities.isEmptyOrSpaces(this.state.video)){
			this.setState({submitDisabled:true})
		}else{
			if (utilities.isValidVideoURL(this.state.video)){
				this.setState({videoErrorMessage:''})
			}else{
				this.setState({videoErrorMessage:'Not a valid URL.'})
				this.setState({submitDisabled:true})				
			}
		}
		let timesAreValid = true
		let startSeconds
		let endSeconds
		if (!utilities.isEmptyOrSpaces(this.state.videoStartTime) &&
			!utilities.isValidTime(this.state.videoStartTime)){
			timesAreValid = false
		}else{
			startSeconds = utilities.formatSeconds(this.state.videoStartTime)
		}
		
		if (!utilities.isEmptyOrSpaces(this.state.videoEndTime) &&
			!utilities.isValidTime(this.state.videoEndTime)){
			timesAreValid = false
		}else{
			endSeconds = utilities.formatSeconds(this.state.videoEndTime)
		}
		if(utilities.isEmptyOrSpaces(this.state.videoStartTime)){
			startSeconds = 1
		}
		if(utilities.isEmptyOrSpaces(this.state.videoEndTime)){
			endSeconds = 999999
		}			
		if(timesAreValid && startSeconds<endSeconds){
			this.setState({videoTimeErrorMessage:''})
		}else{
			this.setState({videoTimeErrorMessage:'Invalid timestamps.'})
			this.setState({submitDisabled:true})			
		}
    }

    toggleShowTimeInputs=()=>{
    	this.setState({showTimeInputs:!this.state.showTimeInputs})
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
				return item['id'];
			});
			var related = this.state.related.map(function(item) {
				return item['id'];
			});	
			var postreqs = this.state.postreqs.map(function(item) {
				return item['id'];
			});			
			const suffix = "("+this.state.num+"b)"
			const date = new Date()
			const name = this.state.name.charAt(0).toUpperCase()+this.state.name.slice(1)+suffix
			let videoStartTime = null
			if (!utilities.isEmptyOrSpaces(this.state.videoStartTime)){
				videoStartTime = utilities.formatSeconds(this.state.videoStartTime)
			}
			let videoEndTime = null
			if (!utilities.isEmptyOrSpaces(this.state.videoEndTime)){
				videoEndTime = utilities.formatSeconds(this.state.videoEndTime)
			}
			let tutorialURL = this.state.url
			if (this.state.url && !this.state.url.includes('https://')){
				tutorialURL = 'https://' + tutorialURL
			}
			const trick = {
				name : name,
				num : this.state.num,
				difficulty : this.state.difficulty,
				url : tutorialURL,
				contributor : authStore.user.username, 
				video : this.state.video,
				videoStartTime: videoStartTime,
				videoEndTime: videoEndTime,
				siteswap :  this.state.siteswap,
				prereqs : prereqs,
				related : related,
				dependents: postreqs,
				tags : tags,
				timeUpdated : date.getTime(),
				explanation : this.state.explanation,
			}
			if(uiStore.editingDetailTrick){
				alert(trick.name+" edited!")
				trick["timeSubmitted"] = this.state.timeSubmitted
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
		this.setState({url : ""})
		this.setState({video : ""})
		this.setState({siteswap : ""})
		this.setState({prereqs : []})
		this.setState({related : []})
		this.setState({postreqs : []})
		this.setState({tags : []})
		this.setState({submitDisabled : false})
		this.setState({numErrorMessage : ""})
		this.setState({difficultyErrorMessage : ""})
		this.setState({explanation : ""})
	}
	setAutoCompletedName=(name)=>{
		this.setState({
			name : name,
			autoCompletedName : true
		})
	}
	 onNameInputKeyPress=(target)=> {
	    // If enter pressed
	    if(target.charCode===13){  
			this.setState({
				autoCompletedName : true
			})
	    }
	}

	render (){

		let patternsObj = Object.keys(store.library).map((pattern) => {
		  return {
		  	size: null,
		    id: pattern,
		    text: store.library[pattern].name,
		  }
		})
		const tagInput = <ReactTags
							  classNames={{tagInputField: 'addTrickReactTags',}}
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
		const prereqsInput = <ReactTags
			                      classNames={{tagInputField: 'addTrickReactTags',}}
						          autofocus = {false}
						          placeholder = ''
						          inputFieldPosition="bottom"
						          tags={this.state.prereqs}
						          minQueryLength={1}
						          suggestions={patternsObj}
						          delimiters={delimiters}
						          handleDelete={this.handlePrereqDelete}
						          handleAddition={this.handlePrereqAddition}
						          handleTagClick={this.handlePrereqClick}
					          />
		const relatedInput = <ReactTags
								  classNames={{tagInputField: 'addTrickReactTags',}}
						          autofocus = {false}
						          style = {{width:"300px"}}
						          placeholder = ''
						          inputFieldPosition="bottom"
						          tags={this.state.related}
						          minQueryLength={1}
						          suggestions={patternsObj}
						          delimiters={delimiters}
						          handleDelete={this.handleRelatedDelete}
						          handleAddition={this.handleRelatedAddition}
						          handleTagClick={this.handleRelatedClick}
					          />
		const postreqsInput = <ReactTags
								  classNames={{tagInputField: 'addTrickReactTags',}}
						          autofocus = {false}
						          style = {{width:"300px"}}
						          placeholder = ''
						          inputFieldPosition="bottom"
						          tags={this.state.postreqs}
						          minQueryLength={1}
						          suggestions={patternsObj}
						          delimiters={delimiters}
						          handleDelete={this.handlePostreqDelete}
						          handleAddition={this.handlePostreqAddition}
						          handleTagClick={this.handlePostreqClick}
					          />
		const titleText = uiStore.editingDetailTrick ? "Edit Pattern" : "Add Pattern"
		const explanationInput = <textarea className="textarea" 
											onChange={this.handleExplanationChange}/>
		const autoComplete = this.state.name && !this.state.autoCompletedName ? 
			<AutoComplete 
				setAutoCompletedName={this.setAutoCompletedName} 
				input={this.state.name}
			/> : null
		const toggleTimeInputsButton =
								<div>
									<label className="toggleShowTimeInputs" 
										onClick={()=>this.toggleShowTimeInputs()}>
										specify trick time range
									</label>
									<br/>
								</div>

		const form = 	
					<div className="form">
						<h3>{titleText}</h3>
						<div className="innerForm">
							<div className="inputContainer">
								<span className="redText">*</span>
								<span className="inputLabel">Trick name</span><br/>
								<span className="warning">{this.state.nameErrorMessage? this.state.nameErrorMessage:"\u00A0"}</span>
								<input className="formInputs" 
										onKeyPress={this.onNameInputKeyPress}
										value={this.state.name} 
										onChange={this.handleNameChange}
										onBlur={this.handleNameChange}/>
								{autoComplete}
							</div>
							<div className="videoInputContainer">
								<span className="redText">*</span>
								<span className="inputLabel">Instagram or Youtube Video</span>
								<span className="warning">{this.state.videoErrorMessage? this.state.videoErrorMessage:"\u00A0"}</span>
								<input className="formInputs" 
										value={this.state.video} 
										onBlur={this.handleVideoChange}
										onChange={this.handleVideoChange}
								/>
								{this.state.showTimeInputs?null:toggleTimeInputsButton}
								<br/>
							</div> 
	                        {this.state.showTimeInputs?
	                        	<div className="videoTimeInputsDiv">
									<span className="startTimeLabel">Start</span>
									<span>End</span><br/>
									<span className="timeWarning">
										{this.state.showTimeInputs && this.state.videoTimeErrorMessage? this.state.videoTimeErrorMessage:"\u00A0"}
									</span>
									<input className="timeInput" 
											placeholder="mm:ss"
											value={this.state.videoStartTime} 
											onBlur={this.handleStartTimeChange}
											onChange={this.handleStartTimeChange}
									/>															
									<input className="timeInput"
											placeholder="mm:ss"
											value={this.state.videoEndTime} 
											onBlur={this.handleEndTimeChange}
											onChange={this.handleEndTimeChange}
									/><br/><br/><br/>								
								</div>:null}
							<div className="smallInputsDiv">
								<div className="inputContainer1">
									<span className="redText">*</span>
									<span className="inputLabel">Number of balls</span>
									<span className="warning">{this.state.numErrorMessage? this.state.numErrorMessage:"\u00A0"}</span>							
									<input className="smallInput" 
											value={this.state.num} 
											onBlur={this.handleNumChange}
											onChange={this.handleNumChange}/>
								</div>
									<div className="inputContainer2">
									<span className="redText">*</span>
									<span className="inputLabel">Difficulty</span>
									<span className="warning">{this.state.difficultyErrorMessage? this.state.difficultyErrorMessage:"\u00A0"}</span>						
									<input className="smallInput" 
											value={this.state.difficulty} 
											onBlur={this.handleDiffChange}
											onChange={this.handleDiffChange}/>
								</div>
								<div className="inputContainer3">										
									<span className="inputLabel">Siteswap</span>	
									<span className="warning">{this.state.siteswapErrorMessage? this.state.siteswapErrorMessage:"\u00A0"}</span>													
									<input className="smallInput" 
											value={this.state.siteswap} 
											onBlur={this.handleSSChange}
											onChange={this.handleSSChange}
									/><br/><br/>
								</div>
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Tags</span><br/><br/>{tagInput}
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Prereqs</span><br/><br/>{prereqsInput}
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Related</span><br/><br/>{relatedInput}
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Postreqs</span><br/><br/>{postreqsInput}
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Tutorial URL</span>
								<span className="warning">{this.state.tutorialErrorMessage? this.state.tutorialErrorMessage:"\u00A0"}</span>
								<input className="formInputs" 
										value={this.state.url} 
										onBlur={this.handleTutorialChange}
										onChange={this.handleTutorialChange}/>
							</div>
							<div className="inputContainer">
								<span className="inputLabel">Explanation</span><br/><br/>
								{explanationInput}
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

