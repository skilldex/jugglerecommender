import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import graphStore from './stores/graphStore'
import { observer } from "mobx-react"
import legendImg from './images/greenToRedFade.jpg'
import downArrow from './images/down-arrow.svg'
import Demo from './demo'
import MainTagsBar from "./mainTagsBar"
import './trickList.css';
import './App.css';
//import { Resizable } from "re-resizable";

var scrollerPosition = 0

@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
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
	//todo make time check to set begining message from no search found to loading

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
		const detailTrick = {...store.library[trickKey]}
		detailTrick.x = 400
		detailTrick.y = 400
		detailTrick.id = trickKey
		uiStore.setDetailTrick(detailTrick)	
	}

	expandCard=(trickKey)=> {
		this.props.tricksToList.forEach((trickKeyOfCurrentlyExpanded)=>{
			const element = document.getElementById(trickKeyOfCurrentlyExpanded+"expandedCard");
			if(trickKeyOfCurrentlyExpanded!==trickKey &&
				element.className === "expandedCard expand"){
				if(uiStore.selectedTrick !== trickKeyOfCurrentlyExpanded){
					this.showDemoAfterAnimationTimer = setTimeout(()=>{
						uiStore.toggleSelectedTrick(trickKeyOfCurrentlyExpanded)
					}, 1000)
				}else{
					uiStore.toggleSelectedTrick(trickKeyOfCurrentlyExpanded)
				}
	  		console.log('element',element)
	  		element.classList.toggle("expand");
			}
		});
		if(uiStore.selectedTrick !== trickKey){
			this.showDemoAfterAnimationTimer = setTimeout(()=>{
				uiStore.toggleSelectedTrick(trickKey)
			}, 1000)
		}else{
			uiStore.toggleSelectedTrick(trickKey)
		}		
  		const element = document.getElementById(trickKey+"expandedCard");
  		console.log('element',element)
  		element.classList.toggle("expand");
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
					<div className="expandedCard" id={trickKey+"expandedCard"}>
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
									onClick={()=>{this.expandCard(trickKey)}}
									src={downArrow}
								/>	 		
							</div>
						</div>
						{expandedSection}	
					</div>				
				</div>	
			)
		})	
		const date = new Date()
		const currentTime = date.getTime()
		const list =
			<div  
				id='trickList' 
				className={tricks.length > 1 ? "listSection" : ""}
				onScroll = {this.recordScrollerPosition}
			>
				{tricks.length > 0 ? tricks: 
					<div className="noResultsDiv">
						{store.startTime+10000<currentTime? "No results found" : "Loading tricks"}
					</div>
				}
			</div>

		return (
			<div>
				<MainTagsBar/>
				<div className= "listDiv">	
					{list}				
				</div>
			</div>
		)
	}
}
export default TrickList