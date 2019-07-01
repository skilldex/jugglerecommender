import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import filterStore from './stores/filterStore'
import { observer } from "mobx-react"
import './filter.css';
import './App.css';
import { WithContext as ReactTags } from 'react-tag-input';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import utilities from './utilities'
import closeIcon from './images/closeIcon.svg'
import Toggle from 'react-toggle'


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

 	 handleDemoTypeTagAddition=(demoTypeToAdd)=>{
 	 	if (filterStore.DemoType !== demoTypeToAdd.id){
 	 		filterStore.setDemoType(demoTypeToAdd.id)
 	 		uiStore.resetSelectedTrick()
			uiStore.updateRootTricks()
 	 	}

 	}									         
									          
	onDifficultyRangeChange=(range)=>{
		filterStore.setDifficultyRange(range)
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

	associationButtonClicked=(element)=>{
		let tempAssociations = [...filterStore.associations]
		if (tempAssociations.includes(element)){
			for( var i = 0; i < tempAssociations.length; i++){ 
				if ( tempAssociations[i] === element) {
				    tempAssociations.splice(i, 1); 
				    i--;
			    }
			}
		}else{
			tempAssociations.push(element)
		}
		filterStore.setAssociations(tempAssociations)
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

	mouseEnterFilterDiv=()=>{
      uiStore.setMouseInFilterDiv(true)
    }

    mouseLeaveFilterDiv=()=>{
      uiStore.setMouseInFilterDiv(false)
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
							          suggestions={store.presetTags}
							          delimiters={delimiters}
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
				          suggestions={store.contributorTags}
				          delimiters={delimiters}
				          handleDelete={filterStore.handleContributorTagDelete}
				          handleAddition={this.handleContributorTagAddition}
				          handleTagClick={this.handleContributorTagClick}/>
				    </div>
				</div>
	 	const numbersOfBalls = ['3','4','5','6','7']
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
				          delimiters={delimiters}
				          handleDelete={filterStore.handleDemoTypeTagDelete}
				          handleAddition={this.handleDemoTypeTagAddition}
				          handleTagClick={this.handleDemoTypeTagClick}/>
				    </div>
				</div>
	 	const associations = ['prereqs','postreqs','related']
	 	const associationButtons = [] 
		associations.forEach(function(element) {
			associationButtons.push(
				<button className={filterStore.associations.includes(element)?
					'relationshipButton relationshipButtonSelected':'relationshipButton'}
				key={'relationshipButton' + element} 
				onClick={()=>{this.associationButtonClicked(element)}}>{element}</button>
		)},this);	
		const associationSection =  <div>
										<div>
											<h3 className="filterHeader">Graph relationships</h3>
										</div>
										{associationButtons}
									</div>
		return (
			<div className="filterDiv"
				 onMouseEnter = {()=>this.mouseEnterFilterDiv()}
	             onMouseLeave = {()=>this.mouseLeaveFilterDiv()}
	        >
	            <img id="closeButton" src={closeIcon} className="closeFilter" alt="closeIcon" 
             		onClick={()=>{uiStore.toggleFilterDiv()}}
        		/><br/>
				{associationSection}
			    <ColoredLine/>
			    {numSection}
				<ColoredLine/>
				{tagSection}
				<ColoredLine/>
				{contributorSection}
				<ColoredLine/>
				{demoTypeSection}
				<ColoredLine/>
				{difficultySection}
				<ColoredLine/>
				{catchesSection}
				<br/>
			</div>
		)
	  }
	}

export default Filter



















