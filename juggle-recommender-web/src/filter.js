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
      	difficultyRange: filterStore.difficultyRange
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

	handleMinCatchesChange=(e)=>{
		let newMin = e.target.value
		if (newMin > filterStore.maxCatches){
			newMin = filterStore.maxCatches
		}
		if(utilities.isEmptyOrSpaces(newMin)){
			newMin = 0
		}
		filterStore.setMinCatches(newMin)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	handleMaxCatchesChange=(e)=>{
		let newMax = e.target.value
		if (newMax < filterStore.minCatches){
			newMax = filterStore.minCatches
		}
		if(utilities.isEmptyOrSpaces(newMax)){
			newMax = Math.max(0,filterStore.minCatches)
		}
		filterStore.setMaxCatches(newMax)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
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
							          minQueryLength={1}
							          suggestions={store.presetTags}
							          delimiters={delimiters}
							          handleDelete={filterStore.handleDelete}
							          handleAddition={this.handleAddition}
							          handleTagClick={this.handleTagClick}/>
							    </div>
							</div>
		const contributorSection = <div>
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
					'filterNum':'filterNum filterNumUnselected'}
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
		return (
			<div className="filterDiv">
				<button className="closeFilter" onClick={()=>{filterStore.toggleFilterDiv()}}>
					X
				</button><br/>
				{tagSection}
				<ColoredLine/>
				{contributorSection}
			    <ColoredLine/>
			    {numSection}
				<ColoredLine/>
				{difficultySection}
				<ColoredLine/>
				{catchesSection}


			</div>
		)
	  }
	}

export default Filter



















