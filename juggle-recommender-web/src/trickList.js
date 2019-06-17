import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import filterStore from './stores/filterStore'
import graphStore from './stores/graphStore'
import { observer } from "mobx-react"
import legendImg from './images/greenToRedFade.jpg'
import sortIconSelected from './images/sortIconSelected.png'
import sortIconUnselected from './images/sortIconUnselected.png'
import starIcon from './images/starIcon.svg'
import allIcon from './images/allIcon.svg'
import './trickList.css';
import './App.css';
import Filter from './filter.js'

var scrollerPosition = 0
var mouseOverSort = true
@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
			listIsMinimized: false,
			showSortMenu : false,
			listScrollerPosition : 0
	}

	sortOptionClicked=(type)=>{
		filterStore.setSortType(type)
	}
	sortDirectionClicked=(direction)=>{
		filterStore.setSortDirection(direction)
	}
	toggleShowSort=()=>{
		this.setState({showSortMenu:!this.state.showSortMenu})
	}

	recordScrollerPosition = e => {
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
		//this.setState({showSortMenu:false})					
	}

	componentDidUpdate=(prevProps, prevState, snapshot)=> {
		if (!prevState.listIsMinimized && uiStore.listExpanded){
		  this.setScrollerPositions()
		}
	}
mouseEnterSortDiv=()=>{
	mouseOverSort = true
}

mouseLeaveSortDiv=()=>{
	mouseOverSort = false
}

render() {
	//"this" gets redefined in window.onclick so use "that"
	const that = this
	window.onclick = function(event) {
 	 	if (event.srcElement['alt'] !== 'showSortMenu' && that.state.showSortMenu) {
 	 		if (!mouseOverSort){
 	 			that.toggleShowSort()
 	 		}
 		}
 	}
 	const sortDropdown = this.state.showSortMenu ? 
 					<div onMouseEnter = {()=>this.mouseEnterSortDiv()}
 						 onMouseLeave = {()=>this.mouseLeaveSortDiv()}
 					     title="sort" 
 						 alt="showSortMenu" 
 						 id="myDropdown" 
 						 className="sortDropdown">
				    	<button alt="sortDropdownButtonDif"
				    			className={filterStore.sortType === 'difficulty' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortOptionClicked('difficulty')}>Pattern Difficulty</button>
				    	<button alt="sortDropdownButtonAlph"
				    			className={filterStore.sortType === 'alphabetical' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortOptionClicked('alphabetical')}>Alphabetically</button>
					    <button alt="sortDropdownButtonTimeSubmitted"
				    			className={filterStore.sortType === 'timeSubmitted' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortOptionClicked('timeSubmitted')}>Date Submitted</button>
				    	<button alt="sortDropdownButtonCatches"
				    			className={filterStore.sortType === 'catches' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortOptionClicked('catches')}>Number of Catches</button>	    			
				    	<button alt="sortDropdownButtonLastUpdated"
				    			className={filterStore.sortType === 'lastUpdated' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortOptionClicked('lastUpdated')}>Catches Last Updated</button>
					    <hr className="divdingLine"/>
					    <button alt="sortDropdownButtonCatches"
				    			className={filterStore.sortDirection === 'ascending' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortDirectionClicked('ascending')}>Ascending</button>	    			
				    	<button alt="sortDropdownButtonLastUpdated"
				    			className={filterStore.sortDirection === 'descending' ?
				    			"sortDropdownButton  sortDropdownButtonSelected" :
				    			"sortDropdownButton "}
				    			onClick={(e)=>this.sortDirectionClicked('descending')}>Descending</button>
					  </div> : null

	const sort = <img src={this.state.showSortMenu? sortIconSelected:sortIconUnselected} className="filterButton"  alt="showSortMenu" 
					 onClick={this.toggleShowSort}/>
 	let tricks = []
 	const rootTricks = uiStore.rootTricks
 	if(Object.keys(store.library).length > 0){
	 	
		for (var i = 0; i < rootTricks.length; i++) {
			const trick = store.library[rootTricks[i]]
			const trickKey = rootTricks[i]
			var cardClass='listCard'
			if(this.props.selectedTricks && this.props.selectedTricks.includes(trickKey)){
				cardClass = cardClass + ' selectedListCard'
			}
			const cardColor = 
				graphStore.getInvolvedNodeColor(trick.difficulty, 2).background === "white" ? 
				graphStore.getInvolvedNodeColor(trick.difficulty, 2).border :
			 	graphStore.getInvolvedNodeColor(trick.difficulty, 2).background 					
			tricks.push(
				<div onClick={()=>{uiStore.toggleSelectedTrick(trickKey)}} 
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
	let myTricksButtonClass = uiStore.selectedList === "myTricks" ? 
						 				"selectedListButton" :"unselectedListButton" 
		myTricksButtonClass = myTricksButtonClass + " listButton"
	let allTricksButtonClass = uiStore.selectedList === "allTricks" ? 
						 				"selectedListButton" :"unselectedListButton" 
		allTricksButtonClass = allTricksButtonClass + " listButton"
 	const listExpandCollapseButton = 
			 					<div >
								 	<label className="listExpandCollapseButton"
											onClick={this.setListExpanded}>
											{uiStore.listExpanded ? "-" : "+"}</label><br/><br/>
						 		</div>
	const minimizedList = 
					<div className="minimizedListDiv">
				 		<span className="expandText">click to expand</span>					
					 	<label className="minimizedListButton"
								onClick={this.setListExpanded}>
								{uiStore.listExpanded ? "-" : "+"}</label><br/><br/>
					</div>

	const maximizedList =
					<div>
					 	{listExpandCollapseButton}
					 	<div className="listButtonDiv">
				 			<img className={myTricksButtonClass}
				 				src={starIcon}
								onClick={()=>{uiStore.setSelectedList("myTricks")}}
				 				alt=""
				 			/>
				 			<img className={allTricksButtonClass}
					 				src={allIcon} 
									onClick={()=>{uiStore.setSelectedList("allTricks")}}
					 			alt=""/>
						</div>
						
			 			<div className="search" >			 				
			 				<input className="searchInput" 
			 						value={uiStore.searchInput}
			 						onChange={uiStore.searchInputChange}/>
							{sort}
							
						</div>

					 	<button className="addTrickButton" onClick={uiStore.toggleAddingTrick}>+ Add Pattern</button>
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

					</div>
	return (
		<div>	
			<div className= {uiStore.listExpanded ? "listDiv" : ""}>		
		 		{uiStore.listExpanded ? maximizedList : minimizedList}
			</div>
			{filterStore.filterVisible?
			<Filter/>
			: null}
			{sortDropdown}
		</div>
	)
  }
}
export default TrickList