import React, {Component} from 'react';
import { observer } from "mobx-react"
import {toJS} from "mobx"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import Popup from './popup.js'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import Swipe from 'react-easy-swipe';
import Auth from './auth.js'
@observer
class App extends Component {
 	state = {
 		filters : [],
 		selectedList : "allTricks",
 		edges : [],
 		nodes : [],
 		swipedList : false
	}
	componentDidMount(){
		console.log("mounted")
		store.getSavedTricks()	
		console.log("finished loading")
	}
 	toggleFilter =(filter)=>{
 		let newFilters = []
 		if(!this.state.filters.includes(filter)){
 			newFilters.push(filter)
 		}
 		this.state.filters.forEach((curFilter)=>{
 			if(curFilter !== filter){
 				newFilters.push(curFilter)
 			} 			
 		})
 		this.setState({
 			filters : newFilters
 		})
 	} 	
 	handleStart=()=>{
 		console.log('startHandled')
 	}
 	render(){
 		store.nodes
 		store.edges
		return (
		<div className="App">
			<Auth/>
			<div className="title">
				<h1>Juggledex</h1>
				<h3>Gotta catch em all ;)</h3>
			</div>
			<div className="instructions">
				<h3>Instructions</h3>
				<span>• ★ Star tricks you know to add to "Starred" tricks.</span> 	
				<br/>
				<span>• Find new tricks to learn next that are related to tricks you starred ★.</span>
				<br/>
				<span>• Sign in to access your tricks across devices, otherwise tricks will be stored separately on each device</span>
				<br/><br/>
				<span >
					Seeded from <a href="libraryofjuggling.com">libraryofjuggling.com</a>
				</span>			
			</div>

			{this.state.swipedList ? 
				<div className="swipedDiv" 
					onClick={
						(event)=>{this.setState({swipedList : false})}
					}
				>+</div> : 
				<TrickList 
					myTricks={store.myTricks} 
					selectedList={store.selectedList}
					selectedTricks={store.selectedTricks}
				/>}
				<Popup/>
			<TrickGraph 
				nodes = {store.nodes}
				edges = {store.edges}
			/>
		</div>
		);
	}
}
export default App;
