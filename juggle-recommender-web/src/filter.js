import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import filterStore from './stores/filterStore'
import { observer } from "mobx-react"
import './filter.css';
import downArrow from './images/down-arrow.svg'
import './App.css';
import { WithContext as ReactTags } from 'react-tag-input';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import utilities from './utilities'
import shareIcon from './images/shareIcon.png'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'
import catchesIcon from './images/catchesIcon.svg'


const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

@observer
class Filter extends Component {
 	state = {
	 	sortType: filterStore.sortType,
 		tags: filterStore.tags,
      	presetTags: store.presetTags,
      	numBalls: filterStore.numBalls,
      	filter: filterStore.flair,
      	difficultyRange: filterStore.difficultyRange,
      	demoTypesTags: [
		   {size: null, id: 'All',          text: 'All',},
		   {size: null, id: 'User Video',   text: 'User Video',},
		   {size: null, id: 'Juggling Lab', text: 'Juggling Lab',},
		]
  	}
	handleAddition=(tag)=>{
 		let canAdd = true
 		filterStore.tags.forEach(function (arrayItem) {
		    if (arrayItem.id === tag.id){
		    	canAdd = false
		    }
		});
		if (store.tagsSuggestions.includes(tag.id) && canAdd){
			filterStore.setTags(
				 [...filterStore.tags, tag] 
			);
		}
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
 	
 	handleContributorTagAddition=(contributor)=>{
 		let canAdd = true
 		filterStore.contributors.forEach(function (arrayItem) {
		    if (arrayItem.id === contributor.id){
		    	canAdd = false
		    }
		});
		if (store.contributors.includes(contributor.id) && canAdd){
			filterStore.setContributors(
				 [...filterStore.contributors, contributor] 
			);
		}
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
 	}	

 	 handleDemoTypeTagAddition=(demoType)=>{
		filterStore.setDemoType(
			 [demoType] 
		);		
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
 	}									         
									          
	onDifficultyRangeChange=(range)=>{
		filterStore.setDifficultyRange(range)
		uiStore.resetSelectedTrick()
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
		uiStore.resetSelectedTrick()
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
		uiStore.resetSelectedTrick()
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
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
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
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
    copyFilterURL=()=>{
    	if (Object.keys(uiStore.rootTricks).length === 0){
    			alert("Unable to create share URL when no results found.") 
    			return
    		}
    	let urlText = "/?"
    	if (filterStore.contributors.length > 0){
			urlText = urlText + "contributor="    		
    		filterStore.contributors.forEach(contributor => {
	    		urlText = urlText + contributor.id + ","
			});
			urlText.slice(0, -1);
			urlText = urlText + "&"
    	}  
    	if (parseInt(filterStore.difficultyRange[0],10)!==1 || 
    		parseInt(filterStore.difficultyRange[1],10)!==10){
	    		urlText = urlText + "difficultyrange=" + 
	    			filterStore.difficultyRange[0] + "," + filterStore.difficultyRange[1] + "&"
    	}
    	if (filterStore.numBalls.length > 0){
			urlText = urlText + "numballs="    		
    		filterStore.numBalls.forEach(numball => {
	    		urlText = urlText + numball + ","
			});
			urlText.slice(0, -1);
			urlText = urlText + "&"
    	}
    	if (filterStore.flair.length > 0){
			urlText = urlText + "flair="    		
    		filterStore.flair.forEach(flairItem => {
	    		urlText = urlText + flairItem + ","
			});
			urlText.slice(0, -1);
			urlText = urlText + "&"
    	}
    	if (filterStore.tags.length > 0){
			urlText = urlText + "tags="   		
    		filterStore.tags.forEach(tag => {
	    		urlText = urlText + tag.id + ","
			});
			urlText.slice(0, -1);
			urlText = urlText + "&"
    	}
    	if (parseInt(filterStore.minCatches,10)>0 || 
    		parseInt(filterStore.maxCatches,10)<store.highestCatches){
	    		urlText = urlText + "catches=" + 
	    			filterStore.minCatches + "," + filterStore.maxCatches + "&"
    	}
    	if (filterStore.demoType.length > 0 && filterStore.demoType[0].id !== "All"){
			urlText = urlText + "demotype=" + filterStore.demoType[0].id.replace(" ","").toLowerCase() + "&"		
    	}

 		if (urlText !== "/?"){
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
	 	const tagSection =  <div>
		 						<div>
									<h3 className="filterHeader">Select Tags</h3>
								</div>	
								<div>
							        <ReactTags
							          autofocus = {false}
							          inputFieldPosition="bottom"
							          placeholder = ""
							          minQueryLength={0}
							          suggestions={store.presetTags.length>0?store.presetTags:[]}
							          delimiters={delimiters}
							          tags={filterStore.tags}
							          handleDelete={filterStore.handleDelete}
							          handleAddition={this.handleAddition}
							          handleTagClick={this.handleTagClick}/>
							    </div>
							</div>
		const contributorSection = 
				<div>
					<div>
						<h3 className="filterHeader">Contributors</h3>
					</div>	
					<div>
				        <ReactTags
				          autofocus = {false}
				          inputFieldPosition="bottom"
				          placeholder = ""
				          minQueryLength={0}
				          suggestions={store.contributorTags.length>0?store.contributorTags:[]}
				          delimiters={delimiters}
				          tags={filterStore.contributors}
				          handleDelete={filterStore.handleContributorTagDelete}
				          handleAddition={this.handleContributorTagAddition}
				          handleTagClick={this.handleContributorTagClick}/>
				    </div>
				</div>
	 	const numbersOfBalls = ['1','2','3','4','5','6','7','8','9','10','11']
	 	const numButtons = [] 
		numbersOfBalls.forEach(function(element) {
			numButtons.push(
				<button className={filterStore.numBalls.includes(element)?
					'filterNum filterNumSelected':'filterNum'}
				key={'numButton' + element} 
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
		                                  src={starIcon} 
		                                  className={filterStore.flair.includes('starred')?"starIconFilter selectedFlair":"starIconFilter" }
		                                  alt="starIcon" 
		                                  onClick={()=>{this.flairButtonClicked('starred')}}
		                            />
									<img id="babyButton" 
		                                  src={babyIcon} 
		                                  className={filterStore.flair.includes('baby')?"babyIconFilter selectedFlair":"babyIconFilter" }
		                                  alt="babyIcon" 
		                                  onClick={()=>{this.flairButtonClicked('baby')}}
		                            />
									<img id="ninjaButton" 
		                                  src={ninjaIcon} 
		                                  className={filterStore.flair.includes('ninja')?"ninjaIconFilter selectedFlair":"ninjaIconFilter" } 
		                                  alt="ninjaIcon" 
		                                  onClick={()=>{this.flairButtonClicked('ninja')}}
		                            />
		                            <img id="catchesButton" 
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
		const demoTypeSection = 
				<div>
					<div>
						<h3 className="filterHeader">Demo Type</h3>
					</div>	
					<div>
				        <ReactTags
				          autofocus = {false}
				          inputFieldPosition="bottom"
				          placeholder = ""
				          minQueryLength={0}
				          suggestions={this.state.demoTypesTags}
				          tags={filterStore.demoType}
				          delimiters={delimiters}
				          handleDelete={filterStore.handleDemoTypeDelete}
				          handleAddition={this.handleDemoTypeTagAddition}
				          handleTagClick={this.handleDemoTypeTagClick}/>
				    </div>
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
			                 title="share your contributed tricks"
			            />
		            </div>
				    {numSection}
					<ColoredLine/>
					{tagSection}
					<ColoredLine/>
					{contributorSection}
					<ColoredLine/>
					{demoTypeSection}
					<ColoredLine/>
					{flairSection}
					<ColoredLine/>
					{difficultySection}
					<ColoredLine/>
					{catchesSection}
					<br/>
				</div>
			</div>
		)
	  }
	}

export default Filter



















