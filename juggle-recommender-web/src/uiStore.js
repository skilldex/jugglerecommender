import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class UIStore {

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

	@action setPopupTrickToNull=()=>{
	 	this.popupTrick = null

	}

	@action toggleCatchEdit=(catches, trickKey)=>{
		this.popupCatchEditable = !this.popupCatchEditable
		if (!this.popupCatchEditable){
			store.setCatches(catches, trickKey)
			store.updateTricksInDatabase()
 			localStorage.setItem('myTricks', JSON.stringify(store.myTricks))
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
 		this.popupTrick = null
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
	 	graphStore.updateGraphData()
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