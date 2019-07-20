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
import ReactGA from 'react-ga';
import history from './history';
@observer
class Stats extends Component {
	state={
		 contributorsCounter : {},
		 ballNumCounter : {},
		 tagsCounter : {},
	}
	componentDidMount(){
		console.log('stats mounted')
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

		this.setState({contributorsCounter,ballNumCounter,tagsCounter})
		 
	}
	componentWillUnmount(){
		console.log('stats will unmount')
	}

	statsLabelButtonClicked=(tagType, key)=>{
		history.push('/tricklist')
		uiStore.clearUI()
		if (tagType === 'contributor'){
			filterStore.setContributors([{id: key,text: key,}]);
		}else if (tagType === 'ballNum'){
			filterStore.setNumBalls([key])
			
		}else if (tagType === 'tags'){
			filterStore.setTags([{id: key,text: key,}]);			
		}
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	render (){

		const contributorsStats = Object.keys(this.state.contributorsCounter).map((key)=>{
			return <div className = "individualStatsDiv">
						<label className= "statsLabelButton"
								onClick = {()=>this.statsLabelButtonClicked('contributor', key)}>
							{key}
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

