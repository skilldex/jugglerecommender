import React, {Component} from 'react';
import { observer } from "mobx-react"

import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import {jugglingLibrary, defaultTricks} from './jugglingLibrary.js'
import store from './store'

@observer
class App extends Component {
 	state = {
 		filters : [],
 		selectedList : "allTricks",
 		edges : [],
 		nodes : []
	}
	componentDidMount(){
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
		if(myTricks){
			store.setMyTricks(myTricks)
			store.updateRootTricks(defaultTricks)
			
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
 		console.log("rendering app")
 		const addToMyTricksButton = store.popupTrick && store.myTricks.includes(store.popupTrick.id) ? 
              		  <button style={{"backgroundColor" : "yellow", "margin-bottom" : "10px"}} onClick={()=>{store.removeFromMyTricks(store.popupTrick.id)}}>&#9733;</button> :
 		              <button style={{"backgroundColor" : "cyan", "margin-bottom" : "10px"}} onClick={()=>{store.addToMyTricks(store.popupTrick.id)}}>&#9734;</button>
		const selectTrickButton = store.popupTrick && store.selectedTricks.includes(store.popupTrick.id) ? 
 		              <button style={{"backgroundColor" : "darkgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Unselect</button> :
 		              <button style={{"backgroundColor" : "lightgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Select</button> 

 		const popup = store.popupTrick && store.popupTrick.id ? <div style={{
				left : store.popupTrick.x,
				top : store.popupTrick.y
			}} className="popupDiv">
              <h3>{store.popupTrick.id}</h3> 
              {addToMyTricksButton}
              {selectTrickButton}
              {jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? <a 
              	className="popupLink"
              	href={jugglingLibrary[store.popupTrick.id].url} 
              	target="_blank"
              >See explanation</a> : null}
              {jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? <img
              	className="popupGif"
              	src={jugglingLibrary[store.popupTrick.id].url.toLowerCase().replace("/tricks","/JugglingGifs").replace("html","gif")} 
              /> : null}
            </div>  : null
		return (

		<div className="App">
			<div className="title">
				<h1>Juggledex</h1>
				<h3>Gotta catch em all ;)</h3>	
			</div>
			<div className="listButtonDiv">
				<button className={store.selectedList === "myTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{store.setSelectedList("myTricks")}}>My Tricks</button>
				<button className={store.selectedList === "allTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{store.setSelectedList("allTricks")}}>All Tricks</button>
			</div>
			<div>
				<p className="legendSpan" style={{"backgroundColor" : "yellow"}}></p>
				<span>My tricks</span>
				<p className="legendSpan" style={{"backgroundColor" : "orange"}}/>
				<span>Prerequisite</span>
				<p className="legendSpan" style={{"backgroundColor" : "pink"}}/>
				<span>Dependent</span>
				<p className="legendSpan" style={{"backgroundColor" : "cyan"}}/>
				<span>Not relevant</span>
			</div>
			<TrickList 
				myTricks={store.myTricks} 
				selectedList={store.selectedList}
			/>
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
