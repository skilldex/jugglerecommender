import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import Demo from './demo'
import './smallTrickList.css';
import './App.css';
import Gauge from 'react-svg-gauge';
import utilities from './utilities'
//import { Resizable } from "re-resizable";
//import InfiniteScroll from 'react-infinite-scroller';
//const paginationSize = 10

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
		const previoslySelected = document.getElementById(uiStore.selectedTrick+"SmallListCard");
		const element = document.getElementById(trickKey+"SmallListCard");
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
			uiStore.selectTrick(null)
		}else if (this.props.listType.includes('Details')){
			this.setState({inputText:store.library[trickKey].name})
			uiStore.selectTrick(null)
		}
	}
	onInputKeyPress=()=>{
		if (this.props.listType.includes('Details')){
			uiStore.clearSuggestions(this.props.listType)
		}
	}

	handleInputChange=(e)=>{
		this.setState({listBlurred:false})
		this.setState({inputText : e.target.value})
		if (e.target.value === ''){
			uiStore.selectTrick(null)
			uiStore.clearSuggestions(this.props.listType)
		}
	}
	handleInputClicked=()=>{
		this.setState({listBlurred:false})
	}
	handleInputBlur=()=>{
		    //   setTimeout(()=>{
		    //   	this.setState({listBlurred:true})
      // }, 800)
		
	}
	checkIfShouldShowList=()=>{
		let shouldShowList = true
		if (this.props.listType.includes('Details')){
			if (this.props.listType.includes('prereq') &&
				uiStore.autoCompletedSuggestedPrereq === true){
					shouldShowList = false
			}
			if (this.props.listType.includes('related') &&
				uiStore.autoCompletedSuggestedRelated === true){
					shouldShowList = false
			}
			if (this.props.listType.includes('postreq') &&
				uiStore.autoCompletedSuggestedPostreq === true){
					shouldShowList = false
			}
		}
		return shouldShowList
	}

	getTricksToList=()=>{			
		let tricksToListObjs = []
		let tricksToListRelevance = []
		const lowerCaseInput = this.state.inputText.toLowerCase()

	    for (var trickObj in store.library) {
	      if (store.library.hasOwnProperty(trickObj)) {
	      	const trick = {}
			const trickKey = trickObj
			const lowerCaseTrickName = store.library[trickObj].name.toLowerCase()
			const relevance = utilities.compareStrings(lowerCaseInput, lowerCaseTrickName)
			if (relevance !== null){
				trick.key = trickKey
				trick.relevance = relevance
				tricksToListObjs.push(trick)
			}
	      }
	    }
	    const postreqMultiplier = this.props.listType.includes('postreq') ? -1 : 1
	    const sortedTricksToListObjs = tricksToListObjs.sort(function(a, b) {   
	   		const verySimilarA = a.key.length < lowerCaseInput.length+10 ? (((10-(a.key.length-lowerCaseInput.length))*10)*postreqMultiplier) : 0
	   		const verySimilarB = b.key.length < lowerCaseInput.length+10 ? (((10-(b.key.length-lowerCaseInput.length))*10)*postreqMultiplier) : 0
           return a.relevance > b.relevance ? 1 : ( 
	            	a.relevance < b.relevance ? -1 : 
		            (parseFloat(store.library[a.key].difficulty)-verySimilarA)*postreqMultiplier > 
		            (parseFloat(store.library[b.key].difficulty)-verySimilarB)*postreqMultiplier ? 1 : 
		            (parseFloat(store.library[a.key].difficulty)-verySimilarA)*postreqMultiplier < 
		            (parseFloat(store.library[b.key].difficulty)-verySimilarB)*postreqMultiplier ? -1 : 0
            	
           );               
	    }); 

	    const tricksToList = []
	    Object.keys(sortedTricksToListObjs).forEach((index, i) => {
	      tricksToList.push(sortedTricksToListObjs[index].key)
	    })

	    return tricksToList
	}

	render() {
		let list = null
		if (this.state.inputText.length>1 && this.checkIfShouldShowList()){
			const lowerCaseInput = this.state.inputText.toLowerCase()
		 	let tricks = []
		 	const pushedTrickkeys = []
		 	const tricksToList = this.getTricksToList()
			tricksToList.forEach((trickKey, index)=>{
				const lowerCaseTrickName = store.library[trickKey].name.toLowerCase()
	 			const matchIndex = lowerCaseTrickName.includes(lowerCaseInput)?
	 								lowerCaseTrickName.indexOf(lowerCaseInput) : -1
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
				const smallListCardNameDivClassName = this.props.listType.includes('Details') ?
										'smallListCardNameDiv' : 'smallListCardNameDivAddTrickForm'
				tricks.push(
					<div className= "smallListCard"
						 key={trickKey + "div"} 
						 id={trickKey + "SmallListCard"}
						 onClick={(e)=>{this.addToList(store.library[trickKey].name)}}
					>	
						<div className="smallListMainCard">
							<div className="unexpandedSection">
								<div className="expandButtonDiv"
									onClick={(e)=>{
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
								<div className = {this.props.listType.includes('Details') ? "smallListCardInfo" : "smallListCardInfo"}>	
									<div className={smallListCardNameDivClassName} title={trick.name}>
										{matchIndex > -1 ? 
											<div>
						 		 				<span>{trick.name.slice(0,matchIndex)}</span>
						 		 				<span className="match">{trick.name.slice(matchIndex,matchIndex+lowerCaseInput.length)}</span>
						 		 				<span>{trick.name.slice(matchIndex+lowerCaseInput.length,)}</span>
						 		 			</div>
						 		 			: <span>{trick.name}</span>
						 		 		}
				 					</div>
									<div className="smallListBottomRowText">
										<div className="difficultyGauge">{difficultyGauge}</div>
										<div className={this.props.listType.includes('Details') ? 
															"smallListBottomRowText smallListTags" : 
															"smallListBottomRowText smallListTagsAddTrick"
														}
												title={trick.tags}>
											Tags: {tags}
										</div>	
									</div>
								</div>
							</div>
							{uiStore.selectedTrick === trickKey ? 
								<div className="demoOuterDivTrickList">
									<Demo
										trickKey = {trickKey}
										demoLocation="expandedSection"
									/> 
								</div>: null
							}
						</div>

					</div>	
				)
				pushedTrickkeys.push(trickKey)				
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
						onClick={this.handleInputClicked}
						onBlur={this.handleInputBlur}
				/>
				{this.state.inputText.length>1?	
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