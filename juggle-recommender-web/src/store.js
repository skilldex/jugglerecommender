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
	@observable expandedSections = {
		'3' : true,
		'4' : false,
		'5' : false
	}
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
 	}
 	@action setSelectedList=(listType)=>{
 		this.selectedList = listType
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
					let shouldPushTrick = true
					
					if (trick.num === 3 && this.expandedSections['3'] ){//&&
						// (trick.name.includes(this.searchTrick) || 
						// 	this.searchTrick === "")){
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
	@action getInvolvedNodeColor=(involvement)=>{
		
		if(involvement == 0){
			return "cyan"
		}
		if(involvement == 1){
			return "pink"
		}
		if(involvement == 2){
			return "orange"
		}
		if(involvement == 3){
			return "yellow"
		}
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
		 				color : this.getInvolvedNodeColor(3)
		 			}
		 		}
		 		if(rootTrick.prereqs){
		 			rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = jugglingLibrary[prereqKey]
		 				if(!tempNodes[prereqKey]){
			 				tempNodes[prereqKey] = {
			 					id: prereqKey,
			 					label: prereq.name,
			 					color : this.getInvolvedNodeColor(1)
			 				}
			 			}
		 				edges.push({from: trickKey, to: prereqKey})

		 			})
		 		}
	 			if(rootTrick.dependents){
		 			rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = jugglingLibrary[dependentKey]
			 			if(!tempNodes[dependentKey]){
			 				tempNodes[dependentKey] = {
			 					id: dependentKey,
			 					label: dependent.name,
			 					color : this.getInvolvedNodeColor(2)
			 				}
			 			}
		 				edges.push({from: dependentKey, to: trickKey})

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
		 				color : this.getInvolvedNodeColor(involvedRoot)
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
		 					color : this.getInvolvedNodeColor(involvedPrereq)
		 				}

		 				edges.push({from: trickKey, to: prereqKey})
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
		 					color : this.getInvolvedNodeColor(involvedDependent)
		 				}
		 				edges.push({from: dependentKey, to: trickKey})
		 			})
 				}
 					
 			})
	 	}
	 	Object.keys(tempNodes).forEach((trickKey)=>{
	 		nodes.push({...tempNodes[trickKey]})
	 	})

	 	console.log("nodes ", toJS(nodes))
	 	this.nodes = nodes
	 	this.edges = edges
 	}

 	@action toggleExpandedSection=(section)=>{
	 	console.log("Expanded " ,this.expandedSections, section)
	 	this.expandedSections[section] = !this.expandedSections[section]
	 	this.updateRootTricks()
	 }
}

const store = new Store()

export default store