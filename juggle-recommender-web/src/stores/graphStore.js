import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"
import filterStore from "./filterStore"

configure({ enforceActions: "always" })
class GraphStore {

	@observable nodes = []
	@observable edges = []

	@action getInvolvedNodeColor=(difficulty, involved, trickKey)=>{
		let	colorString = "hsl(" + 150*(10-difficulty-2)/10   + ",100%, 60%)"

      	let color = {
      		background : "white",
            border:  colorString,
        }
        if(store.myTricks[trickKey] && store.myTricks[trickKey].catches > 0){
        	color = {
				background : colorString,
            	border:  colorString,
        	}
        }else if (store.myTricks[trickKey] && store.myTricks[trickKey].catches === 0){
        	color = {
				background : "white",
            	border:  colorString,
        	}
        }
		return color
	}
	@action getSelectedInvolvedNodeColor=(difficulty, involved)=>{
		let	colorString = "hsl(" + 150*(10-difficulty-2)/10   + ",100%, 60%)"
      	const color = {
      		background : colorString,
        }
		return color
	}

	@action getInvolvedNodeSize=(involved)=>{
		let size = 20 //default
		if(involved === 3){
			size = 120
		}
		return size
	}
	@action getInvolvedNodeFont=(involved)=>{
		let fontSize = 14 //default
		let strokeWidth = 0
		if(involved === 3){
			fontSize = 30
			strokeWidth = 1

		}
		return {
			size: fontSize,
			strokeWidth :strokeWidth,
			strokeColor: 'black'
		}
	}
	@action getInvolvedNodeMass =(involved)=>{
		let mass = 2
		if(involved === 3){
			mass = 6
		}
		return mass
	}

	@action getInvolvedNodeBorderWidth=(involved)=>{		
		return 2
	}
	@action updateGraphData=()=>{
 		let nodes = []
 		let tempNodes = {}
 		let edges = []
 		let rootTricks = uiStore.rootTricks
 		if(uiStore.selectedTrick){
 			rootTricks=[uiStore.selectedTrick]
 		}
	 	if(uiStore.selectedList === "myTricks" ){
	 		rootTricks.forEach((trickKey)=>{
	 			const rootTrick = store.library[trickKey]
	 			if(!rootTrick){return}
	 			tempNodes[trickKey] = {
	 				id: trickKey,
	 				label: "★" + rootTrick.name,
	 				color : this.getInvolvedNodeColor(rootTrick.difficulty, 3, trickKey),
	 				size : this.getInvolvedNodeSize(3),
	 				font : this.getInvolvedNodeFont(3),
	 				mass : this.getInvolvedNodeMass(3),
	 				borderWidth : this.getInvolvedNodeBorderWidth(3)
	 			}		 		
		 		if(rootTrick.prereqs && 
		 			(filterStore.associations.includes('prereqs') ||
		 			 filterStore.associations.length === 0)){
		 			rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = store.library[prereqKey]
		 				if (!prereq){return}
		 				if(!tempNodes[prereqKey]){
			 				tempNodes[prereqKey] = {
			 					id: prereqKey,
			 					label: prereq.name,
			 					color : this.getInvolvedNodeColor(prereq.difficulty, 1, prereqKey)
			 				}
			 			}
		 				edges.push({from: prereqKey, to: trickKey })
		 			})
		 		}
	 			if(rootTrick.dependents && 
		 			(filterStore.associations.includes('postreqs') ||
		 			 filterStore.associations.length === 0)){
		 			rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = store.library[dependentKey]
		 				if (!dependent){return}
			 			if(!tempNodes[dependentKey]){
			 				tempNodes[dependentKey] = {
			 					id: dependentKey,
			 					label: dependent.name,
			 					color : this.getInvolvedNodeColor(dependent.difficulty, 2, dependentKey)
			 				}
			 			}
		 				edges.push({from: trickKey, to: dependentKey })
		 			})
		 		}
		 		if(rootTrick.related && 
		 			(filterStore.associations.includes('related') ||
		 			 filterStore.associations.length === 0)){
		 			rootTrick.related.forEach((relatedKey)=>{
		 				relatedKey = relatedKey.replace("-","")
 						relatedKey = relatedKey.replace(" ","")
		 				const related = store.library[relatedKey]
		 				if (!related){return}
			 			if(!tempNodes[relatedKey]){
			 				tempNodes[relatedKey] = {
			 					id: relatedKey,
			 					label: related.name,
			 					color : this.getInvolvedNodeColor(related.difficulty, 2, relatedKey)
			 				}
			 			}

		 				edges.push({arrows : {to : false}, from: trickKey, to: relatedKey, dashes: true })
		 			})
		 		}
 			})
	 	}else if(uiStore.selectedList === "allTricks"){
	 		rootTricks.forEach((trickKey)=>{
	 			const rootTrick = store.library[trickKey]
	 			if(!rootTrick){return}
	 			const involvedRoot = store.myTricks[trickKey] || 
	 							uiStore.selectedTrick === trickKey ? 3 : 0

	 			if((!tempNodes[trickKey]||tempNodes[trickKey].involved < involvedRoot)){
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
		 				color : this.getInvolvedNodeColor(rootTrick.difficulty, involvedRoot, trickKey),
		 				involved : involvedRoot,
		 				size : this.getInvolvedNodeSize(involvedRoot),
		 				font : this.getInvolvedNodeFont(involvedRoot),
		 				mass : this.getInvolvedNodeMass(involvedRoot),
		 				borderWidth : this.getInvolvedNodeBorderWidth(involvedRoot)
		 			}	 			
		 		}	
		 		if(rootTrick.prereqs && 
		 			(filterStore.associations.includes('prereqs') ||
		 			 filterStore.associations.length === 0)){
	 				rootTrick.prereqs.forEach((prereqKey)=>{
		 				const prereq = store.library[prereqKey]
		 				if (!prereq){
		 					console.log("!prereq-prereqKey: ",prereqKey +","+ trickKey)
		 				}
		 				if (!prereq){return}
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
		 					color : this.getInvolvedNodeColor(prereq.difficulty, involvedPrereq, prereqKey),
		 					involved : involvedPrereq,
		 					size : this.getInvolvedNodeSize(involvedPrereq),
		 					font : this.getInvolvedNodeFont(involvedPrereq),
							mass : this.getInvolvedNodeMass(involvedPrereq),
							borderWidth : this.getInvolvedNodeBorderWidth(involvedPrereq),
		 				}
		 				edges.push({from: prereqKey, to: trickKey })
			 		})
	 			}
	 			if(rootTrick.dependents && 
		 			(filterStore.associations.includes('postreqs') ||
		 			 filterStore.associations.length === 0)){
 					rootTrick.dependents.forEach((dependentKey)=>{
		 				const dependent = store.library[dependentKey]
		 				if (!dependent){return}
		 				let involvedDependent = involvedRoot > 0 ? 2 : 0
		 				let label
		 				
		 				label = dependent.name
		 				 
		 				if(tempNodes[dependentKey] && tempNodes[dependentKey].involved > involvedDependent){
		 					involvedDependent = tempNodes[dependentKey].involved
			 				if(involvedDependent === 3){
				 				label = "★" + dependent.name
				 			}
		 				}
		 				
		 				tempNodes[dependentKey] = {
		 					id: dependentKey,
		 					label: label,
		 					color : this.getInvolvedNodeColor(dependent.difficulty, involvedDependent, dependentKey),
		 					involved : involvedDependent,
		 					size : this.getInvolvedNodeSize(involvedDependent),
		 			 		font : this.getInvolvedNodeFont(involvedDependent),
		 			 		mass : this.getInvolvedNodeMass(involvedDependent),
		 			 		borderWidth : this.getInvolvedNodeBorderWidth(involvedDependent),
		 				}	
		 				edges.push({from: trickKey , to: dependentKey })
		 			
		 			})
 				}
		 		if(rootTrick.related && 
		 			(filterStore.associations.includes('related') ||
		 			 filterStore.associations.length === 0)){
 					rootTrick.related.forEach((relatedKey)=>{
 						//TODO: fix in library
 		 				if (!store.library[relatedKey]){
		 					console.log("!store.library[relatedKey]: ",relatedKey +","+ trickKey)
		 				}
 						relatedKey = relatedKey.replace("-","")
 						relatedKey = relatedKey.replace(" ","")

		 				const related = store.library[relatedKey]
		 				if (!related){return}
		 				let involvedRelated = involvedRoot > 0 ? 2 : 0
		 				let label
		 				
		 				label = related.name
		 				 
		 				if(tempNodes[relatedKey] && tempNodes[relatedKey].involved > involvedRelated){
		 					involvedRelated = tempNodes[relatedKey].involved
			 				if(involvedRelated === 3){
				 				label = "★" + related.name
				 			}
		 				}
		 				
		 				tempNodes[relatedKey] = {
		 					id: relatedKey,
		 					label: label,
		 					color : this.getInvolvedNodeColor(related.difficulty, involvedRelated, relatedKey),
		 					involved : involvedRelated,
		 					size : this.getInvolvedNodeSize(involvedRelated),
		 			 		font : this.getInvolvedNodeFont(involvedRelated),
		 			 		mass : this.getInvolvedNodeMass(involvedRelated),
		 			 		borderWidth : this.getInvolvedNodeBorderWidth(involvedRelated),
		 				}	
		 				edges.push({arrows : {to : false},from: trickKey , to: relatedKey , dashes: true})
		 			
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
}

const graphStore = new GraphStore()

export default graphStore