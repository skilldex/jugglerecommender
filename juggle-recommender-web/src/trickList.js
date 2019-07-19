import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import catchesIcon from './images/catchesIcon.png'
import Demo from './demo'
import MainTagsBar from "./mainTagsBar"
import './trickList.css';
import './App.css';
import Gauge from 'react-svg-gauge';
import utilities from './utilities'
//import { Resizable } from "re-resizable";
import ReactGA from 'react-ga';
import history from './history';
@observer
class TrickList extends Component {
	state = {
			sortType: 'alphabetical',
			expandDone : false
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
		if(!store.isLocalHost){
			ReactGA.event({
			  category: 'list ' + this.props.listType,
			  action: 'opened detail',
			  label: 'list ' + this.props.listType + " " + trickKey 
			});
		}
		history.push('/detail/'+trickKey, {detail : trickKey})
		uiStore.setMainListScrollerPosition(document.getElementById('listDiv').scrollTop)
		uiStore.setShowHomeScreen(false)
		uiStore.setShowExpandedMenu(false)
		if (uiStore.selectedTrick){
			uiStore.toggleSelectedTrick(null)
		}
		const detailTrick = {...store.library[trickKey]}
		detailTrick.id = trickKey
		uiStore.setDetailTrick(detailTrick)	
		window.scrollTo(0,0);
		if (document.getElementById('detailOuterDiv')){
    		document.getElementById('detailOuterDiv').scrollTop = 0
    	}    	
    	if (document.getElementById('detailDiv')){
	    	document.getElementById('detailDiv').scrollTop = 0
	    }
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
		if(!store.isLocalHost && uiStore.selectedTrick == trickKey){
			ReactGA.event({
			  category: 'list ' + this.props.listType ,
			  action: "expand",
			  label : 'list ' + this.props.listType + " " + trickKey 
			});
		}
	}

	getHexColor=(value: number)=> {
	  let string = value.toString(16);
	  return (string.length === 1) ? '0' + string : string;
	}
							
	render() {
	 	let tricks = []
		this.props.tricksToList.forEach((trickKey)=>{
			trickKey = trickKey.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
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
			const r = Math.floor(modifiedTrickDifficulty >= 5? 255:255-(modifiedTrickDifficulty)* 51);
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
				<div className="listCard" 
					 key={trickKey + "div"} 
					 id={trickKey + "listCard"}
					 onClick={(e)=>{this.openDetail(trickKey)}}
				>	
					<div className="mainCard">
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
						</div>
						<div 
							className="expandButtonDiv"
							onClick={
										(e)=>{
											e.stopPropagation()
											this.expandCard(trickKey)
										}
									}
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
		})	
		const date = new Date()
		const currentTime = date.getTime()
		const list =
			<div  className="listSection">
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
			<div className="trickListOuterDiv">
				{uiStore.detailTrick || uiStore.showHomeScreen? null:<MainTagsBar/>}
				<div className= "listDiv"
					 id='listDiv' 
				>	
					{list}				
				</div>
			</div>
		)
	}
}
export default TrickList