import React, {Component} from 'react';
import { observer } from "mobx-react"

import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import {jugglingLibrary, defaultTricks} from './jugglingLibrary.js'

console.log(observer)

@observer
class App extends Component {
 	state = {
 		filters : [],
 		searchInput : "",
 		searchTrick : "",
 		selectedTricks : [],
 		selectedList : "allTricks",
 		myTricks : [],
 		edges : [],
 		nodes : []
	}
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.searchInput !== this.state.searchInput || 
			nextState.selectedTricks !== this.state.selectedTricks
		){
			return false
		}else{
			return true
		}
	}
	componentDidMount(){
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
		if(myTricks){
			this.setState({myTricks},()=>{
				console.log("mounted default " ,defaultTricks)
				this.updateRootTricks(defaultTricks)
			})
			
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

 	searchInputChange=(e)=>{
 		this.setState({
 			searchInput: e.target.value
 		})
 		console.log("search", e.target.value)
 		if(e.target.value === ""){
 			this.setState({
 				searchTrick: ""
 			})
 		}
 	}
 	addToMyList=(trickKey)=>{
 		const myTricks = this.state.myTricks
 		myTricks.push(trickKey)
 		console.log("added trick " ,trickKey)
 		localStorage.setItem('myTricks', JSON.stringify(myTricks))
 		this.setState({myTricks})
 	}

 	removeFromMyList=(trickKey)=>{
 		console.log('removeFromMyListApps',trickKey)
 		const myTricks = this.state.myTricks
		var index = myTricks.indexOf(trickKey);
		if (index > -1) {
		  myTricks.splice(index, 1);
		}
 		console.log("trick removed " ,trickKey)
 		localStorage.setItem('myTricks', JSON.stringify(myTricks))
 		this.setState({myTricks})
 	}	
 	searchTrick=()=>{
 		this.setState({
 			searchTrick: this.state.searchInput
 		})
 	}

 	selectTricks=(selectedTricks)=>{
 		if (this.state.selectedTricks[0] === selectedTricks[0] && this.state.selectedTricks.length === 1){
			this.setState({selectedTricks: []})
	 	}else{
	 		this.setState({selectedTricks})
	 	}
 	}
 	setListType=(listType)=>{
 		this.setState({
 			selectedList : listType
 		})
 	}
 	updateRootTricks=(rootTricks)=>{
 		let nodes = []
 		let tempNodes = {}
 		let edges = []
	 	if(this.state.selectedList === "myTricks" ){
	 		rootTricks.forEach((trickKey)=>{
	 			console.log('rootForEach')
	 			const rootTrick = jugglingLibrary[trickKey]
	 			if(rootTrick.dependents || rootTrick.prereqs){
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				name : rootTrick.name,
		 				involved : 100
		 			}
		 		}
		 		if(rootTrick.prereqs){
		 			rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				if(!tempNodes[prereqKey]){
			 				tempNodes[prereqKey] = {
			 					id: prereqKey,
			 					name: prereq.name,
			 					involved : 40
			 				}
			 			}
		 				edges.push({ data: { source: trickKey, target: prereqKey } })

		 			})
		 		}
	 			if(rootTrick.dependents){
		 			rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
			 			if(!tempNodes[dependentKey]){
			 				tempNodes[dependentKey] = {
			 					id: dependentKey,
			 					name: dependent.name,
			 					involved : 75
			 				}
			 			}
		 				edges.push({ data: { source: dependentKey, target: trickKey } })

		 			})
		 		}
 			})
	 	}else if(this.state.selectedList === "allTricks"){
	 		rootTricks.forEach((trickKey)=>{
	 			const rootTrick = jugglingLibrary[trickKey]

	 			const involvedRoot = this.state.myTricks.includes(trickKey) || 
	 							this.state.selectedTricks.includes(trickKey) ? 100 : 0
	 			if((rootTrick.dependents || rootTrick.prereqs) && (!tempNodes[trickKey]||tempNodes[trickKey].involved < involvedRoot)){
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				name : rootTrick.name,
		 				involved : involvedRoot
		 			}
		 		}
	 			if(rootTrick.prereqs){
	 				rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				let involvedPrereq = involvedRoot > 0 ? 40 : 0
		 				
		 				if(
		 					tempNodes[prereqKey] && 
		 					tempNodes[prereqKey].involved > involvedPrereq
		 				){
		 					involvedPrereq = tempNodes[prereqKey].involved
		 				}
		 				tempNodes[prereqKey] = {
		 					id: prereqKey,
		 					name: prereq.name,
		 					involved : involvedPrereq
		 				}

		 				edges.push({ data: { source: trickKey, target: prereqKey } })
			 		})
	 			}
 				if(rootTrick.dependents){
 					rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
		 				let involvedDependent = involvedRoot > 0 ? 75 : 0
		 				if(tempNodes[dependentKey] && tempNodes[dependentKey].involved > involvedDependent){
		 					involvedDependent = tempNodes[dependentKey].involved
		 				}
		 				tempNodes[dependentKey] = {
		 					id: dependentKey,
		 					name: dependent.name,
		 					involved : involvedDependent
		 				}
		 				edges.push({ data: { source: dependentKey, target: trickKey } })
		 			})
 				}
 					
 			})
	 	}
	 	Object.keys(tempNodes).forEach((trickKey)=>{
	 		nodes.push({ data: {...tempNodes[trickKey]}})
	 	})

    this.setState({edges, nodes}, function () {
	 	this.setState({edges, nodes})
    });

 	}
 	render(){
 		const search= <div>
	 						<label>Find trick </label><input onChange={this.searchInputChange}/>
	 						<button type="submit" onClick={this.searchTrick}>Search</button>
	 				  </div>
		return (

		<div className="App">
			<div className="title">
				<h1>Juggledex</h1>
				<h3>Gotta catch em all ;)</h3>	
			</div>
			<div className="listButtonDiv">
				<button className={this.state.selectedList === "myTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{this.setListType("myTricks")}}>My Tricks</button>
				<button className={this.state.selectedList === "allTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{this.setListType("allTricks")}}>All Tricks</button>
			</div>
			<TrickList 
				myTricks={this.state.myTricks} 
				selectedList={this.state.selectedList}
				selectTricks={this.selectTricks}
				addToMyList={this.addToMyList}
				removeFromMyList={this.removeFromMyList}
				selectedTricks={this.state.selectedTricks}
				updateRootTricks={this.updateRootTricks}
			/>
			<TrickGraph 
				nodes = {this.state.nodes}
				edges = {this.state.edges}
			/>
		</div>
		);
	}
}

export default App;
