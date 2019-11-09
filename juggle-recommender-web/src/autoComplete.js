import React,{Component} from 'react'
import store from "./stores/store"
import './App.css';
import './autoComplete.css'
import utilities from './utilities'

class AutoComplete extends Component {

	sortOptionsList=()=>{
		const optionsListPreSort = []
		const lowerCaseInput = this.props.input.toLowerCase()
		let propsOptionsList = []
		//this converts the tags from observable to plain arrays
		if (this.props.optionsListType === 'tags'){
			this.props.optionsList.forEach((tag)=>{
				propsOptionsList.push(tag)
			});						
		}else{
			propsOptionsList = this.props.optionsList
		}
		for (var index in propsOptionsList) {
			let item = propsOptionsList[index]
			let name = null
			if (this.props.optionsListType === 'name'){
		 		name = store.library[item].name
		 	}else{
		 		name = item
		 	}
	      	const optionObj = {}
			const lowerCaseItemName = name.toLowerCase()
			const relevance = utilities.compareStrings(lowerCaseInput, lowerCaseItemName)
			if (relevance !== null){
				optionObj.key = item
				optionObj.relevance = relevance
				optionsListPreSort.push(optionObj)
			}	      
	    }
	    const sortedTricksToListObjs = optionsListPreSort.sort(function(a, b) {   
           return a.relevance > b.relevance ? 1 : ( 
	            	a.relevance < b.relevance ? -1 : 
		            a.key.length > b.key.length ? 1 : 
		            a.key.length < b.key.length ? -1 : 0      	
           );               
	    }); 
	    const optionsListToReturn = []
	    Object.keys(sortedTricksToListObjs).forEach((index, i) => {
	      optionsListToReturn.push(sortedTricksToListObjs[index].key)
	    })
	    return optionsListToReturn
	}

	render() {		
		let matchedNames = []
		const options = []
		const lowerCaseInput = this.props.input.toLowerCase()		
		const sortedOptionsList = this.sortOptionsList()
		//this is for the demo type dropdown, show all its options no matter the user input
		if (this.props.optionsList.length < 4 || lowerCaseInput.length < 2){
			this.props.optionsList.forEach((name, i)=>{
 				options.push(
 					<div className="option"
 						key={name}
 						onClick={()=>{this.props.setAutoCompletedName(name)}}>
		 				<span>{name}</span>
 					</div>
 				)
		 	})
		}else{
			sortedOptionsList.forEach((key, i)=>{
		 		let name = null
		 		if (this.props.optionsListType === 'name'){
			 		name = store.library[key].name
			 	}else if(this.props.optionsListType === 'tags'){
			 		name = sortedOptionsList[i]
			 	}
		 		let lowerCaseName = name.toLowerCase()
		 		const ballMatch = lowerCaseName.match(/\(\d+b\)$/)
		 		if(ballMatch){
		 			lowerCaseName = lowerCaseName.slice(0,ballMatch.index)
		 			name = name.slice(0,ballMatch.index)
		 		}
		 		const relevance = utilities.compareStrings(lowerCaseInput, lowerCaseName)
		 		if(relevance !== null && !matchedNames.includes(lowerCaseName)){
		 			const matchIndex = lowerCaseName.includes(lowerCaseInput) ? lowerCaseName.indexOf(lowerCaseInput) :-1
		 			matchedNames.push(lowerCaseName)
	 				options.push(
	 					<div className="option"
	 						key={name}
	 						onClick={()=>{this.props.setAutoCompletedName(name)}}>
	 						{matchIndex>-1?
		 						<div>
					 				<span>{name.slice(0,matchIndex)}</span>
					 				<span className="match">{name.slice(matchIndex,matchIndex+lowerCaseInput.length)}</span>
					 				<span>{name.slice(matchIndex+lowerCaseInput.length,)}</span>
					 			</div>
					 			:<span>{name}</span>
					 		}
	 					</div>	
	 				)		 			
		 		}				
 			})
	 	}
		return (
			<div className = "options">
				{options}
			</div>
		)
	  }
}
export default AutoComplete