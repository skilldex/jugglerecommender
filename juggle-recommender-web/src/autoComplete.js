import React,{Component} from 'react'
import store from "./stores/store"
import uiStore from "./stores/uiStore"
import './App.css';
import './autoComplete.css'

class AutoComplete extends Component {

	render() {
		const input = this.props.input
		const lowerCaseInput = this.props.input.toLowerCase()
		let matchedNames = []
	 	const options = Object.keys(store.library).map((key)=>{
	 		let name = store.library[key].name.toLowerCase()
	 		//ends with ball num
	 		const ballMatch = name.match(/\(\d+b\)$/)
	 		if(ballMatch){
	 			name = name.slice(0,ballMatch.index)
	 		}
	 		//avoid duplicates
	 		if(name.includes(lowerCaseInput) && !matchedNames.includes(name)){
	 			const matchIndex = name.indexOf(lowerCaseInput)
	 			matchedNames.push(name)
	 			return <div className="option" 
	 						onClick={()=>{this.props.setAutoCompletedName
	 								(input+name.substring(input.length))}}>
			 				<span>{name.slice(0,matchIndex)}</span>
			 				<span className="match">{lowerCaseInput}</span>
			 				<span>{name.slice(matchIndex+lowerCaseInput.length,)}</span>
	 					</div>
	 		}
	 	})
		return (
			<div className = "options">
				{uiStore.editingPopupTrick && matchedNames.length<2?null:options}
			</div>
		)
	  }
}
export default AutoComplete