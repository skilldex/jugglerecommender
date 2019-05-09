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
 		myTricks : []
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
 		if (Object.keys(this.state.selectedTricks)[0] == Object.keys(selectedTricks)[0] && Object.keys(this.state.selectedTricks).length == 1){
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
 	render(){
 		const search= <div>
	 						<label>Find trick </label><input onChange={this.searchInputChange}/>
	 						<button type="submit" onClick={this.searchTrick}>Search</button>
	 				  </div>
	 	let graphRootTricks = []
	 	let allInvolvedTricks = []

	 	if(this.selectedList == "allTricks"){
	 		Object.keys(jugglingLibrary).forEach((trickKey)=>{
	 			const trick = jugglingLibrary[trickKey]
	 			graphRootTricks.push(trickKey)
	 			if(trick.prereqs){
	 				trick.prereqs.forEach((prereqKey)=>{
	 					//Do stuff with key
	 				})
	 			}

	 		})
	 	}else{
	 		graphRootTricks = this.state.myTricks
	 	}

 		const buttonFilterClass = (num)=>{
 			let className = "unselectedFilterButton"
 			 if(this.state.filters.includes(num)){
 			 	className = "selectedFilterButton"
 			 }
 			 return className
 		}
 		console.log("rendering app", this.state.selectedTricks)
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
			/>
			<TrickGraph 
				myTricks={this.state.myTricks} 
				selectedTricks={this.state.selectedTricks} 
				selectedList={this.state.selectedList}
				search={this.state.searchTrick} 
				filters={this.state.filters}
			/>
		</div>
		);
	}
}

export default App;
