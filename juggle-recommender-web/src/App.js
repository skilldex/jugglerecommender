import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickCheckboxes from './trickCheckboxes.js'
import TrickList from './trickList.js'
class App extends Component {
 	state = {
 		filters : [3],
 		checkedTricks : {},
 		searchInput : "",
 		searchTrick : "",
 		selectedTricks : []
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
 	searchTrick=()=>{
 		this.setState({
 			searchTrick: this.state.searchInput
 		})
 	}
 	selectTricks=(selectedTricks)=>{
 		this.setState({
 			selectedTricks
 		})
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
		return (
		<div className="App">
			<TrickList selectTricks={this.selectTricks}/>
			<TrickGraph checkedTricks={this.state.selectedTricks} search={this.state.searchTrick} filters={this.state.filters}/>
		</div>
		);
	}
}

export default App;
