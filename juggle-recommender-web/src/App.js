import React, {Component} from 'react';
import { observer } from "mobx-react"
import {toJS} from "mobx"

import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
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
		store.getSavedTricks()	
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
 		const addToMyTricksButton = store.popupTrick && store.myTricks.includes(store.popupTrick.id) ? 
              		  <button className="removeFromMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.removeFromMyTricks(store.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addToMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.addToMyTricks(store.popupTrick.id)}}>&#9734;</button>
		const selectTrickButton = store.popupTrick && store.selectedTricks.includes(store.popupTrick.id) ? 
 		              <button style={{"backgroundColor" : "darkgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Unselect</button> :
 		              <button style={{"backgroundColor" : "lightgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Select</button> 
 		const graphDiv = document.getElementById("graphDiv")
 		const popup = store.popupTrick && store.popupTrick.id ? 
			        <div style={{
				left : Math.min(graphDiv.clientWidth-260,store.popupTrick.x),
				top : Math.min(graphDiv.clientHeight-460,store.popupTrick.y)
			}} className="popupDiv">
              <h3>{jugglingLibrary[store.popupTrick.id].name}</h3> 
              <label>Difficulty: {jugglingLibrary[store.popupTrick.id].difficulty} / 10</label><br></br><br></br>
              {addToMyTricksButton}
              {selectTrickButton}
              {jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? <a 
              	className="popupLink"
              	href={jugglingLibrary[store.popupTrick.id].url} 
              	target="_blank"
              >See explanation</a> : null}
              {jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? <img
              	className="popupGif"
              	src={jugglingLibrary[store.popupTrick.id].gifUrl}              	
              /> : null}
              <br></br>
              {jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].tags? <label
              	className="popupTags">
              	TAGS: {jugglingLibrary[store.popupTrick.id].tags.join(', ')} 
              	</label> : null}
            </div> : null

          console.log("rendering app", store.selectedList)
		return (
		<div className="App">
			<Auth/>

			<div className="title">
				<h1>Juggledex</h1>
				<h3>Gotta catch em all ;)</h3>
			</div>
			<div className="instructions">
				<h3>Instructions</h3>
				<span> ★ Star tricks you know to add to "Starred" tricks.</span> 	
				<br/>
				<span>Find new tricks to learn next that are related to tricks you starred ★.</span>
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
				/>}
				{popup}
			<TrickGraph 
				nodes = {store.nodes}
				edges = {store.edges}
			/>
		</div>
		);
	}
}
export default App;
