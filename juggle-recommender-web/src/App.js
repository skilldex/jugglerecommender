import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import jugglingLibrary from './jugglingLibrary.js'

class App extends Component {
 	state = {
 		filters : [],
 		checkedTricks : {},
 		searchInput : "",
 		searchTrick : "",
 		selectedTricks : [],
 		selectedList : "allTricks",
 		myTricks : [],
 		edges : [],
 		nodes : []
	}
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.searchInput != this.state.searchInput){
			return false
		}else{
			return true
		}
	}
	componentDidMount(){
		const checkedTricks = JSON.parse(localStorage.getItem("checkedTricks"))
		if(checkedTricks){
			this.setState({checkedTricks})
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
 	updateCheckedTricks=(checkedTricks)=>{
 		this.setState({checkedTricks})
 		localStorage.setItem('checkedTricks', JSON.stringify(checkedTricks))
 	}
 	searchInputChange=(e)=>{
 		this.setState({
 			searchInput: e.target.value
 		})
 		console.log("search", e.target.value)
 		if(e.target.value == ""){
 			console.log("search trick changing")
 			this.setState({
 				searchTrick: ""
 			})
 		}
 	}
 	addToMyList=(trickKey)=>{
 		const myTricks = this.state.myTricks
 		myTricks.push(trickKey)
 		console.log("added trick " ,trickKey)
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
 		this.setState({myTricks})
 	}	
 	searchTrick=()=>{
 		this.setState({
 			searchTrick: this.state.searchInput
 		})
 	}

 	selectTricks=(selectedTricks)=>{
 		console.log("selecting ",selectedTricks)
 		console.log('this.state.selectedTricks',this.state.selectedTricks)
 		console.log('selectedTricks',selectedTricks)
 		console.log('this.state.selectedTricks.length',this.state.selectedTricks.length)
 		if (this.state.selectedTricks[0] == selectedTricks[0] && this.state.selectedTricks.length == 1){
			this.setState({selectedTricks: []})
 			console.log('unselected')
	 	}else{
	 		this.setState({selectedTricks})
	 		console.log('selected')
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
	 	if(this.state.selectedList == "myTricks" ){
	 		rootTricks.forEach((trickKey)=>{
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
			 					involved : 25
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
	 	}else if(this.state.selectedList == "allTricks"){
	 		const involvedTricks = this.state.selectedTricks.length > 0 ? this.state.selectedTricks : this.state.myTricks 
	 		rootTricks.forEach((trickKey)=>{
	 			const rootTrick = jugglingLibrary[trickKey]
	 			const involvedRoot = this.state.myTricks.includes(trickKey) || 
	 							this.state.selectedTricks.includes(trickKey) ? 100 : 0
	 			if(rootTrick.dependents || rootTrick.prereqs && !tempNodes[trickKey]){
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				name : rootTrick.name,
		 				involved : involvedRoot
		 			}
		 		}
	 			if(rootTrick.prereqs){
	 				rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				let involvedPrereq = involvedRoot > 0 ? 25 : 0
		 				if(tempNodes[prereqKey] && tempNodes[prereqKey].involved > 25){
		 					involvedPrereq = tempNodes[prereqKey].involved
		 				}
		 				tempNodes[prereqKey] = {
		 					id: prereqKey,
		 					name: prereq.name,
		 					involved : involvedPrereq
		 				}
		 				if(trickKey == "Box"){
		 					console.log("pre",prereqKey, involvedPrereq)
		 				}
		 				edges.push({ data: { source: trickKey, target: prereqKey } })
			 		})
	 			}
 				if(rootTrick.dependents){
 					rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
		 				let involvedDependent = involvedRoot > 0 ? 75 : 0
		 				if(tempNodes[dependentKey] && tempNodes[dependentKey].involved > 75){
		 					involvedDependent = tempNodes[dependentKey].involved
		 				}
		 				if(trickKey == "Box"){
		 					console.log("dep",dependentKey, involvedDependent)
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
	 		if(trickKey == "Shower"){
		 		console.log(tempNodes[trickKey])
		 	}
	 		nodes.push({ data: {...tempNodes[trickKey]}})
	 	})
 		this.setState({edges, nodes})
 	}
 	render(){
 		const search= <div>
	 						<label>Find trick </label><input onChange={this.searchInputChange}/>
	 						<button type="submit" onClick={this.searchTrick}>Search</button>
	 				  </div>

 		const buttonFilterClass = (num)=>{
 			let className = "unselectedFilterButton"
 			 if(this.state.filters.includes(num)){
 			 	className = "selectedFilterButton"
 			 }
 			 return className
 		}
 		console.log("rendering app", this.state.myTricks)
		return (
		<div className="App">
			<div>
				<button className={this.state.selectedList == "myTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{this.setListType("myTricks")}}>My Tricks</button>
				<button className={this.state.selectedList == "allTricks" ? "selectedListButton" : "unselectedListButton" } onClick={()=>{this.setListType("allTricks")}}>All Tricks</button>
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
