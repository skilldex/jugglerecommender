import { action, configure, observable} from "mobx"
import store from "./store"
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class UIStore {

	@observable nodes = []
	@observable edges = []
	@observable selectedTricks = []
	@observable selectedList = "allTricks"
	@observable rootTricks = []
	@observable searchInput = ''
	@observable searchTrick = ''
	@observable listExpanded = true
	@observable popupCatchEditable = false
	@observable popupTrick = null
	@observable expandedSections = {
		'3' : true,
		'4' : false,
		'5' : false
	}


	@action setListExpanded=(expanded)=>{
		this.listExpanded = expanded
	}

	@action setPopupTrick=(clickedTrick)=>{
	 	this.popupTrick = clickedTrick
	 	this.popupCatchEditable = false
	}

	@action toggleCatchEdit=(catches, trickKey)=>{
		this.popupCatchEditable = !this.popupCatchEditable
		if (!this.popupCatchEditable){
			store.setCatches(catches, trickKey)
			store.updateTricksInDatabase()
 			localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
		}
	}
 	@action selectTricks=(clickedTrick)=>{
 		if (this.selectedTricks.includes(clickedTrick[0])){
 			for (var i=this.selectedTricks.length-1; i>=0; i--) {
			    if (this.selectedTricks[i] === clickedTrick[0]) {
			        this.selectedTricks.splice(i, 1);
			    }
			}
 		}else{
	 		this.selectedTricks.push(clickedTrick[0])
	 	}
	 	this.updateRootTricks()
	 	if(!clickedTrick.includes(clickedTrick[0])){
	 		this.popupTrick = null
	 	}
	 	this.popupTrick = null
	 	this.popupCatchEditable = false
	 	
 	}
 	@action setSelectedList=(listType)=>{
 		this.selectedTricks = []
 		this.selectedList = listType
 		this.updateRootTricks()
 		this.popupTrick = null
 		this.popupCatchEditable = false
 		
 	}
 	@action setSearchInput=(newInput)=>{
 		this.searchInput = newInput
 		this.performSearch()
 	}

 	@action	searchInputChange=(e)=>{
 		this.searchInput = e.target.value 		
 		if(e.target.value === ""){
 			this.searchTrick = ""
 		}
 		this.performSearch()
 	}
 		
 	@action performSearch=()=>{
 		this.selectedTricks = []
 		this.searchTrick = this.searchInput
 		this.updateRootTricks()
 	}
 	@action updateRootTricks=()=>{
	 	this.rootTricks = []
	 	if (this.selectedTricks.length > 0){
	 		Array.prototype.push.apply(this.rootTricks, this.selectedTricks);
	 	}else{
		 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
				if(this.selectedList === "allTricks" || 
					(this.selectedList === "myTricks" && store.myTricks[trickKey])
				){
					const trick = jugglingLibrary[trickKey]
					let shouldPushTrick = false			
					var fullStringToSearch = trick.name.toLowerCase()
					trick.tags.forEach(function (tag, index) {
						fullStringToSearch = fullStringToSearch + " " + tag.toLowerCase()
					});
					if (trick.num === 3 && this.expandedSections['3'] &&
						(fullStringToSearch.toLowerCase().includes(this.searchTrick.toLowerCase()) || 
							this.searchTrick === "")){
						shouldPushTrick = true
					}
					if (trick.num === 4 && this.expandedSections['4']){
						shouldPushTrick = true
					}
					if (trick.num === 5 && this.expandedSections['5']){
						shouldPushTrick = true
					}
					if (shouldPushTrick){
						this.rootTricks.push(
							trickKey
						)
					}
				}
			})
	 	}
	 	this.updateGraphData()
	}

	@action getInvolvedNodeColor=(difficulty, involved)=>{
		let	colorString = "hsl(" + 150*(10-difficulty-2)/10   + ",100%, 60%)"
      	let borderWidth = 1
      	if(involved === 3){
      		borderWidth = 10
      	}
      	const color = {
      		background : colorString,
            border:  'black',
            borderWidth : borderWidth
        }
		return color
	}
	@action getSelectedInvolvedNodeColor=(difficulty, involved)=>{
		let	colorString = "hsl(" + 150*(10-difficulty-2)/10   + ",100%, 30%)"
      	const color = {
      		background : colorString,
        }
		return color
	}

	@action getInvolvedNodeSize=(involved)=>{
		let size = 25 //default
		if(involved === 3){
			size = 100
		}
		return size
	}
	@action getInvolvedNodeFont=(involved)=>{
		let fontSize = 14 //default
		if(involved === 3){
			fontSize = 24
		}
		return {size: fontSize}
	}
	@action getInvolvedNodeMass =(involved)=>{
		let mass = 2
		if(involved === 3){
			mass = 6
		}
		return mass
	}
	@action updateGraphData=()=>{
 		let nodes = []
 		let tempNodes = {}
 		let edges = []
	 	if(this.selectedList === "myTricks" ){
	 		this.rootTricks.forEach((trickKey)=>{
	 			const rootTrick = jugglingLibrary[trickKey]
	 			if(rootTrick.dependents || rootTrick.prereqs){
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				label: "★" + rootTrick.name,
		 				color : this.getInvolvedNodeColor(rootTrick.difficulty, 3),
		 				size : this.getInvolvedNodeSize(3),
		 				font : this.getInvolvedNodeFont(3),
		 				mass : this.getInvolvedNodeMass(3),

		 			}
		 		}
		 		if(rootTrick.prereqs){
		 			rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				if(!tempNodes[prereqKey]){
			 				tempNodes[prereqKey] = {
			 					id: prereqKey,
			 					label: prereq.name,
			 					color : this.getInvolvedNodeColor(prereq.difficulty, 1)
			 				}
			 			}
		 				edges.push({from: prereqKey, to: trickKey })
		 			})
		 		}
	 			if(rootTrick.dependents){
		 			rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
			 			if(!tempNodes[dependentKey]){
			 				tempNodes[dependentKey] = {
			 					id: dependentKey,
			 					label: dependent.name,
			 					color : this.getInvolvedNodeColor(dependent.difficulty, 2)
			 				}
			 			}
		 				edges.push({from: trickKey, to: dependentKey })
		 			})
		 		}
 			})
	 	}else if(this.selectedList === "allTricks"){
	 		this.rootTricks.forEach((trickKey)=>{
	 			const rootTrick = jugglingLibrary[trickKey]
	 			const involvedRoot = store.myTricks[trickKey] || 
	 							this.selectedTricks.includes(trickKey) ? 3 : 0

	 			if((rootTrick.dependents || rootTrick.prereqs) && (!tempNodes[trickKey]||tempNodes[trickKey].involved < involvedRoot)){
		 			let label = rootTrick.name
		 			if(involvedRoot === 3){
		 				label = rootTrick.name
		 				if (store.myTricks[trickKey]){
		 					label = "★" + label
		 				}
		 			}
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				label: label,
		 				color : this.getInvolvedNodeColor(rootTrick.difficulty, involvedRoot),
		 				involved : involvedRoot,
		 				size : this.getInvolvedNodeSize(involvedRoot),
		 				font : this.getInvolvedNodeFont(involvedRoot),
		 				mass : this.getInvolvedNodeMass(involvedRoot),
		 			}	 			
		 		}
	 			if(rootTrick.prereqs){
	 				rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				let involvedPrereq = involvedRoot > 0 ? 1 : 0
		 				let label = prereq.name
		 				
		 				if(
		 					tempNodes[prereqKey] && 
		 					tempNodes[prereqKey].involved > involvedPrereq
		 				){
		 					involvedPrereq = tempNodes[prereqKey].involved
			 				if(involvedPrereq === 3){
				 				label = "★" + prereq.name
				 			}
		 				}

		 				tempNodes[prereqKey] = {
		 					id: prereqKey,
		 					label: label,
		 					color : this.getInvolvedNodeColor(prereq.difficulty, involvedPrereq),
		 					involved : involvedPrereq,
		 					size : this.getInvolvedNodeSize(involvedPrereq),
		 					font : this.getInvolvedNodeFont(involvedPrereq),
							mass : this.getInvolvedNodeMass(involvedPrereq),
		 				}
		 				edges.push({from: prereqKey, to: trickKey })
			 		})
	 			}
 				if(rootTrick.dependents){
 					rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
		 				let involvedDependent = involvedRoot > 0 ? 2 : 0
		 				let label = dependent.name
		 				if(tempNodes[dependentKey] && tempNodes[dependentKey].involved > involvedDependent){
		 					involvedDependent = tempNodes[dependentKey].involved
			 				if(involvedDependent === 3){
				 				label = "★" + dependent.name
				 			}
		 				}
		 				
		 				tempNodes[dependentKey] = {
		 					id: dependentKey,
		 					label: label,
		 					color : this.getInvolvedNodeColor(dependent.difficulty, involvedDependent),
		 					involved : involvedDependent,
		 					size : this.getInvolvedNodeSize(involvedDependent),
		 			 		font : this.getInvolvedNodeFont(involvedDependent),
		 			 		mass : this.getInvolvedNodeMass(involvedDependent),

		 				}	
		 				edges.push({from: trickKey , to: dependentKey })
		 			})
 				}
	
 			})
	 	}
	 	Object.keys(tempNodes).forEach((trickKey)=>{
	 		delete tempNodes[trickKey].involved
	 		if (store.myTricks[trickKey] && !tempNodes[trickKey].label.includes("★")){
	 			tempNodes[trickKey].label = "★" + tempNodes[trickKey].label
	 			tempNodes[trickKey].size = 100
	 			tempNodes[trickKey].font = 24
	 			tempNodes[trickKey].mass = 6
	 		}
	 		nodes.push({...tempNodes[trickKey]})
	 	})
	 	this.nodes = nodes
	 	this.edges = edges
 	}

	 @action showSortMenu=()=>{
		if (document.getElementById("myDropdown")){
	  		document.getElementById("myDropdown").classList.toggle("show");
		}
 	}

	 @action hideSortMenu=()=>{
		document.getElementById("myDropdown").classList['show'] = 'block';
		
 	} 	
 	@action toggleSortTypeShow=()=>{
 		document.getElementById("myDropdown").classList.toggle("show");
 	}

 	@action toggleExpandedSection=(section)=>{
	 	this.expandedSections[section] = !this.expandedSections[section]
	 	this.updateRootTricks()
	 }

	 @action clearCatchInput=()=>{
	 	this.catchInput = ''
	 }
}

const uiStore = new UIStore()

export default uiStore