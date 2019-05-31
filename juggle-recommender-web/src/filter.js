import React,{Component} from 'react'
import store from './store'
import uiStore from './uiStore'
import filterStore from './filterStore'
import graphStore from './graphStore'
import { observer } from "mobx-react"
import './filter.css';
import './App.css';
import {TAGS} from './tags';
import { WithContext as ReactTags } from 'react-tag-input';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

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
class Filter extends Component {
 	state = {
	 	sortType: filterStore.sortType,
 		tags: filterStore.tags,
      	presetTags: presetTags,
      	numBalls: filterStore.numBalls,
      	difficultyRange: filterStore.difficultyRange
  	}
	      

	handleDelete=(i)=>{
		filterStore.setTags(
			filterStore.tags.filter((tag, index) => index !== i)
		)
	}

	handleAddition=(tag)=>{
		filterStore.setTags(
			 [...filterStore.tags, tag] 
		);
	}

	handleSortRadioButtonChange=(event)=>{
		filterStore.setSortType(event.target.value)
	}
  
	onDifficultyRangeChange=(range)=>{
		filterStore.setDifficultyRange(range)
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
	}

	render() {

	 	const ColoredLine = ()=>(
			   <hr
			        style={{
			            color: 'black',
			            backgroundColor: 'white',
			            sortType: 'alphabetical',
			            height: 2
			        }}
			   />
				
		 )

	 	const numbersOfBalls = ['3','4','5']
	 	const numButtons = [] 
		numbersOfBalls.forEach(function(element) {
			numButtons.push(
				<button className={filterStore.numBalls.includes(element)?
					'filterNumSelected':'filterNumUnselected'}
				key={'numButton' + element} 
				onClick={()=>{this.numButtonClicked(element)}}>{element}</button>
		)},this);	

		return (
			<div className="filterDiv">
				<button className="filterButton" onClick={()=>{filterStore.toggleFilterDiv()}}>
					X
				</button><br/>
				<div className = "filterHeader">
					<h3>Tags:</h3>
				</div>	
				<div>
			        <ReactTags
			          autofocus = {false}
			          inputFieldPosition="bottom"
			          tags={filterStore.tags}
			          minQueryLength={1}
			          suggestions={presetTags}
			          delimiters={delimiters}
			          handleDelete={this.handleDelete}
			          handleAddition={this.handleAddition}
			          handleTagClick={this.handleTagClick}/>
			    </div>
			    <ColoredLine/>
				<div className = "filterHeader">
					<h3>Number of balls:</h3>
				</div>
				{numButtons}
				<ColoredLine/>
				<div className = "filterHeader">
					<h3>Difficulty:</h3>
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
								marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10'}} 
								step={null} /><br/>
					</div>
				</div>
			</div>
		)
	  }
	}

export default Filter



















