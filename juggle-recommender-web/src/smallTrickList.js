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
		utilities.sendGA('small tricklist','expand','list' + trickKey)
	}

	getHexColor=(value: number)=> {
	  let string = value.toString(16);
	  return (string.length === 1) ? '0' + string : string;
	}
							

	addToList=(trickKey)=>{
		uiStore.addTrickToSmallTrickList(this.props.listOfTricks,trickKey)
		if(this.props.listType.includes('AddTrick')){
			this.setState({inputText:''})
		}else if (this.props.listType.includes('Details')){
			this.setState({inputText:store.library[trickKey].name})
		}
	}
	onInputKeyPress=()=>{

	}

	handleInputChange=(e)=>{
		this.setState({inputText : e.target.value})
	}
	handleInputBlur=()=>{

	}

	render() {
		let list = null
		let shouldShowList = true
		if (this.props.listType.includes('Details')){
			if (this.props.listType.includes('prereq') &&
				uiStore.autoCompletedSuggestedPrereq==true){
					shouldShowList = false
			}
			if (this.props.listType.includes('related') &&
				uiStore.autoCompletedSuggestedRelated==true){
					shouldShowList = false
			}
			if (this.props.listType.includes('postreq') &&
				uiStore.autoCompletedSuggestedPostreq==true){
					shouldShowList = false
			}
		}
		if (this.state.inputText.length>1 && shouldShowList){
		 	let tricks = []
		 	const pushedTrickkeys = []
		 	const detailTrick = uiStore.detailTrick ? store.library[uiStore.detailTrick.id] : null
		 	let tricksToList = null
		 	if (this.props.listType.includes('prereq') ||
		 		this.props.listType.includes('related')){
		 		tricksToList = uiStore.allTrickKeysSorted('difficulty','ascending')
		 	}else{
		 		tricksToList = uiStore.allTrickKeysSorted('difficulty','descending')
		 	}
			tricksToList.forEach((trickKey, index)=>{
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
						autoComplete="off"
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