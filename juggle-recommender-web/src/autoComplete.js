import React,{Component} from 'react'
import store from "./stores/store"
import './App.css';
import './autoComplete.css'

class AutoComplete extends Component {

	render() {
		const lowerCaseInput = this.props.input.toLowerCase()
		let matchedNames = []
	 	const options = this.props.optionsList.map((key, i)=>{
	 		let name = null
	 		if (this.props.optionsListType === 'name'){
		 		name = store.library[key].name
		 	}else if(this.props.optionsListType === 'tags'){
		 		name = this.props.optionsList[i]
		 	}
	 		let lowerCaseName = name.toLowerCase()
	 		const ballMatch = lowerCaseName.match(/\(\d+b\)$/)
	 		if(ballMatch){
	 			lowerCaseName = lowerCaseName.slice(0,ballMatch.index)
	 			name = name.slice(0,ballMatch.index)
	 		}
		 		if((lowerCaseName.includes(lowerCaseInput) && 
	 			!matchedNames.includes(lowerCaseName)) || 
				//..or if it is less than 4 then it is demo types and 
				//we want to show whehter the input matches or not
	 			this.props.optionsList.length < 4){
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
	 			}else{
	 				return null
	 			}
	 	})
		return (
			<div className = "options">
				{options}
			</div>
		)
	  }
}
export default AutoComplete