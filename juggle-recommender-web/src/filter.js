import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import filterStore from './stores/filterStore'
import { observer } from "mobx-react"
import './filter.css';
import downArrow from './images/down-arrow.svg'
import './App.css';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import utilities from './utilities'
import shareIcon from './images/shareIcon.png'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'
import catchesIcon from './images/catchesIcon.svg'
import AutoComplete from './autoComplete'

@observer
class Filter extends Component {
 	state = {
	 	sortType: filterStore.sortType,
      	numBalls: filterStore.numBalls,
      	filter: filterStore.flair,
      	demoTypesTags: ['All', 'User Video','Juggling Lab'],
		tagInput:'',
		autoCompletedTag : false,
		contributorInput:'',
		autoCompletedContributor : false,
		demoTypeInput:'',
		autoCompleteddemoType : false,
  	}

									         
									          
	onDifficultyRangeChange=(range)=>{
		filterStore.setDifficultyRange(range)
		uiStore.updateRootTricks()
	}
	flairButtonClicked=(flair)=>{//TODO I just changed this to color up in state, need to keep doin that here
		let tempFlair = [...filterStore.flair]
		if (tempFlair.includes(flair)){
			for( var i = 0; i < tempFlair.length; i++){ 
				if ( tempFlair[i] === flair) {
				    tempFlair.splice(i, 1); 
				    i--;
			    }
			}
		}else{
			tempFlair.push(flair)
		}
		filterStore.setFlair(tempFlair)
		uiStore.updateRootTricks()
	}
	numButtonClicked=(element)=>{//TODO I just changed this to color up in state, need to keep doin that here
		let tempNumBalls = [...filterStore.numBalls]
		if (tempNumBalls.includes(element)){
			for( var i = 0; i < tempNumBalls.length; i++){ 
				if ( tempNumBalls[i] === element) {
				    tempNumBalls.splice(i, 1); 
				    i--;
			    }
			}
		}else{
			tempNumBalls.push(element)
		}
		filterStore.setNumBalls(tempNumBalls)
		uiStore.updateRootTricks()
	}

	handleMinCatchesChange=(e)=>{
		const inputElement = document.getElementById("minCatchesInput");
		let newMin = +e.target.value
		if (newMin > filterStore.maxCatches){
			newMin = filterStore.maxCatches
		}
		if(utilities.isEmptyOrSpaces(newMin)){
			newMin = 0
		}
		inputElement.value = newMin
		filterStore.setMinCatches(newMin)
	}

	handleMaxCatchesChange=(e)=>{
		const inputElement = document.getElementById("maxCatchesInput");
		let newMax = +e.target.value
		if (newMax < filterStore.minCatches){
			newMax = filterStore.minCatches
		}
		if(utilities.isEmptyOrSpaces(newMax)){
			newMax = Math.max(0,filterStore.minCatches)
		}
		inputElement.value = newMax
		filterStore.setMaxCatches(newMax)
	}

	workedOnPeriodClicked=(period)=>{
		if (filterStore.workedOnPeriod === period){
			filterStore.setWorkedOnPeriod(null)
		}else{
			filterStore.setWorkedOnPeriod(period)
			if (filterStore.workedOnValue === ''){
				filterStore.setWorkedOnValue('1')
			}
		}
	}

	handleWorkedOnValueChanged=(e)=>{
		filterStore.setWorkedOnValue(e.target.value)
	}

    copyFilterURL=()=>{
    	if (uiStore.rootTricks.length === 0){
    			alert("Unable to create share URL when no results found.") 
    			return
    		}
	    utilities.sendGA('filter','share')
	    const urlText = filterStore.getURLtext()

 		if (urlText !== "/filter/"){
 			//if not blank copy link
			const textField = document.createElement('textarea')
			const url = window.location.origin + urlText 
			textField.innerText = url
			document.body.appendChild(textField)
			var range = document.createRange();  
			range.selectNode(textField);  
			window.getSelection().addRange(range);  
			textField.select()
			document.execCommand('copy')
			textField.remove()

			alert("Link for your currently set filters copied to clipboard\n" + url)
		}else{
			alert("Set filters to share.")
		}
    } 

    setAutoCompletedTag=(suggestions, tagsList, tagType, tag)=>{
    	let currentFilterTags = []
		if (suggestions.includes(tag)){
	    	if(tagType === 'tags'){
				this.setState({
					autoCompletedTag : true,
					tagInput : ''
				})		
				currentFilterTags = filterStore.tags
			}else if(tagType === 'contributor'){
				this.setState({
					contributorInput: '',
					autoCompletedContributor : true
				})		
				currentFilterTags = filterStore.contributors
			}else if(tagType === 'demoType'){
				this.setState({
					demoTypeInput: '',
					autoCompletedDemoType : true
				})	
				currentFilterTags = filterStore.demoType
			}			
	    }
	    let canAdd = true
 		tagsList.forEach(function (arrayItem) {
		    if (arrayItem === tag){
		    	canAdd = false
		    }
		});
		if (suggestions.includes(tag) && canAdd){
			filterStore.setTags(
				tagType, [...currentFilterTags, tag] 
			);
		}
		uiStore.updateRootTricks()
	}

    handleTagChange=(tagType, e)=>{
    	if(tagType === 'tags'){
			this.setState({
				tagInput:e.target.value,
				autoCompletedTag : false
			})		
		}else if(tagType === 'contributor'){
			this.setState({
				contributorInput:e.target.value,
				autoCompletedContributor : false
			})		
		}else if(tagType === 'demoType'){
			this.setState({
				demoTypeInput:e.target.value,
				autoCompletedDemoType : false
			})	
		}
	}


	onTagInputKeyPress=(tagType, target)=> {
	    // If enter pressed
	    if(target.charCode===13){  
		    if(tagType === 'tags'){
		    	if (uiStore.autocompleteMatchedNames.length === 1){
			    	this.setAutoCompletedTag(store.tagsSuggestions,
											filterStore.tags,
											'tags',
											uiStore.autocompleteMatchedNames[0])
					this.setState({
						autoCompletedTag : true
					})
				}
			}else if(tagType === 'contributor'){
		    	if (uiStore.autocompleteMatchedNames.length === 1){
			    	this.setAutoCompletedTag(store.contributorTags,
											filterStore.contributors,
											'contributor',
											uiStore.autocompleteMatchedNames[0])
					this.setState({
						autoCompletedContributor : true
					})
				}
			}
	    }
	}


	render() {
	 	const ColoredLine = ()=>(
			   <hr
			        style={{
			            color: 'lightgray',
			            backgroundColor: 'lightgray',
			            height: 1
			        }}
			   />				
		 )
		const autoCompleteTags = this.state.tagInput && !this.state.autoCompletedTag ? 
			<AutoComplete 
				optionsListType = 'tags'
				optionsList = {store.tagsSuggestions}
				setAutoCompletedName={(tag)=>this.setAutoCompletedTag(store.tagsSuggestions,
																filterStore.tags,
																'tags',
																tag)} 
				input={this.state.tagInput}
			/>:null


		let addedTags = []
		if(filterStore.tags.length>0){
		        filterStore.tags.forEach((tag)=>{
		        	addedTags.push(
		                <div className="addedRelatedTricksDiv"
		                		  key = {{tag} + " filter"}
		                >
		                  <span className="mainTagsName"
		                        onClick={()=>{filterStore.removeTag('tags',tag)}}>{tag}</span>
		                  <label className="mainTagsX"
		                  		onClick={()=>{filterStore.removeTag('tags',tag)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }


		let tagSection =	<div className="inputContainer">
		 						<div>
									<h3 className="filterHeader">Select Tags</h3>
								</div>	
								{addedTags}
								<input className="formInputs" 
										onKeyPress={(e)=>this.onTagInputKeyPress('tags',e)}
										value={this.state.tagInput} 
										onChange={(e)=>this.handleTagChange('tags',e)}
										onBlur={this.handleOnBlurTag}
								/>
								{autoCompleteTags}
							</div>

		const autoCompleteContributor = this.state.contributorInput && 
										!this.state.autoCompletedContributor ? 
					<AutoComplete 
						optionsListType = 'tags'
						optionsList = {store.contributorTags}
						setAutoCompletedName={(contributor)=>this.setAutoCompletedTag(store.contributorTags,
																		filterStore.contributors,
																		'contributor',
																		contributor)} 
						input={this.state.contributorInput}
					/>:null

		let addedContributors = []
		if(filterStore.contributors.length>0){
		        filterStore.contributors.forEach((tag)=>{
		        	addedContributors.push(
		                <div className="addedRelatedTricksDiv"
		                		  key = {{tag} + " filter"}
		                >
		                  <span className="mainTagsName"
		                        onClick={()=>{filterStore.removeTag('contributor',tag)}}>{tag}</span>
		                  <label className="mainTagsX"
		                  		onClick={()=>{filterStore.removeTag('contributor',tag)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }


		let contributorSection =<div className="inputContainer">
			 						<div>
										<h3 className="filterHeader">Contributors</h3>
									</div>	
									{addedContributors}
									<input className="formInputs" 
											onKeyPress={(e)=>this.onTagInputKeyPress('contributor',e)}
											value={this.state.contributorInput} 
											onChange={(e)=>this.handleTagChange('contributor',e)}
											onBlur={this.handleOnBlurTag}
									/>
									{autoCompleteContributor}
								</div>

		const autoCompleteDemoType = this.state.demoTypeInput && 
										!this.state.autoCompletedDemoType ? 
					<AutoComplete 
						optionsListType = 'tags'
						optionsList = {this.state.demoTypesTags}
						setAutoCompletedName={(demoType)=>this.setAutoCompletedTag(this.state.demoTypesTags,
																		filterStore.demoType,
																		'demoType',
																		demoType)} 
						input={this.state.demoTypeInput}
					/>:null

		let addedDemoTypes = []
		if(filterStore.demoType.length>0){
		        filterStore.demoType.forEach((tag)=>{
		        	addedDemoTypes.push(
		                <div className="addedRelatedTricksDiv"
		                		  key = {{tag} + " filter"}
		                >

		                  <span className="mainTagsName"
		                        onClick={()=>{filterStore.removeTag('demoType',tag)}}>{tag}</span>
		                  <label className="mainTagsX"
		                  		onClick={()=>{filterStore.removeTag('demoType',tag)}}> x </label>
		                </div>  						        		
		        	)
		        });
		    }


		let demoTypeSection =<div className="inputContainer">
			 						<div>
										<h3 className="filterHeader">Demo Types</h3>
									</div>	
									{addedDemoTypes}
									<input className="formInputs" 
											onKeyPress={(e)=>this.onTagInputKeyPress('demoType',e)}
											value={this.state.demoTypeInput} 
											onChange={(e)=>this.handleTagChange('demoType',e)}
											onBlur={this.handleOnBlurTag}
									/>
									{autoCompleteDemoType}
								</div>

	 	const numbersOfBalls = ['1','2','3','4','5','6','7','8','9','10','11']
	 	const numButtons = [] 
		numbersOfBalls.forEach(function(element) {
			numButtons.push(
				<button className={filterStore.numBalls.includes(element)?
					'filterNum filterNumSelected':'filterNum'}
				key={element} 
				onClick={()=>{this.numButtonClicked(element)}}>{element}</button>
		)},this);	
		const numSection = <div>
								<div>
									<h3 className="filterHeader">Number of balls</h3>
								</div>
								{numButtons}
							</div>
		const flairSection =<div>
								<h3 className="filterHeader">Flair</h3>
								<div style={{marginLeft:10, marginRight:10}}>
									<img id="starButton" 
										  title="Star flair: Special list"
		                                  src={starIcon} 
		                                  className={filterStore.flair.includes('starred')?"starIconFilter selectedFlair":"starIconFilter" }
		                                  alt="starIcon" 
		                                  onClick={()=>{this.flairButtonClicked('starred')}}
		                            />
									<img id="babyButton" 
										  title="Baby flair: You're learning"
		                                  src={babyIcon} 
		                                  className={filterStore.flair.includes('baby')?"babyIconFilter selectedFlair":"babyIconFilter" }
		                                  alt="babyIcon" 
		                                  onClick={()=>{this.flairButtonClicked('baby')}}
		                            />
									<img id="ninjaButton" 
										  title="Ninja flair: You're experienced"
		                                  src={ninjaIcon} 
		                                  className={filterStore.flair.includes('ninja')?"ninjaIconFilter selectedFlair":"ninjaIconFilter" } 
		                                  alt="ninjaIcon" 
		                                  onClick={()=>{this.flairButtonClicked('ninja')}}
		                            />
		                            <img id="catchesButton" 
		                                  title="Catches flair: You've logged catches"
		                                  src={catchesIcon} 
		                                  className={filterStore.flair.includes('catches')?"catchesIconFilter selectedFlair":"catchesIconFilter" } 
		                                  alt="catchesIcon" 
		                                  onClick={()=>{this.flairButtonClicked('catches')}}
		                            />											
								</div>
							</div>
	
		const difficultySection =<div>
									<h3 className="filterHeader">Difficulty</h3>
									<div style={{marginLeft:10, marginRight:10}}>
										<Range min={1} 
												max={10}
												defaultValue={filterStore.difficultyRange}
												onChange={(e)=>this.onDifficultyRangeChange(e)}
												railStyle={{backgroundColor: 'darkgray', borderColor: 'darkgray'}}
												trackStyle={{backgroundColor: 'gray', borderColor: 'gray'}}
												handleStyle={{backgroundColor: 'lightgray', borderColor: 'lightgray'}}
												dotStyle={{backgroundColor: 'lightgray', borderColor: 'lightgray'}}
												activeDotStyle={{backgroundColor: 'lightblue', borderColor: 'lightblue'}}
												marks={{ 1: '1', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '10'}} 
												step={null} /><br/>
									</div>
								</div>

		let workedOnPeriods = ['Day','Week','Month']
		let workedOnPeriodsPlural = false
		if (filterStore.workedOnValue !== '1' &&
			filterStore.workedOnValue !== '' ){
			workedOnPeriodsPlural = true
		}
	 	const workedOnPeriodsButtons = [] 
		workedOnPeriods.forEach(function(element) {
			workedOnPeriodsButtons.push(
				<button className={filterStore.workedOnPeriod === element?
					'filterWorkedOnPeriod filterWorkedOnPeriodSelected':'filterWorkedOnPeriod'}
				key={element} 
				onClick={()=>{this.workedOnPeriodClicked(element)}}>{element}{workedOnPeriodsPlural?'s':''}</button>
		)},this);

		const workedOnDatesSection =  <div>
										<div>
											<h3 className="filterHeader">Last Practiced</h3>
										</div>
										<input className="filterWorkedOnInput" 
												type = "number"
												id = "filterWorkedOnInput"
												min = {1}
												max = {999} 
												disabled = {filterStore.workedOnPeriod === null}
												value={filterStore.workedOnValue} 
												onChange={(e)=>this.handleWorkedOnValueChanged(e)}/>
										{workedOnPeriodsButtons}
									</div>	


		const catchesSection = <div>
									<h3 className="filterHeader">Catches</h3>
									<span>Min</span>
									<input className="catchesInput" 
											type = "number"
											id = "minCatchesInput"
											min = {0}
											max = {filterStore.maxCatches} 
											value={filterStore.minCatches} 
											onChange={(e)=>this.handleMinCatchesChange(e)}/>
									<span>Max</span>
									<input className="catchesInput" 
											id = "maxCatchesInput"
											min = {filterStore.minCatches}
											type = "number" 
											value={filterStore.maxCatches} 
											onChange={(e)=>this.handleMaxCatchesChange(e)}
									/>
								</div>

		const hasTutorialSection = 	 
							<div>
								<div>
									<h3 className="filterHeader">Has a tutorial</h3>
								</div>
								<button className={filterStore.hasTutorialSelected?
									'filterHasTutorial filterHasTutorialSelected':'filterHasTutorial'}
								key='hasTutorialButton' 
								onClick={()=>{filterStore.toggleHasTutorialSelected()}}></button>
							</div>

		return (
			<div className="outerFilterDiv">
	        	<div className="filterDiv">
	        		<div className="headerButtons">
			            <img id="backButton" 
			            	 src={downArrow} 
			            	 className="backButtonFilter rotatedNegative90" 
			            	 alt="backIcon" 
		             		 onClick={()=>{uiStore.toggleFilterDiv()}}/>
		             	<label className="backButtonLabel" 
		             		   onClick={()=>{uiStore.toggleFilterDiv()}}>Back
		             	</label>
		             	<img 
			                 className="shareFilterButton"
			                 src={shareIcon}
			                 onClick={()=>this.copyFilterURL()}
			                 alt=""
			                 title="share this set of filters"
			            />
		            </div>
				    {numSection}
					<ColoredLine/>
					{tagSection}
					<ColoredLine/>
					{difficultySection}
					<ColoredLine/>
					{contributorSection}
					<ColoredLine/>
					{demoTypeSection}
					<ColoredLine/>
					{workedOnDatesSection}
					<ColoredLine/>
					{catchesSection}
					<ColoredLine/>
					{flairSection}
					<ColoredLine/>
					{hasTutorialSection}
					<ColoredLine/>
					<label className="filterSubmitButton" 
		             	   onClick={()=>{uiStore.toggleFilterDiv()}}>Submit
		            </label>
				</div>
			</div>
		)
	  }
	}

export default Filter



















