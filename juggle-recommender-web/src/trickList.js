import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import filterStore from './stores/filterStore'
import graphStore from './stores/graphStore'
import { observer } from "mobx-react"
import legendImg from './images/greenToRedFade.jpg'
import starIcon from './images/starIcon.svg'
import allIcon from './images/allIcon.svg'
import './trickList.css';
import './App.css';
import Filter from './filter.js'

var scrollerPosition = 0

@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
			listIsMinimized: false,
			listScrollerPosition : 0
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


render() {
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
			
		</div>
	)
  }
}
export default TrickList