import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TrickGraph from './trickGraph.js'
class App extends Component {
 	state = {
 		filters : [3]
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
		return (
		<div className="App">
			<button onClick={()=>{this.toggleFilter(3)}}>3 ball</button>
			<button onClick={()=>{this.toggleFilter(4)}}>4 ball</button>
			<button onClick={()=>{this.toggleFilter(5)}}>5 ball</button>
		  	<TrickGraph filters={this.state.filters}/>
		</div>
		);
	}
}

export default App;
