import { action, configure, computed, observable, toJS} from "mobx"
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class Store {
	@observable myTricks = []
	@observable selectedTricks = []
	@observable selectedList = "allTricks"
	@observable rootTricks = []
	@observable nodes = []
	@observable edges = []
	@observable searchInput = 'common'
	@observable searchTrick = 'common'
	@observable expandedSections = {
		'3' : true,
		'4' : false,
		'5' : false
	}
	@observable popupTrick = null
	@action addToMyTricks=(trickKey)=>{
 		this.myTricks.push(trickKey)
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 		this.updateRootTricks()
 	}
 	@action setMyTricks=(tricks)=>{
 		this.myTricks = tricks
 		this.updateRootTricks()
 	}
 	@action removeFromMyTricks=(trickKey)=>{
 		var index = this.myTricks.indexOf(trickKey);
		if (index > -1) {
		  this.myTricks.splice(index, 1);
		}
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 		this.updateRootTricks()
 	}
 	@action selectTricks=(selectedTricks)=>{
 		if (this.selectedTricks[0] === selectedTricks[0] && this.selectedTricks.length === 1){
			this.selectedTricks = []
	 	}else{
	 		this.selectedTricks = selectedTricks
	 	}
	 	this.updateRootTricks()
	 	if(!selectedTricks.includes(selectedTricks[0])){
	 		this.popupTrick = null
	 	}
 	}
 	@action setSelectedList=(listType)=>{
 		this.selectedTricks = []
 		this.selectedList = listType
 		this.updateRootTricks()
 		this.popupTrick = null
 	}
 	@action	searchInputChange=(e)=>{
 		this.searchInput = e.target.value 		
 		console.log("search", e.target.value)
 		if(e.target.value === ""){
 			this.searchTrick = ""
 		}
 		this.performSearch()
 	}
 		
 	@action performSearch=()=>{
 		this.searchTrick = this.searchInput
 		this.updateRootTricks()
 	}
 	@action updateRootTricks=()=>{
	 	this.rootTricks = []
	 	if (this.selectedTricks.length > 0){
			this.rootTricks.push(
				this.selectedTricks[0]
			)
	 	}else{
		 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
				if(this.selectedList === "allTricks" || 
					this.selectedList === "myTricks" && this.myTricks.includes(trickKey)
				){
					const trick = jugglingLibrary[trickKey]
					let shouldPushTrick = false					

					var fullStringToSearch = trick.name.toLowerCase()
					trick.tags.forEach(function (tag, index) {
						fullStringToSearch = fullStringToSearch + " " + tag.toLowerCase()
					});
					
					if (trick.num === 3 && this.expandedSections['3'] &&
						(fullStringToSearch.toLowerCase().includes(store.searchTrick.toLowerCase()) || 
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
		const opacity = 50
		//return "rgba(" + 255*(difficulty-2)/10   + "," + 255*(10 - difficulty-2)/10 + ", 0, 80%)"
		
		let	colorString = "hsl(" + 150*(difficulty-2)/10   + ",0%, 100%)"
		if(involved == 1 || involved == 2 ){
			colorString = "hsl(" + 150*(difficulty-2)/10   + ",100%, 50%)"
		} 
		
		console.log(colorString)
		return colorString

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
		 				label: rootTrick.name,
		 				color : this.getInvolvedNodeColor(rootTrick.difficulty, 3)
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
	 			const involvedRoot = this.myTricks.includes(trickKey) || 
	 							this.selectedTricks.includes(trickKey) ? 3 : 0
	 			if((rootTrick.dependents || rootTrick.prereqs) && (!tempNodes[trickKey]||tempNodes[trickKey].involved < involvedRoot)){
		 			tempNodes[trickKey] = {
		 				id: trickKey,
		 				label: rootTrick.name,
		 				color : this.getInvolvedNodeColor(rootTrick.difficulty, involvedRoot),
		 				involved : involvedRoot
		 			}	 			
		 		}
	 			if(rootTrick.prereqs){
	 				rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				let involvedPrereq = involvedRoot > 0 ? 1 : 0		 				
		 				if(
		 					tempNodes[prereqKey] && 
		 					tempNodes[prereqKey].involved > involvedPrereq
		 				){
		 					involvedPrereq = tempNodes[prereqKey].involved
		 				}
		 				tempNodes[prereqKey] = {
		 					id: prereqKey,
		 					label: prereq.name,
		 					color : this.getInvolvedNodeColor(prereq.difficulty, involvedPrereq),
		 					involved : involvedPrereq
		 				}
		 				edges.push({from: prereqKey, to: trickKey })
			 		})
	 			}
 				if(rootTrick.dependents){
 					rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
		 				let involvedDependent = involvedRoot > 0 ? 2 : 0
		 				if(tempNodes[dependentKey] && tempNodes[dependentKey].involved > involvedDependent){
		 					involvedDependent = tempNodes[dependentKey].involved
		 				}
		 				tempNodes[dependentKey] = {
		 					id: dependentKey,
		 					label: dependent.name,
		 					color : this.getInvolvedNodeColor(dependent.difficulty, involvedDependent),
		 					involved : involvedDependent
		 				}
		 				edges.push({from: trickKey , to: dependentKey })
		 			})
 				}
 					
 			})
	 	}
	 	Object.keys(tempNodes).forEach((trickKey)=>{
	 		delete tempNodes[trickKey].involveds
	 		nodes.push({...tempNodes[trickKey]})
	 	})
	 	this.nodes = nodes
	 	this.edges = edges
 	}

 	@action toggleExpandedSection=(section)=>{
	 	console.log("Expanded " ,this.expandedSections, section)
	 	this.expandedSections[section] = !this.expandedSections[section]
	 	this.updateRootTricks()
	 }

	 @action setPopupTrick=(clickedTrick)=>{
	 	this.popupTrick = clickedTrick
	 }
}

const store = new Store()

export default store