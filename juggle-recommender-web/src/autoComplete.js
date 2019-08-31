import React,{Component} from 'react'
import store from "./stores/store"
import uiStore from "./stores/uiStore"
import './App.css';
import './autoComplete.css'

class AutoComplete extends Component {

	render() {
		const lowerCaseInput = this.props.input.toLowerCase()
		let matchedNames = []
	 	const options = this.props.optionsList.map((key, i)=>{
	 		let name = null
	 		if (this.props.optionsListType == 'name'){
		 		name = store.library[key].name
		 	}else if(this.props.optionsListType == 'tags'){
		 		name = this.props.optionsList[i]
		 	}
	 		let lowerCaseName = name.toLowerCase()
	 		const ballMatch = lowerCaseName.match(/\(\d+b\)$/)
	 		if(ballMatch){
	 			lowerCaseName = lowerCaseName.slice(0,ballMatch.index)
	 			name = name.slice(0,ballMatch.index)
	 		}
	 		console.log('matchedNames',matchedNames,name,lowerCaseName,lowerCaseInput)
	 		if(lowerCaseName.includes(lowerCaseInput) && 
	 			!matchedNames.includes(lowerCaseName) || 
	 			this.props.optionsList.length < 4){
	 			console.log('lessThan4')
	 			const matchIndex = lowerCaseName.indexOf(lowerCaseInput)
	 			matchedNames.push(lowerCaseName)
	 			let optionClassName = "option"
	 			return this.props.optionsList.length < 4?
	 					<div className={optionClassName}
	 						onClick={()=>{this.props.setAutoCompletedName(name)}}>
			 				<span>{name}</span>
	 					</div>
	 					: <div className={optionClassName}
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