import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import authStore from './stores/authStore'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'

import Demo from './demo'
import MainTagsBar from "./mainTagsBar"
import './smallTrickList.css';
import './App.css';
import Gauge from 'react-svg-gauge';
import utilities from './utilities'
//import { Resizable } from "re-resizable";
import history from './history';
import InfiniteScroll from 'react-infinite-scroller';
const paginationSize = 10

@observer
class SmallTrickList extends Component {
	state = {
			sortType: 'alphabetical',
			expandDone : false,
			inputText : ''
			
	}
	componentDidMount=()=>{
		this.setScrollerPositions()
	}

  	setScrollerPositions=()=> {
  		const listType = this.props.listType
	    function setPositions() {
	    	if (document.getElementById('smallListDiv') && listType === "main"){
				document.getElementById('smallListDiv').scrollTop = uiStore.mainListScrollerPosition	
			}
		}
	    setTimeout(function() {
	        setPositions();
	    }, 100);		
	}

	openDetail=(trickKey)=>{
		utilities.sendGA('list ' + this.props.listType,'opened detail','list ' + this.props.listType + ' ' + trickKey)
		if (this.props.listType === "main"){
			uiStore.setMainListScrollerPosition(document.getElementById('smallListDiv').scrollTop)
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
	addToList=(trickKey)=>{
		console.log('this.props.listOfTricks',this.props.listOfTricks)
		uiStore.addTrickToSmallTrickList(this.props.listOfTricks,trickKey)
		this.setState({inputText:''})
	}
	onInputKeyPress=()=>{
		console.log('onInputKeyPress')
	}
	//todo
	//hook up small tricklist to details
	//change autosuggest back to how it was without a with number check
	handleInputChange=(e)=>{
		console.log('handleInputChange')
		this.setState({inputText : e.target.value})
	}
	handleInputBlur=()=>{
		console.log('handleInputBlur')
	}

	render() {
		let list = null
		if (this.state.inputText.length>1){
		 	let tricks = []
		 	const pushedTrickkeys = []
		 	const detailTrick = uiStore.detailTrick ? store.library[uiStore.detailTrick.id] : null
		 	const listType = this.props.listType == "postreqs" ? "dependents" : this.props.listType
			this.props.tricksToList.forEach((trickKey, index)=>{
				const lowerCaseTrickName = store.library[trickKey].name.toLowerCase()
				const lowerCaseInput = this.state.inputText.toLowerCase()
				if (lowerCaseTrickName.includes(lowerCaseInput)){
		 			const matchIndex = lowerCaseTrickName.indexOf(lowerCaseInput)
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

					tricks.push(
						<div className= "smallListCard"
							 key={trickKey + "div"} 
							 id={trickKey + "listCard"}
							 onClick={(e)=>{this.addToList(store.library[trickKey].name)}}
						>	
							<div className="smallListMainCard">
								<div className = "smallListCardInfo">	
									<div className="smallListCardNameDiv" title={trick.name}>
				 		 				<span>{trick.name.slice(0,matchIndex)}</span>
				 		 				<span className="match">{trick.name.slice(matchIndex,matchIndex+lowerCaseInput.length)}</span>
				 		 				<span>{trick.name.slice(matchIndex+lowerCaseInput.length,)}</span>
				 					</div>
									<div className="smallListBottomRowText">
										<div className="difficultyGauge">{difficultyGauge}</div>
										<div className="smallListBottomRowText tags">
											Tags: {tags}
										</div>	
									</div>
								</div>
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

			list =
				<div className="smallListListSection">
					{tricks.length > 0 ? tricks: 
						<div className="smallListNoResultsDiv">
							{store.startTime+10000<currentTime? "No results found" :
								<div className="smallListLoadingDiv">
									<div className="loader"></div> 
									Loading tricks
								</div>
							}
						</div>
					}
				</div>
		}

		return (
			<div style={{ overflow:"auto"}} className="smallListOuterDiv">
				<input 	id ="smallListInput"
						className="smallListInput" 
						onKeyPress={this.onInputKeyPress}
						value={this.state.inputText} 
						onChange={(e)=>this.handleInputChange(e)}
						onBlur={this.handleInputBlur}
				/>
				{this.state.inputText.length>1 ?	
					<div className= "smallListDiv"
							 id='smallListDiv' 
						>	
							{list}				
					</div>

					:

					 null
				}
			</div>
		)
	}
}
/*

*/
export default SmallTrickList