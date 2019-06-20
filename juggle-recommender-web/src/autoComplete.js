import React,{Component} from 'react'
import store from "./stores/store"
import './App.css';
import './autoComplete.css'

class AutoComplete extends Component {

	render() {
		const input = this.props.input
		let matchedNames = []
	 	const options = Object.keys(store.library).map((key)=>{
	 		let name = store.library[key].name.toLowerCase()
	 		//ends with ball num
	 		const ballMatch = name.match(/\(\d+b\)$/)
	 		if(ballMatch){
	 			name = name.slice(0,ballMatch.index)
	 		}
	 		//avoid duplicates
	 		if(name.includes(input) && !matchedNames.includes(name)){
	 			const matchIndex = name.indexOf(input)
	 			matchedNames.push(name)
	 			return <div className="option" onClick={()=>{this.props.setAutoCompletedName(name)}}>
			 				<span>{name.slice(0,matchIndex)}</span>
			 				<span className="match">{input}</span>
			 				<span>{name.slice(matchIndex+input.length,)}</span>
	 					</div>

	 		}
	 	})
	 	console.log("options",options)
		return (
			<div className = "options">{options}</div>
		)
	  }
}
export default AutoComplete