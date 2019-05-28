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

 	

	return (
		<div className="filterDiv">
				<button className="filterButton" onClick={()=>{filterStore.toggleFilterDiv()}}>
				X</button><br/><br/>
				<div className = "filterHeader">
					<h3>Tags:</h3>
				</div>				
				<div>
			        <ReactTags
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
				<ColoredLine/>
				<div className = "filterHeader">
					<h3>Difficulty:</h3>
				</div>
				<ColoredLine/>

			</div>
	)
  }
}

export default Filter



















