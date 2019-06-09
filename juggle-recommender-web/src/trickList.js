import React,{Component} from 'react'
import store from './store'
import uiStore from './uiStore'
import filterStore from './filterStore'
import graphStore from './graphStore'
import { observer } from "mobx-react"
import legendImg from './greenToRedFade.jpg'
import sortIcon from './sortIcon.png'
import filterIcon from './filterIcon.png'
import './trickList.css';
import './App.css';
import {TAGS} from './tags';
import { WithContext as ReactTags } from 'react-tag-input';
import Filter from './filter.js'

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
var scrollerPosition = 0
@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
			listIsMinimized: false,
			showSortMenu : false,
			listScrollerPosition : 0
	}

	sortOptionClicked=(type)=>{
		console.log('type',type)
		filterStore.setSortType(type)
		this.toggleShowSort()
	}

	toggleShowSort=()=>{
		this.setState({showSortMenu:!this.state.showSortMenu})
	}

	recordScrollerPosition = e => {
	    let element = e.target
	    scrollerPosition = document.getElementById('trickList').scrollTop
 	}

  	setScrollerPositions=()=> {
 		const scrollPos = scrollerPosition
	    function setPositions() {
	    	if (document.getElementById('trickList')){
				document.getElementById('trickList').scrollTop = scrollPos  		
			}
		}
	    setTimeout(function() {
	        setPositions();
	    }, 100);		
	}

	setListExpanded=()=>{
		if (uiStore.listExpanded){
			uiStore.setListExpanded(!uiStore.listExpanded)
		}else{
			uiStore.setListExpanded(!uiStore.listExpanded)
		}	
		this.setState({showSortMenu:false})					
	}

	componentDidUpdate=(prevProps, prevState, snapshot)=> {
		if (!prevState.listIsMinimized && uiStore.listExpanded){
		  this.setScrollerPositions()
		}
	}



render() {

	//"this" gets redefined in window.onclick so use "that"
	const that = this
	window.onclick = function(event) {
 	 	if (event.srcElement['alt'] !== 'showSortMenu' && that.state.showSortMenu) {
 	 		that.toggleShowSort()
 		}
 	}
	const { tags, suggestions } = this.state;
 	const sortDropdown = this.state.showSortMenu ? 
 					<div title="sort" id="myDropdown" className="sortDropdown">
				    	<button alt="sortDropdownButtonDif"
				    			className="sortDropdownButtonDif" 
				    			onClick={(e)=>this.sortOptionClicked('difficulty')}>Difficulty</button>
				    	<button alt="sortDropdownButtonAlph"
				    			className="sortDropdownButtonAlph" 
				    			onClick={(e)=>this.sortOptionClicked('alphabetical')}>A->Z</button>
					  </div> : null

	const sort = <img src={sortIcon} className="filterButton"  alt="showSortMenu" 
					 onClick={this.toggleShowSort}/>

	const filter = <img className="filterButton" src={filterIcon} alt="showFilterMenu" 
					 onClick={()=>{filterStore.toggleFilterDiv()}}/>					 

	let filterTags = []
	let filterSection = null
	if(filterStore.tags){		
		filterStore.tags.forEach((tag,i)=>{
			filterTags.push(
						<div className="listTagsDiv">
							<span className="listTagsName">&nbsp;{filterStore.tags[i].text}</span>
							<label className="listTagsX"onClick={()=>filterStore.handleDelete(i)}>&nbsp;x&nbsp;</label>
						</div>			
			)
		})
		 filterSection = <div>
		 					<label className="listTagsHeader">TAGS:&nbsp;</label>	{filterTags}
		 				</div>
	}
 	let tricks = []
 	const rootTricks = uiStore.rootTricks
 	if(Object.keys(store.library).length > 0){
	 	
		for (var i = 0; i < rootTricks.length; i++) {
			const trick = store.library[rootTricks[i]]
			const trickKey = rootTricks[i]
			var cardClass='listCard'
			if(this.props.selectedTricks && this.props.selectedTricks.includes(trickKey)){
				cardClass = 'selectedListCard'
			}
			const cardColor = 
				graphStore.getInvolvedNodeColor(trick.difficulty, 2).background == "white" ? 
				graphStore.getInvolvedNodeColor(trick.difficulty, 2).border :
			 	graphStore.getInvolvedNodeColor(trick.difficulty, 2).background 					
			tricks.push(
				<div onClick={()=>{uiStore.selectTricks([trickKey])}} 
					className={cardClass} 
					key={trickKey + "div"} 
					style={{backgroundColor: cardClass === 'listCard' ? cardColor : 
						graphStore.getSelectedInvolvedNodeColor(trick.difficulty, 2).background}}>
					 {store.myTricks[trickKey] ? 
						 <button className="addAndRemoveMyTricksButton" 
						 		onClick={(e)=>{store.removeFromMyTricks(trickKey);
						 		e.stopPropagation()}}>&#9733;</button> :
					 <button className="addAndRemoveMyTricksButton" 
					 		onClick={(e)=>{store.addToMyTricks(trickKey);
					 		e.stopPropagation()}}>&#9734;</button>}
					 <span className="listCardName" title={trick.name}>{trick.name}</span>			
				</div>
			)	
		}

	}
 	const buttons = <div>
					 	<label className="listExpandCollapseButton"
								onClick={this.setListExpanded}>{uiStore.listExpanded ? "-" : "+"}</label><br/><br/>
				 		<div className="listButtonDiv">
							<button className={uiStore.selectedList === "myTricks" ? 
									"selectedListButton" : "unselectedListButton" } 
									onClick={()=>{uiStore.setSelectedList("myTricks")}}>
									★Starred</button>
							<button className={uiStore.selectedList === "allTricks" ?
								 "selectedListButton" : "unselectedListButton" } 
								 onClick={()=>{uiStore.setSelectedList("allTricks")}}>
								 All</button>
						</div>
			 			<div className="search" >
			 				{filterSection}<br/>
			 				<input onChange={uiStore.searchInputChange}/>
				 			{filter}
							{sort}
							{sortDropdown}
						</div>
						<button className="addTrickButton" onClick={uiStore.toggleAddingTrick}>+ Add Trick</button>
			 		</div>
	return (
		<div>	
			<div className="listDiv">		
		 		{uiStore.listExpanded ? 

					<div>
					 	{buttons}
						<div style={{height:"100%"}}>
							<label style={{float:"left"}}>easy</label>
							<label style={{float:"right", paddingRight:"5px"}}>hard</label>
							<img style={{}}src={legendImg} alt="legendImg" width="97%"/>						
							<br></br>							
							<div id='trickList' 
								className={tricks.length > 1 ? "listSection" : ""}
								onScroll = {this.recordScrollerPosition}> 
							{tricks}
							</div>						
						</div>
					</div> : 
					buttons}
			</div>
			{filterStore.filterVisible?
			<Filter/>
			: null}
		</div>
	)
  }
}
export default TrickList