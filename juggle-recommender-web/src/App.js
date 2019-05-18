import React, {Component} from 'react';
import { observer } from "mobx-react"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import Swipe from 'react-easy-swipe';

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
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
		if(myTricks.length > 0){
			store.setMyTricks(myTricks)
			store.setSelectedList("myTricks")
			store.setSearchInput('')
			store.updateRootTricks()		
		}else{
			store.selectTricks(['Cascade'])
			store.setSearchInput('common')
			store.updateRootTricks()	
		}
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
 	render(){
 		store.nodes
 		store.edges
 		const addToMyTricksButton = store.popupTrick && store.myTricks.includes(store.popupTrick.id) ? 
              		  <button className="removeFromMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.removeFromMyTricks(store.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addToMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.addToMyTricks(store.popupTrick.id)}}>&#9734;</button>
		const selectTrickButton = store.popupTrick && store.selectedTricks.includes(store.popupTrick.id) ? 
 		              <button style={{"backgroundColor" : "darkgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Unselect</button> :
 		              <button style={{"backgroundColor" : "lightgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Select</button> 
 		const popup = store.popupTrick && store.popupTrick.id ? <div style={{
				left : store.popupTrick.x,
				top : store.popupTrick.y
			}} className="popupDiv">
              <h3>{store.popupTrick.id}</h3> 
              <label>Difficult: {jugglingLibrary[store.popupTrick.id].difficulty} / 10</label><br></br><br></br>
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
            </div>  : null
		return (
		<div className="App">
			<div className="title">
				<h1>Juggledex</h1>
				<h3>Gotta catch em all ;)</h3>
			</div>
			<div className="instructions">
				<h3>Instructions</h3>
				<span>Find new tricks to learn next that are related to tricks you know.</span>
				<br/>
				<span> Keep track of tricks you know in "My Tricks"</span> 	
			</div>
			<div className="legend">
				<h3>Legend</h3>
				<p className="legendSpan" style={{"backgroundColor" : "yellow"}}></p>
				<span>My tricks/Selected </span>
				<p className="legendSpan" style={{"backgroundColor" : "orange"}}/>
				<span>Learn Next</span>
				<p className="legendSpan" style={{"backgroundColor" : "pink"}}/>
				<span>Prerequisite</span>
				<p className="legendSpan" style={{"backgroundColor" : "cyan"}}/>
				<span>Not relevant</span>
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
