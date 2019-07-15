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

const contributorsCounter = []
const ballNumCounter = []
const tagsCounter = []
@observer
class Stats extends Component {

	componentDidMount(){
		Object.keys(store.library).forEach((trick) => {
			if (store.library[trick].contributor){
				const contributor = store.library[trick].contributor
				if (contributorsCounter[contributor]){
					contributorsCounter[contributor]['count'] += 1
				}else{
					contributorsCounter[contributor] = {}
					contributorsCounter[contributor]['count'] = 1
				}
			}
			const ballNum = store.library[trick].num
			if (ballNumCounter[ballNum]){
				ballNumCounter[ballNum]['count'] += 1
			}else{
				ballNumCounter[ballNum] = {}
				ballNumCounter[ballNum]['count'] = 1
			}
			if (store.library[trick].tags){
				store.library[trick].tags.forEach((tag) =>{
					if (tagsCounter[tag]){
						tagsCounter[tag]['count'] += 1
					}else{
						tagsCounter[tag] = {}
						tagsCounter[tag]['count'] = 1
					}
				})
			}			
		})

		 
	}

	render (){
		var newObj = Object.assign({}, ...(ballNumCounter.map(item => ({ [item.key]: item.count }) )));
console.log('ballNumCounter',ballNumCounter)
console.log('newObj',newObj)
ballNumCounter.forEach((trickKey)=>{
	console.log(trickKey)
})





		return(
			<div className = "homeOuterDiv">
				<h3 style={{marginBottom: "10px"}}>Stats</h3>
				<label>Number of Contributors: {store.contributorTags.length}</label>
				<label>Ball Numbers:</label>
			</div>
		)
	}
}
export default Stats

