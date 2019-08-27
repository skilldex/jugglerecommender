import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import filterStore from "./stores/filterStore"
import "./stats.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import Demo from './demo'
import history from './history';
import downArrow from './images/down-arrow.svg'
@observer
class Stats extends Component {
	state={
		 contributorsCounter : {},
		 ballNumCounter : {},
		 tagsCounter : {},
	}
	componentDidMount(){
		let contributorsCounter = this.state.contributorsCounter
		let ballNumCounter = this.state.ballNumCounter
		let tagsCounter = this.state.tagsCounter
		Object.keys(store.library).forEach((trick) => {
			if (store.library[trick].contributor){
				const contributor = store.library[trick].contributor
				if (contributorsCounter[contributor]){
					contributorsCounter[contributor] += 1
				}else{
					contributorsCounter[contributor] = 1
				}
			}
			const ballNum = store.library[trick].num
			if (ballNumCounter[ballNum]){
				ballNumCounter[ballNum] += 1
			}else{
				ballNumCounter[ballNum] = 1
			}
			if (store.library[trick].tags){
				store.library[trick].tags.forEach((tag) =>{
					if (tagsCounter[tag]){
						tagsCounter[tag] += 1
					}else{
						tagsCounter[tag] = 1
					}
				})
			}			
		})
		let orderedContributorsCounter = {}
		Object.keys(contributorsCounter).sort(Intl.Collator().compare).forEach(function(key) {
		  orderedContributorsCounter[key] = contributorsCounter[key];
		});
		let orderedTagsCounter = {}
		Object.keys(tagsCounter).sort(Intl.Collator().compare).forEach(function(key) {
		  orderedTagsCounter[key] = tagsCounter[key];
		});
		this.setState({contributorsCounter:orderedContributorsCounter,
						ballNumCounter,
						tagsCounter:orderedTagsCounter})
		 
	}

	statsLabelButtonClicked=(tagType, key)=>{
		filterStore.resetAllFilters()
		if (tagType === 'contributor'){
			filterStore.setContributors([{id: key,text: key,}]);
		}else if (tagType === 'ballNum'){
			filterStore.setNumBalls([key])
			
		}else if (tagType === 'tags'){
			filterStore.setTags([{id: key,text: key,}]);			
		}
		utilities.sendGA('stats','tricklist via labels')
		utilities.openPage('tricklist',true)
	}

	render (){
    const backButton = <div className = "backButtonSurroundingDivStats">
	    					<img id="backButton" 
	                            src={downArrow} 
	                            className="backButtonStats rotatedNegative90" 
	                            alt="backIcon" 
	                            onClick={()=>{ uiStore.handleBackButtonClick()}}
	                        />
	                        <label className="backButtonStatsLabel" 
		             		   onClick={()=>{ uiStore.handleBackButtonClick()}}>Back
		             		</label>
                        </div>
		const contributorsStats = Object.keys(this.state.contributorsCounter).map((key)=>{
			let keyToShow = key
			if (key.length>15){
				keyToShow = key.substring(0, 14) + ".."
			}
			return <div className = "individualStatsDiv">
						<label className= "statsLabelButton"
								onClick = {()=>this.statsLabelButtonClicked('contributor', key)}>
							{keyToShow}
						</label>  
						<div className = "statsValues">
							{this.state.contributorsCounter[key]}
						</div>
					</div>
		})

		const ballNumStats = Object.keys(this.state.ballNumCounter).map((key)=>{
			return <div className = "individualStatsDiv">
						<label className= "statsLabelButton"
								onClick = {()=>this.statsLabelButtonClicked('ballNum', key)}>
							{key} Balls
						</label>  
						<div className = "statsValues">
							{this.state.ballNumCounter[key]} 
						</div>
					</div>
		})

		const tagsStats = Object.keys(this.state.tagsCounter).map((key)=>{
			return <div className = "individualStatsDiv">
						<label className= "statsLabelButton"
								onClick = {()=>this.statsLabelButtonClicked('tags', key)}>
							{key}
						</label>  
						<div className = "statsValues">
							{this.state.tagsCounter[key]} 
						</div>
					</div>
		})



		return(
			<div className = "statsOuterDiv">
				{backButton}
				<h3 style={{marginBottom: "10px"}}>Stats</h3>
				<h3>By Numbers of Balls</h3>
				{ballNumStats}
				<h3>By Contributor</h3>
				{contributorsStats}
				<h3>By Tag</h3>
				{tagsStats}
				
			</div>
		)
	}
}
export default Stats

