import React,{Component} from 'react'
import store from "./stores/store"
import uiStore from "./stores/uiStore"
import './App.css';
import './autoComplete.css'

class AutoComplete extends Component {

	render() {
		const lowerCaseInput = this.props.input.toLowerCase()
		let matchedNames = []
	 	const options = Object.keys(store.library).map((key)=>{
	 		let name = store.library[key].name
	 		let lowerCaseName = store.library[key].name.toLowerCase()
	 		//ends with ball num
	 		if (this.props.includeBallNums === false){
		 		const ballMatch = lowerCaseName.match(/\(\d+b\)$/)
		 		if(ballMatch){
		 			lowerCaseName = lowerCaseName.slice(0,ballMatch.index)
		 			name = name.slice(0,ballMatch.index)
		 		}
		 	}
	 		//avoid duplicates
	 		if(lowerCaseName.includes(lowerCaseInput) && !matchedNames.includes(lowerCaseName)){
	 			const matchIndex = lowerCaseName.indexOf(lowerCaseInput)
	 			matchedNames.push(lowerCaseName)
	 			let optionClassName = "option"
	 			//we includeBallNums if details page, and so we need borders because 
	 			//	background is white, but this is being replaced by smallTrickList anyways
	 			if (this.props.includeBallNums){
	 				optionClassName = "option optionBorders"
	 			}
	 			return <div className={optionClassName}
	 						onClick={()=>{this.props.setAutoCompletedName(name)}}>
			 				<span>{name.slice(0,matchIndex)}</span>
			 				<span className="match">{name.slice(matchIndex,matchIndex+lowerCaseInput.length)}</span>
			 				<span>{name.slice(matchIndex+lowerCaseInput.length,)}</span>
	 					</div>
	 		}
	 	})
		return (
			<div className = "options">
				{uiStore.editingDetailTrick && matchedNames.length<2?null:options}
			</div>
		)
	  }
}
export default AutoComplete