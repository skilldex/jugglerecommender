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

const suggestions = TAGS.map((country) => {
  return {
  	size: null,
    id: country,
    text: country
  }
})

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

@observer
class Filter extends Component {
  constructor(props) {
    super(props);

	 	this.state = {
	 	sortType: 'alphabetical',
 		tags: [{ id: 'Common', text: 'Common' }],
      	suggestions: suggestions,
      	filterNumberSelected: {'3':true,
						      '4':false,
						      '5':false,
      	}

	}
	this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
    this.handleSortRadioButtonChange = this.handleSortRadioButtonChange.bind(this);
}


handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
   this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index) {
    console.log('The tag at index ' + index + ' was clicked');
  }

  handleRequireAllCheckboxChange(checked){

  }

handleSortRadioButtonChange(event){
  this.setState({
    size: event.target.value
  });
		console.log(this.state.size)
}
  
  onDifficultyRangeChange(position){
  	console.log('position',position)
  }

  numButtonClicked(element){//TODO I just changed this to color up in state, need to keep doin that here
  	console.log('thisElement',this.state.filterNumberSelected[element])
  	let filtNumSelected = {...this.state.filterNumberSelected};
  	filtNumSelected[element] = !filtNumSelected[element]
  	this.setState({filterNumberSelected: filtNumSelected})
  }

  filterApplyList(){

  }

  filterApplyGraph(){

  }

render() {
	// const Checkbox = props => (
	//   <input type="checkbox" {...props} />
	// )
	const { tags, suggestions } = this.state;
 	 window.onclick = function(event) {
 	 	if (event.srcElement['alt'] !== 'showSortMenu') {
 	 		if (document.getElementById("myDropdown")){
 				if (document.getElementById("myDropdown").classList.contains('show')){
 					uiStore.toggleSortTypeShow()
 				}
 			}
 		}
 	}
 	const ColoredLine = () => (
    <hr
        style={{
            color: 'black',
            backgroundColor: 'white',
            height: 2
        }}
    />
);
 			//NEXT: can maybe use the stuff above to set the store. sort menu current state, like 
 			//	how showSortMenu does it, but  alittle different

 	const numbersOfBalls = ['3','4','5']
 	const numButtons = []
 
	numbersOfBalls.forEach(function(element) {
				numButtons.push(//TODO figure out how to use this 
					//conditional to determine the color of the buttons
					//maybe their background as well
					<button className={this.state.filterNumberSelected[element]?
						'filterNumSelected':'filterNumUnselected'}
					key={'numButton' + element} 
					onClick={()=>{this.numButtonClicked(element)}}>{element}</button>
)
				
	},this);


	
 	

	return (
		<div className="filterDiv">
			<button className="filterButton" onClick={()=>{filterStore.toggleFilterDiv()}}>
			X</button><br/>
			<div className='tagsCheckBox'>	
				<input style={{float:'right',position:'absolute'}}
						type="checkbox" 							
						onChange={this.handleRequireAllCheckboxChange} 
						defaultChecked={this.state.checked}/>
				<div className ="tagsCheckBoxLabel">
					<p style={{fontSize:"10px"}}>(require all)</p>	
				</div>
			</div>
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
							defaultValue={[1,10]}
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
			              checked={this.state.size === "alphabetical"}
			              onChange={this.handleSortRadioButtonChange}/>
			            <div className = "sortRadioButtonsLabel">
			            	<label>A->Z</label>
			            </div><br/>
				        <input
			              type="radio"
			              value="difficulty"
			              checked={this.state.size === "difficulty"}
			              onChange={this.handleSortRadioButtonChange}/>
			            <div className = "sortRadioButtonsLabel">
				        	<label>Difficulty</label>
				        </div>
		          	</ul>}
			</div><br/>
			<button className='filterApplyButton'
					onClick={()=>{this.filterApplyList()}}>Apply to list</button>
			<button className='filterApplyButton'
					onClick={()=>{this.filterApplyGraph()}}>Apply to list and graph</button>
		</div>
	)
  }
}

export default Filter



















