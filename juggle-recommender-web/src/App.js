import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickCheckboxes from './trickCheckboxes.js'
class App extends Component {
 	state = {
 		filters : [3],
 		checkedTricks : {},
 		searchInput : ""
	}
	componentDidMount(){
		const checkedTricks = JSON.parse(localStorage.getItem("checkedTricks"))
		if(checkedTricks){
			console.log("got tricks",checkedTricks)
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
 		console.log("updating tricks")
 		this.setState({checkedTricks})
 		localStorage.setItem('checkedTricks', JSON.stringify(checkedTricks))
 	}
 	searchTrick=(searchTrick)=>{
 		this.setState({searchTrick})
 	}
 	
 	render(){
 		const search= <div>
 					<label>Find trick </label><input onSubmit={this.searchTrick}/>
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
			{search}
			<TrickCheckboxes updateCheckedTricks={this.updateCheckedTricks} />
			<button className={buttonFilterClass(3)} onClick={()=>{this.toggleFilter(3)}}>3 ball</button>
			<button className={buttonFilterClass(4)} onClick={()=>{this.toggleFilter(4)}}>4 ball</button>
			<button className={buttonFilterClass(5)} onClick={()=>{this.toggleFilter(5)}}>5 ball</button>
		  	<TrickGraph checkedTricks={this.state.checkedTricks} search={this.state.searchInput} filters={this.state.filters}/>
		</div>
		);
	}
}

export default App;
