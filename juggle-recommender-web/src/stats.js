import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import filterStore from "./stores/filterStore"
import "./homeScreen.css"
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

		this.setState({contributorsCounter,ballNumCounter,tagsCounter})
		 
	}

	render (){

		const contributorsStats = Object.keys(this.state.contributorsCounter).map((key)=>{
			return <div><b>{key}</b>  {this.state.contributorsCounter[key]} </div>
		})

		const ballNumStats = Object.keys(this.state.ballNumCounter).map((key)=>{
			return <div><b>{key} Balls</b>  {this.state.ballNumCounter[key]} </div>
		})

		const tagsStats = Object.keys(this.state.tagsCounter).map((key)=>{
			return <div><b>{key}</b>  {this.state.tagsCounter[key]} </div>
		})



		return(
			<div className = "homeOuterDiv">
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

