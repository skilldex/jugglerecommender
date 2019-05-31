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

const suggestions = TAGS.map((tag) => {
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
      	suggestions: suggestions,
      	numBalls: filterStore.numberOfBalls,
      	difficultyRange: filterStore.difficultyRange
  	}
	      

	handleDelete=(i)=>{
		const { tags } = this.state;
		this.setState({
			tags: tags.filter((tag, index) => index !== i),
		});
	}

	handleAddition=(tag)=>{
		this.setState(state => ({ tags: [...state.tags, tag] }));
	}

	handleDrag=(tag, currPos, newPos)=> {
		const tags = [...this.state.tags];
		const newTags = tags.slice();
		newTags.splice(currPos, 1);
		newTags.splice(newPos, 0, tag);
		this.setState({ tags: newTags });
	}

	handleTagClick=(index)=> {
		console.log('The tag at index ' + index + ' was clicked');
	}

	handleSortRadioButtonChange=(event)=>{
		this.setState({sortType: event.target.value});
	}
  
	onDifficultyRangeChange=(range)=>{
		this.setState({difficultyRange: range});
	}

	numButtonClicked=(element)=>{//TODO I just changed this to color up in state, need to keep doin that here
		let tempNumBalls = [...this.state.numBalls]
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
		this.setState({numBalls: tempNumBalls})
	}

	filterApplyList=()=>{
		filterStore.setSortType(this.state.sortType)
		filterStore.setDifficultyRange(this.state.difficultyRange)
		filterStore.setNumberOfBalls(this.state.numBalls)
		//filterStore.setTags(tagsArray)
		filterStore.setTags(this.state.tags)
		filterStore.toggleFilterDiv()
		uiStore.updateRootTricks()
	}

	render() {
		// const Checkbox = props => (
		//   <input type="checkbox" {...props} />
		// )
		const { tags, suggestions } = this.state;

	 	const ColoredLine = () => (
	    <hr
	        style={{
	            color: 'black',
	            backgroundColor: 'white',
	            sortType: 'alphabetical',
	            height: 2
	        }}
	    />
	);
	 			//NEXT: can maybe use the stuff above to set the store. sort menu current state, like 
	 			//	how showSortMenu does it, but  alittle different

	 	const numbersOfBalls = ['3','4','5']
	 	const numButtons = [] 
		numbersOfBalls.forEach(function(element) {
			numButtons.push(
				<button className={this.state.numBalls.includes(element)?
					'filterNumSelected':'filterNumUnselected'}
				key={'numButton' + element} 
				onClick={()=>{this.numButtonClicked(element)}}>{element}</button>
	)},this);	

		return (
			<div className="filterDiv">
				<button className="filterButton" onClick={()=>{filterStore.toggleFilterDiv()}}>
				X</button><br/>
				<div className = "filterHeader">
					<h3>Tags:</h3>
				</div>	
				<div>
			        <ReactTags
			          autofocus = {false}
			          inputFieldPosition="bottom"
			          tags={tags}
			          minQueryLength={0}
			          suggestions={suggestions}
			          delimiters={delimiters}
			          handleDelete={this.handleDelete}
			          handleAddition={this.handleAddition}
			          handleDrag={this.handleDrag}
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
				<ColoredLine/>
				<div className = "filterHeader">
					<h3>Sort:</h3><br/>
						{<ul className = 'sortRadioButtons'>
				            <input
				              type="radio"
				              value="alphabetical"
				              checked={this.state.sortType === "alphabetical"}
				              onChange={this.handleSortRadioButtonChange}/>
				            <div className = "sortRadioButtonsLabel">
				            	<label>A->Z</label>
				            </div><br/>
					        <input
				              type="radio"
				              value="difficulty"
				              checked={this.state.sortType === "difficulty"}
				              onChange={this.handleSortRadioButtonChange}/>
				            <div className = "sortRadioButtonsLabel">
					        	<label>Difficulty</label>
					        </div>
			          	</ul>}
				</div><br/>
				<button className='filterApplyButton'
						onClick={()=>{this.filterApplyList()}}>Apply to list</button>
			</div>
		)
	  }
	}

export default Filter



















