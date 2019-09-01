import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import store from "./stores/store"
import utilities from './utilities'
import AutoComplete from './autoComplete'
import Validate from './siteswapValidator'
import downArrow from './images/down-arrow.svg'
import SmallTrickList from './smallTrickList'

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
@observer
class AddTrickForm extends Component {
	state = {
		name : "",
		tagInput : "",
		num : "",
		difficulty : "",
		url : "",
		video : "",
		videoStartTime: "",
		videoEndTime: "",
		siteswap : "",
		contributor: null,
		gifUrl: null,
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
		autoCompletedTag : false,
		trickNameBeingEdited: "",
		showTimeInputs: false,
		explanation: '',
		gifUrl: null,
		views: 0,
		usersWithCatches: 0,
	}

	componentDidMount=()=>{
		if(authStore.user.username === "tjthejuggler" &&
			!uiStore.editingDetailTrick){
			document.getElementById('TJsContributorInput').value = store.TJsPreviouslyUsedContributor
		}else{
			this.setState({contributor: authStore.user.username})
		}
		uiStore.clearAddTrickSmallTrickLists()
		if(uiStore.editingDetailTrick){
			let trick = {...store.library[uiStore.detailTrick.id]}
			if (trick.name.endsWith("b)")){
				trick.name = trick.name.substr(0, trick.name.lastIndexOf("("))
				this.setState({name: trick.name})
			}
			if (trick.gifUrl){
				this.setState({gifUrl: trick.gifUrl})
			}
			this.setState({contributor: trick.contributor})
			this.setState({trickNameBeingEdited:trick.name})
			if(trick.explanation){
				this.setState({explanation: trick.explanation})
			}
			if(trick.views){
				this.setState({views: trick.views})
			}
			if(trick.usersWithCatches){
				this.setState({usersWithCatches: trick.usersWithCatches})
			}


			if (trick.prereqs){
				Object.keys(trick.prereqs).forEach((trickKey)=>{
					if (store.library[trickKey]){
						uiStore.addTrickToSmallTrickList(uiStore.addTrickFormPrereqs,
														store.library[trickKey].name)
					}
				});
			}
			if (trick.related){
				Object.keys(trick.related).forEach((trickKey)=>{
					if (store.library[trickKey]){
						uiStore.addTrickToSmallTrickList(uiStore.addTrickFormRelated,
														store.library[trickKey].name)
					}
				});
			}
			if (trick.dependents){
				Object.keys(trick.dependents).forEach((trickKey)=>{
					if (store.library[trickKey]){
						uiStore.addTrickToSmallTrickList(uiStore.addTrickFormPostreqs,
														store.library[trickKey].name)
					}
				});
			}


			if(trick.videoStartTime || trick.videoEndTime){
				this.setState({showTimeInputs : true})
			}			
			this.setState({...trick},this.checkIfFormIsSubmittable)
			this.setState({submitDisabled : false,})

			//this converts the tags from observable to plain arrays
			if(trick.tags){
				this.setState({tags:[]})
				trick.tags.forEach((tag)=>{
					this.setAutoCompletedTag(tag)
				});		
			
			}
		}	
	}
	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value,
			autoCompletedName : false
		})
		const siteswapValidityChecker = Validate(e.target.value)
		if (!this.state.gifUrl || 
			(this.state.gifUrl && !this.state.gifUrl.includes('library'))){
			if (siteswapValidityChecker === 'invalid'){
				this.setState({gifUrl: null})
				document.getElementById("numInput").disabled = false
		        const { tags } = this.state;
		        const i = tags.findIndex(x => x ==="pure-ss")
		        this.setState({
		         	tags: tags.filter((tag, index) => index !== i),
		        });
				document.getElementById("siteswapInput").disabled = false

			}
		}
		this.checkIfFormIsSubmittable()
	}

	handleExplanationChange=(e)=>{
		this.setState({
			explanation:e.target.value,
		})	
		this.checkIfFormIsSubmittable()	
	}
	handleOnBlurName=(e)=>{
		const wordsInName = e.target.value.split(" ")
		wordsInName.sort(function(a, b){
		  return b.length - a.length;
		});
		for (const name of wordsInName){
			if (!this.state.gifUrl || 
				(this.state.gifUrl && !this.state.gifUrl.includes('library'))){
				const siteswapValidityChecker = Validate(name)
				if (siteswapValidityChecker !== 'invalid' &&
					name.length > 1 &&
					/\d/.test(name)){
					this.setState({num : siteswapValidityChecker[0]})
					this.setState({siteswap : name})	
					if (wordsInName.length === 1){
						const dif = Math.round( siteswapValidityChecker[1] * 10 ) / 10
						this.setState({difficulty : dif})
						this.setState({gifUrl : 'https://jugglinglab.org/anim?'+name})
						document.getElementById("numInput").disabled = true
						document.getElementById("siteswapInput").disabled = true
				        const { tags } = this.state;
				        const i = tags.findIndex(x => x ==="pure-ss")
				    	if (i===-1 && !this.state.tags.includes("pure-ss")){
					        this.setState(state => ({ tags: [...state.tags, "pure-ss"] }));
					    }
					}
				break;
				}
			}
		}
		this.checkIfFormIsSubmittable()
	}

	handleNumChange=(e)=>{
		this.setState({
			num:e.target.value
		},this.checkIfFormIsSubmittable)
		
	}
	handleDiffChange=(e)=>{
		this.setState({
			difficulty:e.target.value
		}, this.checkIfFormIsSubmittable)
		
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
		if (utilities.isEmptyOrSpaces(e.target.value)){
			this.setState({siteswapErrorMessage:''})
			document.getElementById("numInput").disabled = false
		}else{
			const siteswapValidityChecker = Validate(e.target.value)
			if (siteswapValidityChecker === 'invalid'){
				this.setState({num : ''})
				document.getElementById("numInput").disabled = false
				this.setState({siteswapErrorMessage:'invalid siteswap.'})
				this.setState({submitDisabled:true})
			}else{
				this.setState({num : siteswapValidityChecker[0]})
				document.getElementById("numInput").disabled = true
				this.setState({siteswapErrorMessage:''})
			}
		}

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
			if((this.state.url.includes('http') && 
				this.state.url.includes('.')) ||
				this.state.gifUrl){
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
    	if (utilities.isEmptyOrSpaces(this.state.video) && !this.state.gifUrl){
			this.setState({submitDisabled:true})
		}else{
			if (utilities.isValidVideoURL(this.state.video) || this.state.gifUrl){
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
		this.setState({
		   	showTimeInputs:!this.state.showTimeInputs
			}, () => {
				if(this.state.showTimeInputs){
			    	document.getElementById('startTimeInput').focus()
			    }
		});
  	}

	submit=()=>{
		if (this.state.submitDisabled){
			document.getElementById("submitButton").focus();
		}
		if (!this.state.submitDisabled){
			var tags = this.state.tags
			let prereqs = {}
			let related = {}
			let postreqs = {}
			if(uiStore.editingDetailTrick){
				if (store.library[uiStore.detailTrick.id]['prereqs']){
					prereqs = store.library[uiStore.detailTrick.id]['prereqs']
				}
				if (store.library[uiStore.detailTrick.id]['related']){
					related = store.library[uiStore.detailTrick.id]['related']
				}
				if (store.library[uiStore.detailTrick.id]['dependents']){
					postreqs = store.library[uiStore.detailTrick.id]['dependents']
				}
			}

			uiStore.addTrickFormPrereqs.forEach((item)=>{
				const replacedItem = item.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
				if (!prereqs[replacedItem]){
					prereqs[replacedItem] = { source : "contributed" }
				}
			});
			uiStore.addTrickFormRelated.forEach((item)=>{
				const replacedItem = item.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
				if (!related[replacedItem]){
					related[replacedItem] = { source : "contributed" }
				}
			});
			uiStore.addTrickFormPostreqs.forEach((item)=>{
				const replacedItem = item.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
				if (!postreqs[replacedItem]){
					postreqs[replacedItem] = { source : "contributed" }
				}
			});

			let suffix = ""
			if (this.state.num.toString() !== "3"){
				suffix = "("+this.state.num+"b)"
			}
			const date = new Date()
			const name = this.state.name.charAt(0).toUpperCase()+this.state.name.slice(1)+suffix
			let videoStartTime = null
			if (!utilities.isEmptyOrSpaces(this.state.videoStartTime)){
				videoStartTime = utilities.formatSeconds(this.state.videoStartTime)
			}
			let videoEndTime = null
			if (!utilities.isEmptyOrSpaces(this.state.videoEndTime)){
				if (utilities.isEmptyOrSpaces(this.state.videoStartTime)){
					videoStartTime = 0
				}
				videoEndTime = utilities.formatSeconds(this.state.videoEndTime)
			}
			let tutorialURL = this.state.url
			if (this.state.url && !this.state.url.includes('http')){
				tutorialURL = 'https://' + tutorialURL
			}
			const trick = {
				name : name,
				num : this.state.num,
				difficulty : this.state.difficulty,
				url : tutorialURL,
				gifUrl : this.state.gifUrl,
				contributor : this.state.contributor, 
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
				views : this.state.views,
				usersWithCatches : this.state.usersWithCatches,
			}
			if(!this.state.contributor){
				delete trick.contributor
			}//if I leave contributor blank, it uses my name
			if(authStore.user.username === "tjthejuggler" && 
				document.getElementById('TJsContributorInput').value !== ''){
				//if I put something in, it use that name
				trick['contributor'] = document.getElementById('TJsContributorInput').value
				store.setTJsPreviouslyUsedContributor(trick['contributor'])
				//if i put in loj it uses no name which defaults to Library Of Juggling
				if(document.getElementById('TJsContributorInput').value == 'loj'){
					delete trick.contributor
				}
			}
			if(uiStore.editingDetailTrick){
				alert(trick.name+" edited!")
				trick["timeSubmitted"] = this.state.timeSubmitted
			}else{
				alert(trick.name+" added!")
				trick["timeSubmitted"] = date.getTime()
			}
			Object.keys(trick).forEach(key => trick[key] === undefined ? delete trick[key] : '')
			store.addTrickToDatabase(trick)
			this.clearState()
		}
	}
	

	cancel=()=>{
		uiStore.handleBackButtonClick()
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
	setAutoCompletedTag=(tag)=>{
		if (store.tagsSuggestions.includes(tag)){
	        this.setState(state => ({ tags: [...state.tags, tag] }));
	        this.checkIfFormIsSubmittable()
	        this.setState({
				autoCompletedTag : true,
				tagInput : ''
			})		
	    }
	}


    handleTagDelete=(tag)=>{
		var index = this.state.tags.indexOf(tag);
		let newTagList = this.state.tags
		if (index > -1) {
		  newTagList.splice(index, 1);
		}
		this.setState({tags:newTagList})
    }

    handleTagChange=(e)=>{
		this.setState({
			tagInput:e.target.value,
			autoCompletedTag : false
		})		
	}

    onNameInputKeyPress=(target)=> {
	    // If enter pressed
	    if(target.charCode===13){  
			this.setState({
				autoCompletedName : true
			})
			this.checkIfFormIsSubmittable()
	    }
	}
	 onTagInputKeyPress=(target)=> {
	    // If enter pressed
	    if(target.charCode===13){  
			this.setState({
				autoCompletedTag : true
			})
			this.checkIfFormIsSubmittable()
	    }
	}

	render (){
	    const backButton = <div className = "backButtonSurroundingDivAddTrick">
		    					<img id="backButton" 
		                            src={downArrow} 
		                            className="backButtonAddTrick rotatedNegative90" 
		                            alt="backIcon" 
		                            onClick={()=>{ uiStore.handleBackButtonClick()}}
		                        />
		                        <label className="backButtonAddTrickLabel" 
			             		   onClick={()=>{ uiStore.handleBackButtonClick()}}>Back
			             		</label>
	                        </div>
		let patternsObj = Object.keys(store.library).map((pattern) => {
		  return {
		  	size: null,
		    id: pattern,
		    text: store.library[pattern].name,
		  }
		})
		const autoCompleteTags = this.state.tagInput && !this.state.autoCompletedTag ? 
			<AutoComplete 
				optionsListType = 'tags'
				optionsList = {store.tagsSuggestions}
				setAutoCompletedName={this.setAutoCompletedTag} 
				input={this.state.tagInput}
			/>:null
		const titleText = uiStore.editingDetailTrick ? "Edit Pattern" : "Add Pattern"
		const explanationInput = <textarea className="textarea" 
											value={this.state.explanation}
											onChange={this.handleExplanationChange}/>

		let addedTags = []
		if(this.state.tags.length>0){
		        this.state.tags.forEach((tag)=>{
		        	addedTags.push(
		                <div className="addedRelatedTricksDiv">
		                  <span className="mainTagsName"
		                        onClick={()=>{this.handleTagDelete(tag)}}>{tag}</span>
		                  <label className="mainTagsX"
		                  		onClick={()=>{this.handleTagDelete(tag)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }


		let tagsSection =	<div className="inputContainer">
								<div>
									<span className="inputLabel">Tags</span><br/>
								</div>
								<br/>
								{addedTags}
								<input className="formInputs" 
										onKeyPress={this.onTagInputKeyPress}
										value={this.state.tagInput} 
										onChange={this.handleTagChange}
										onBlur={this.handleOnBlurTag}
								/>
								{autoCompleteTags}
							</div>



		const autoCompleteName = this.state.name && !this.state.autoCompletedName ? 
			<AutoComplete 
				optionsListType = 'name'
				optionsList = {Object.keys(store.library)}
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

		const TJsContributorInput = <div className="inputContainer">
									<span className="inputLabel">Contributor</span><br/>
									<input className="formInputs" 
											id="TJsContributorInput"
											defaultValue={uiStore.editingDetailTrick?
													store.library[uiStore.detailTrick.id]['contributor']
													: ''}
									/>
								</div>

		let addedPrereqs = []
		if(uiStore.addTrickFormPrereqs.length>0){
		        uiStore.addTrickFormPrereqs.forEach((prereqName)=>{
		        	addedPrereqs.push(
		                <div className="addedRelatedTricksDiv">
		                  <label className="mainTagsName"
		                        onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormPrereqs,prereqName)}}>{prereqName}</label>
		                  <label className="mainTagsX"
		                  		onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormPrereqs,prereqName)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }

		let prereqsSmallTrickList = <div className="addRelationshipDiv">
										<div>
											<span className="inputLabel">Prereqs</span>
										</div>
										<br/>
										{addedPrereqs}
										<SmallTrickList 
											listType = {'prereqsAddTrick'}
											listOfTricks = {uiStore.addTrickFormPrereqs}
										/>
									</div>



		let addedRelated = []
		if(uiStore.addTrickFormRelated.length>0){
		        uiStore.addTrickFormRelated.forEach((relatedName)=>{
		        	addedRelated.push(
		                <div className="addedRelatedTricksDiv">
		                  <label className="mainTagsName"
		                        onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormRelated,relatedName)}}>{relatedName}</label>
		                  <label className="mainTagsX"
		                  		onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormRelated,relatedName)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }
		let relatedSmallTrickList = <div className="addRelationshipDiv">
										<div>
											<span className="inputLabel">Related</span>
										</div>
										<br/>
										{addedRelated}
										<SmallTrickList 
											listType = {'relatedAddTrick'}
											listOfTricks = {uiStore.addTrickFormRelated}
										/>
									</div>



		let addedPostreqs = []
		if(uiStore.addTrickFormPostreqs.length>0){
		        uiStore.addTrickFormPostreqs.forEach((postreqName)=>{
		        	addedPostreqs.push(
		                <div className="addedRelatedTricksDiv">
		                  <label className="mainTagsName"
		                        onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormPostreqs,postreqName)}}>{postreqName}</label>
		                  <label className="mainTagsX"
		                  		onClick={()=>{uiStore.removeTrickFromSmallTrickList(uiStore.addTrickFormPostreqs,postreqName)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }

		let postreqsSmallTrickList = <div className="addRelationshipDiv">
										<div>
											<span className="inputLabel">Postreqs</span>
										</div>
										<br/>
										{addedPostreqs}
										<SmallTrickList 
											listType = {'prereqsAddTrick'}
											listOfTricks = {uiStore.addTrickFormPostreqs}
										/>
									</div>

		const form = 	
					<div className="form">
						{backButton}
						<h3>{titleText}</h3>
						<div className="innerForm">
							{authStore.user.username === "tjthejuggler" ? TJsContributorInput:null}
							<div className="inputContainer">
								<span className="redText">*</span>
								<span className="inputLabel">Trick name</span><br/>
								<span className="warning">{this.state.nameErrorMessage? this.state.nameErrorMessage:"\u00A0"}</span>
								<input className="formInputs" 
										onKeyPress={this.onNameInputKeyPress}
										value={this.state.name} 
										onChange={this.handleNameChange}
										onBlur={this.handleOnBlurName}
								/>
								{autoCompleteName}
							</div>
							{this.state.gifUrl ?
								<div className="videoInputContainer">
									<span className="inputLabel">Juggling Lab URL</span>
									<input className="formInputsJugglingLab" 
										   value={this.state.gifUrl} 
										   disable = "true"
									/>
									<br/>
								</div>:null
							}
							<div className="videoInputContainer">
								{this.state.gifUrl ? null: <span className="redText">*</span>}
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
											id="startTimeInput"
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
								</div>:null
							}
							<div className="smallInputsDiv">
								<div className="inputContainer1">
									<span className="redText">*</span>
									<span className="inputLabel">Number of balls</span>
									<span className="warning">{this.state.numErrorMessage? this.state.numErrorMessage:"\u00A0"}</span>							
									<input className="smallInput" 
											id="numInput"
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
											id = "siteswapInput"
											value={this.state.siteswap} 
											onBlur={this.handleSSChange}
											onChange={this.handleSSChange}
									/><br/><br/>
								</div>
							</div>
							{tagsSection}
							{prereqsSmallTrickList}
							{relatedSmallTrickList}
							{postreqsSmallTrickList}
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

