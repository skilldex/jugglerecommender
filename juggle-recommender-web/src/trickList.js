import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import authStore from './stores/authStore'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import catchesIcon from './images/catchesIcon.svg'
import thumbsUpIcon from './images/thumbsUp.svg'
import thumbsDownIcon from './images/thumbsDown.svg'

import Demo from './demo'
import MainTagsBar from "./mainTagsBar"
import './trickList.css';
import './App.css';
import Gauge from 'react-svg-gauge';
import utilities from './utilities'
//import { Resizable } from "re-resizable";
import history from './history';
import InfiniteScroll from 'react-infinite-scroller';
const paginationSize = 10

@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
			expandDone : false,
			
	}
	componentDidMount=()=>{
		this.setScrollerPositions()
	}

  	setScrollerPositions=()=> {
  		const listType = this.props.listType
	    function setPositions() {
	    	if (document.getElementById('listDiv') && listType === "main"){
				document.getElementById('listDiv').scrollTop = uiStore.mainListScrollerPosition	
			}
		}
	    setTimeout(function() {
	        setPositions();
	    }, 100);		
	}

	openDetail=(trickKey)=>{
		utilities.sendGA('list ' + this.props.listType,'opened detail','list ' + this.props.listType + ' ' + trickKey)
		if (this.props.listType === "main"){
			uiStore.setMainListScrollerPosition(document.getElementById('listDiv').scrollTop)
		}
		utilities.openPage('detail/'+trickKey,true)
		window.scrollTo(0,0);
		if (document.getElementById('detailOuterDiv')){
    		document.getElementById('detailOuterDiv').scrollTop = 0
    	}    	
    	if (document.getElementById('detailDiv')){
	    	document.getElementById('detailDiv').scrollTop = 0
	    }
	    store.increaseViewsCounter()
	}

	expandCard=(trickKey)=> {
		//reset expand state if trick is already selected so next
		//expansion has correct state
		const previoslySelected = document.getElementById(uiStore.selectedTrick+"listCard");
		const element = document.getElementById(trickKey+"listCard");
		if(previoslySelected && previoslySelected !== element){
			previoslySelected.classList.toggle("expand");
		}
		element.classList.toggle("expand");
		uiStore.toggleSelectedTrick(trickKey)
		utilities.sendGA('list ' + this.props.listType,'expand','list ' + this.props.listType + ' ' + trickKey)
	}

	getHexColor=(value: number)=> {
	  let string = value.toString(16);
	  return (string.length === 1) ? '0' + string : string;
	}
							
	vote=(trickKey, direction)=>{
		if(authStore.user){
			const oppositeListType = this.props.listType == "related" ? "related" : 
									 this.props.listType == "prereqs" ? "dependents" :
												"prereqs"
			store.vote(uiStore.detailTrick.id , trickKey, this.props.listType, direction)
			store.vote(trickKey , uiStore.detailTrick.id, oppositeListType, direction)
		}else{
			alert("Please login to vote")
		}
	}
	checkIfVoted=(votes)=>{
		if(votes && authStore.user){
			const voted = votes.includes(authStore.user.username)
			return voted
		}else{
			return false
		}
		
	}
	render() {
	 	let tricks = []
	 	const pushedTrickkeys = []
	 	const detailTrick = uiStore.detailTrick ? store.library[uiStore.detailTrick.id] : null
	 	const listType = this.props.listType == "postreqs" ? "dependents" : this.props.listType
		this.props.tricksToList.forEach((trickKey, index)=>{
			if(!uiStore.detailTrick && index > paginationSize * uiStore.pageNumber){
				return
			}
			trickKey = trickKey.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
			if (!pushedTrickkeys.includes(trickKey)){
				let trick = store.library[trickKey]
				if(!trickKey){
					console.log("there is something wrong with the trickKey(before replaces) ",trickKey)
					return				
				}
				if(!trick){
					console.log("there is something wrong with the trickKey(after replaces) ",trickKey)
					trickKey = trickKey.replace(/ /g, "")
					trickKey = trickKey.replace(/-/g, "")
					trickKey = trickKey.replace(/'/g, "")
					trick = store.library[trickKey]
					if(!trick){
						return
					}
				}
				//if trick is null at this point then it is becasue trickKey is actually 
				//	the name of a trick from library of juggling
				const tags = trick && trick.tags ? trick.tags.slice().sort().map((tag,i)=>{
	                if(i < trick.tags.length-1){
	                  return <span key={tag}>{tag + ", "}</span>
	                }else{
	                  return <span key={tag}>{tag}</span>
	                }
	              }) : null

				const modifiedTrickDifficulty = 
					((trick.difficulty-filterStore.difficultyRange[0]) /
					(filterStore.difficultyRange[1]-filterStore.difficultyRange[0]))*10
				const r = Math.floor(modifiedTrickDifficulty >= 5? 255:(modifiedTrickDifficulty)* 51);
			    const g = Math.floor(modifiedTrickDifficulty <= 5? 255:255-(modifiedTrickDifficulty-5)* 51);
			    const b = 0;
			    const colorHex = '#' + this.getHexColor(r) + this.getHexColor(g) + this.getHexColor(b);
			    const difficultyGauge = <Gauge 
			    							valueLabelStyle ={{fontWeight:'none'}}
			    							style={{overflow:'auto'}} 
			    							color={colorHex}
			    							label=""
											min={filterStore.difficultyRange[0]-.1} max={filterStore.difficultyRange[1]}
											value={parseFloat(trick.difficulty).toFixed(1)} 
											width={50} height={44} 
										/>	
				const expandTrickButtonClass =  
					uiStore.selectedTrick === trickKey ?  "expandTrickButton"  :  "expandTrickButton rotated90"
				let listCardClass = this.props.listType == "main" ? "listCard" : "listCard detailListCard"
				listCardClass =  index == 0 && this.props.listType != "main" ? listCardClass + " topCard" : listCardClass
				let numUpvoters = 0
				let numDownvoters = 0
				if(detailTrick){
					numUpvoters = detailTrick[listType][trickKey].upvoters ? detailTrick[listType][trickKey].upvoters.length : 0
					numDownvoters = detailTrick[listType][trickKey].downvoters ? detailTrick[listType][trickKey].downvoters.length : 0
				}

				tricks.push(
					<div className= {listCardClass  }
						 key={trickKey + "div"} 
						 id={trickKey + "listCard"}
						 onClick={(e)=>{this.openDetail(trickKey)}}
					>	
						<div className="mainCard">
							<div 
									className="expandButtonDiv"
									onClick={
												(e)=>{
													e.stopPropagation()
													this.expandCard(trickKey)
												}
											}
									title = "show pattern demo"
								>
								<img alt=""
									className={expandTrickButtonClass}								
									src={downArrow}
								/>	 		
							</div>
							 <div className = "cardInfo">	
								<div className="listCardNameDiv" title={trick.name}>{trick.name}</div>
								<div className="bottomRow">
									<div className="difficultyGauge">{difficultyGauge}</div>
									<img className="catchesIconList" alt="" src ={catchesIcon}/>
									<div className="bottomRowText catchesListLabel">
										{store.myTricks[trickKey] && store.myTricks[trickKey].catches? 
										utilities.formatListCatches(store.myTricks[trickKey].catches) : "0"}
									</div>
									<div className="bottomRowText tags">
										<b>Tags:</b> {tags}
									</div>	
								</div>
								{ this.props.listType !== "main" && uiStore.selectedTrick !== trickKey ? 
									<div className="thumbLine">
										<span>relevance</span>
										<label>{ numUpvoters - numDownvoters}</label>
										<img className={
												this.checkIfVoted(detailTrick[listType][trickKey].upvoters) ? 
												"thumbIcon selectedThumbIcon": "thumbIcon"
											} 
											alt="" src={thumbsUpIcon} onClick={(e)=>{
												e.stopPropagation()
												this.vote(trickKey,"upvoters")
											}}
											title = "this pattern is relevant"
											/>
										<img className={
											this.checkIfVoted(detailTrick[listType][trickKey].downvoters) ? 
												"thumbIcon selectedThumbIcon": "thumbIcon"
											} 
											alt="" src={thumbsDownIcon} onClick={(e)=>{
												e.stopPropagation()
												this.vote(trickKey,"downvoters")
											}}
											title = "this pattern is not relevant"
										/>
									</div> : 
									null
								}
							</div>
							
						</div>
						{uiStore.selectedTrick === trickKey ? 
							<Demo
								trickKey = {trickKey}
								demoLocation="expandedSection"
							/> : null
						}
					</div>	
				)
				pushedTrickkeys.push(trickKey)
			}
		})	
		const date = new Date()
		const currentTime = date.getTime()
		let list = null
		list =
			<div className="listSection">
				{tricks.length > 0 ? tricks: 
					<div className="noResultsDiv">
						{store.startTime+10000<currentTime? "No results found" :
							<div className="loadingDiv">
								<div className="loader"></div> 
								Loading tricks
							</div>
						}
					</div>
				}
			</div>
		return (
			<div style={{ overflow:"auto"}} className="trickListOuterDiv">
				
				{uiStore.detailTrick ?
					<div className= "listDiv"
							 id='listDiv' 
						>	
							{list}				
					</div>: 
					<InfiniteScroll
						id='listDiv' 
						pageStart={0}
						hasMore={uiStore.pageNumber*paginationSize<this.props.tricksToList.length}
						threshold={10}
	    				loadMore={()=>{
	    					uiStore.setPageNumber(uiStore.pageNumber + 1)
	    				}}
					 	loader={<div style={{paddingTop:"15px", fontStyle:"italic"}} key={0}>Loading ...</div>}
					>
							{list}				
					</InfiniteScroll>
				}
			</div>
		)
	}
}
/*

*/
export default TrickList