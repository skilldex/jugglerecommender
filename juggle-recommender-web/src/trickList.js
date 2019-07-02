import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import graphStore from './stores/graphStore'
import { observer } from "mobx-react"
import legendImg from './images/greenToRedFade.jpg'
import './trickList.css';
import './App.css';
//import { Resizable } from "re-resizable";

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
	clickTrick=(trickKey)=>{
		if(uiStore.selectedTrick === trickKey && uiStore.popupTrick === null){
			const popupTrick = {...store.library[trickKey]}
			popupTrick.x = 400
			popupTrick.y = 400
			popupTrick.id = trickKey
			uiStore.setPopupTrick(popupTrick)
		}else{
			uiStore.toggleSelectedTrick(trickKey)
			uiStore.updateRootTricks()
			if (uiStore.selectedTrick === null){
				uiStore.setPopupTrick(null)
			}else{
				const popupTrick = {...store.library[trickKey]}
				popupTrick.x = 400
				popupTrick.y = 400
				popupTrick.id = trickKey
				uiStore.setPopupTrick(popupTrick)
			} 
		}			
	}
	openPopup=(trickKey)=>{
		console.log('uiStore.selectedTrick',uiStore.selectedTrick)
		const popupTrick = {...store.library[trickKey]}
		popupTrick.x = 400
		popupTrick.y = 400
		popupTrick.id = trickKey
		uiStore.setPopupTrick(popupTrick)		
	}

	render() {
	 	let tricks = []
	 	const rootTricks = uiStore.rootTricks
	 	if(Object.keys(store.library).length > 0){		 	
			for (var i = 0; i < rootTricks.length; i++) {
				const trick = store.library[rootTricks[i]]
				const trickKey = rootTricks[i]
				var cardClass='listCard'
				const tags = trick && trick.tags ? trick.tags.sort().map((tag,i)=>{
                    if(i < trick.tags.length-1){
                      return <span>{tag + ","}</span>
                    }else{
                      return <span>{tag}</span>
                    }
                  }) : null
				const cardColor = 
					graphStore.getInvolvedNodeColor(trick.difficulty, 2).background === "white" ? 
					graphStore.getInvolvedNodeColor(trick.difficulty, 2).border :
				 	graphStore.getInvolvedNodeColor(trick.difficulty, 2).background 
				tricks.push(
					<div className={cardClass} 
						 key={trickKey + "div"} 
						 style={{backgroundColor: cardClass === 'listCard' ? cardColor : 
							graphStore.getSelectedInvolvedNodeColor(trick.difficulty, 2).background}}>
						 <div className = "topRow">	
							 {store.myTricks[trickKey] ? 
							 <button className="addAndRemoveMyTricksButtonList" 
								 		onClick={(e)=>{store.removeFromMyTricks(trickKey);
								 		e.stopPropagation()}}>&#9733;</button> :
							 <button className="addAndRemoveMyTricksButtonList" 
							 		onClick={(e)=>{store.addToMyTricks(trickKey);
							 		e.stopPropagation()}}>&#9734;</button>}
							 <span className="listCardName" 
								  onClick={(e)=>{this.openPopup(trickKey)}}
								  title={trick.name}>{trick.name}</span>
							 {this.props.selectedTrick && this.props.selectedTrick === trickKey ? 
							 <button className="selectTrickButton" 
								 		onClick={(e)=>{uiStore.toggleSelectedTrick(trickKey);
								 		e.stopPropagation()}}>-</button> :
							 <button className="selectTrickButton" 
							 		onClick={(e)=>{uiStore.toggleSelectedTrick(trickKey);
							 		e.stopPropagation()}}>+</button>}<br/>
						</div>
						{uiStore.selectedTrick === trickKey ?
						null :
						<div className = "bottomRow">	
							<span className="bottomRowTags">
								Tags: {tags}
							</span>	
							<span className="bottomRowSS">
								SS: {trick.siteswap}
							</span>	
						</div>}				
					</div>	
				)	
			}
		}
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
			<div
				className= {uiStore.listExpanded ? "listDiv" : ""}
				
			>	
			 		{uiStore.listExpanded ? maximizedList : minimizedList}
				
			</div>
		)
	  }
}
export default TrickList