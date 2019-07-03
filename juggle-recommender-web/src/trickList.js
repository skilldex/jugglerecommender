import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import graphStore from './stores/graphStore'
import { observer } from "mobx-react"
import legendImg from './images/greenToRedFade.jpg'
import downArrow from './images/down-arrow.svg'
import Demo from './demo'
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
		if(uiStore.selectedTrick === trickKey && uiStore.detailTrick === null){
			const detailTrick = {...store.library[trickKey]}
			detailTrick.x = 400
			detailTrick.y = 400
			detailTrick.id = trickKey
			uiStore.setDetailTrick(detailTrick)
		}else{
			uiStore.toggleSelectedTrick(trickKey)
			uiStore.updateRootTricks()
			if (uiStore.selectedTrick === null){
				uiStore.setDetailTrick(null)
			}else{
				const detailTrick = {...store.library[trickKey]}
				detailTrick.x = 400
				detailTrick.y = 400
				detailTrick.id = trickKey
				uiStore.setDetailTrick(detailTrick)
			} 
		}			
	}
	openDetail=(trickKey)=>{
		console.log('uiStore.selectedTrick',uiStore.selectedTrick)
		const detailTrick = {...store.library[trickKey]}
		detailTrick.x = 400
		detailTrick.y = 400
		detailTrick.id = trickKey
		uiStore.setDetailTrick(detailTrick)	
	}
	
							
	render() {
	 	let tricks = []
		this.props.tricksToList.forEach((trickKey)=>{
			
			let trick = store.library[trickKey]
			if(!trick){
				trickKey = trickKey.replace(/ /g, "")
				trickKey = trickKey.replace(/-/g, "")
				trickKey = trickKey.replace(/'/g, "")
				trick = store.library[trickKey]
				if(!trick){
					console.log(trickKey)
					return
				}
			}
			//if trick is null at this point then it is becasue trickKey is actually 
			//	the name of a trick from library of juggling
			var cardClass='listCard'
			const tags = trick && trick.tags ? trick.tags.slice().sort().map((tag,i)=>{
                if(i < trick.tags.length-1){
                  return <span>{tag + ","}</span>
                }else{
                  return <span>{tag}</span>
                }
              }) : null

			const expandedSection = uiStore.selectedTrick === trickKey ?
				<div className = "expandedSection">
					<Demo
						trickKey = {trickKey}
						demoLocation="expandedSection"
					/>
				</div>:null
			const expandTrickButtonClass =  
				uiStore.selectedTrick === trickKey ?  "expandTrickButton"  :  "expandTrickButton" + " rotated90"
			tricks.push(
				<div className={cardClass} 
					 key={trickKey + "div"} 
				>
					<div className="mainCard">
						 <div className = "cardInfo">	
							 <div className="listCardName" 
								  onClick={(e)=>{this.openDetail(trickKey)}}
								  title={trick.name}>{trick.name}
							</div>
							 
							<div className="bottomRowText difficultyValue">Difficulty: {trick.difficulty}</div>	
							<div className="bottomRowText tags">
								Tags: {tags}
							</div>	
							
						</div>
						<div class="expandButtonDiv">
							<img 
								className={expandTrickButtonClass}
								onClick={()=>{uiStore.toggleSelectedTrick(trickKey)}}
								src={downArrow}
							/>	 		
						</div>
					</div>
					{expandedSection}					
				</div>	
			)
		})	
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
							<div  
								id='trickList' 
								className={tricks.length > 1 ? "listSection" : ""}
								onScroll = {this.recordScrollerPosition}
							>
								{tricks.length > 0 ? tricks : 
									<div className="noResultsDiv" >No results found</div>
								}
							</div>

		return (
			<div className= {uiStore.listExpanded ? "listDiv" : ""}>	
				{uiStore.listExpanded ? maximizedList : minimizedList}				
			</div>
		)
	}
}
export default TrickList