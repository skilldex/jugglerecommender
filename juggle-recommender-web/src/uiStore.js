import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import filterStore from "./filterStore"
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
	@observable popupTimer = null

	@action setListExpanded=(expanded)=>{
		this.listExpanded = expanded
	}
	@action clearTimer=()=>{
		this.popupTimer = null
	}
	@action setPopupTrick=(clickedTrick)=>{
		this.popupTimer = setTimeout(()=>{
			this.clearTimer()
		}, 500)
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

		@action alphabeticalSortObject(data, attr) {
	    var arr = [];
	    for (var prop in data) {

	        if (data.hasOwnProperty(prop)) {
	            var obj = {};
	            obj[prop] = data[prop];
	            obj.tempSortName = data[prop][attr];
	            arr.push(obj);
	        }
	    }
	    arr.sort(function(a, b) {
	        var at = a.tempSortName,
	            bt = b.tempSortName;
	        return at > bt ? 1 : ( at < bt ? -1 : 0 );
	    });
	    var result = {};
	    for (var i=0, l=arr.length; i<l; i++) {
	        obj = arr[i];
	        delete obj.tempSortName;
	        for (prop in obj) {
	            if (obj.hasOwnProperty(prop)) {
	                var id = prop;
	            }
	        }
	        var item = obj[id];
	        result[Object.keys(obj)] = item;
	    }
	    return result;
	}
	@action containsAny=(trickArray,filterArray)=>{
		let containsAny = false
		for (var i = 0; i < trickArray.length; i++) {
		    if (filterArray.indexOf(trickArray[i]) > -1) {
		        containsAny = true;
		        break;
		    }
		}
		return containsAny
	}



 	@action updateRootTricks=(rootTricks)=>{
	 	this.rootTricks = []
 		let sortedJugglingLibrary
	 	if (filterStore.sortType === 'alphabetical'){
		 	sortedJugglingLibrary = this.alphabeticalSortObject(jugglingLibrary, 'name');
		}else{
		 	sortedJugglingLibrary = this.alphabeticalSortObject(jugglingLibrary, 'difficulty');
		}
		const arrayOfFilterTags= []
		filterStore.tags.forEach(function (arrayItem) {
		    arrayOfFilterTags.push(arrayItem.id)
		});
		
		Object.keys(sortedJugglingLibrary).forEach((trickKey, i) => {
			if(this.selectedList === "allTricks" || 
			  (this.selectedList === "myTricks" && store.myTricks[trickKey])){
				const trick = sortedJugglingLibrary[trickKey]
				if(
				   parseInt(trick.difficulty) >= filterStore.difficultyRange[0] && 
				   parseInt(trick.difficulty) <= filterStore.difficultyRange[1] &&
				   [...arrayOfFilterTags].every(elem => trick.tags.indexOf(elem) > -1) &&
				   filterStore.numBalls.includes(trick.num.toString()) &&
				   (this.searchTrick === '' || trick.name.includes(this.searchTrick))
				 ){

					const cardColor = 
						graphStore.getInvolvedNodeColor(trick.difficulty, 2).background == "white" ? 
						graphStore.getInvolvedNodeColor(trick.difficulty, 2).border :
					 	graphStore.getInvolvedNodeColor(trick.difficulty, 2).background 					
					this.rootTricks.push(trickKey)
				}
			}
		})			
	graphStore.updateGraphData()
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