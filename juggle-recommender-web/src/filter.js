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
 		tags: [{ id: 'Common', text: 'Common' }],
      	suggestions: suggestions

	}
	this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
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

  onDifficultyRangeChange(position){
  	console.log('position',position)
  }
  numButtonClicked(element){
  	console.log('numButtonClicked'+element)
  }

render() {
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
				numButtons.push(
					<button key={'numButton' + element} onClick={()=>{this.numButtonClicked(element)}}>{element}</button>
)
				
	},this);


	
 	

	return (
		<div className="filterDiv">
				<button className="filterButton" onClick={()=>{filterStore.toggleFilterDiv()}}>
				X</button>
				<div className = "filterHeader">
					<h3>Tags:</h3>
				</div>				
				<div style={{zIndex:1}}>
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
			          handleTagClick={this.handleTagClick}
			        />
			    </div>
			    <ColoredLine/>
				<div className = "filterHeader">
					<h3>Number:</h3>
				</div>
				{numButtons}
				<ColoredLine/>
				<div className = "filterHeader">
					<h3>Difficulty:</h3>
					<div style={{zIndex:2,marginLeft:10, marginRight:10}}>
						<Range min={1} 
								max={10}
								defaultValue={[1,10]}
								onChange={(e)=>this.onDifficultyRangeChange(e)}
								railStyle={{backgroundColor: 'black', borderColor: 'black'}}
								trackStyle={{backgroundColor: 'black', borderColor: 'black'}}
								handleStyle={{backgroundColor: 'black', borderColor: 'black'}}
								dotStyle={{backgroundColor: 'black', borderColor: 'black'}}
								activeDotStyle={{backgroundColor: 'lightblue', borderColor: 'lightblue'}}
								handleStyle={{backgroundColor: 'black', borderColor: 'black'}} 
								marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10'}} 
								step={null} /><br/>
					</div>

				</div>
				<ColoredLine/>

			</div>
	)
  }
}

export default Filter



















