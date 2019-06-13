import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import filterStore from "./filterStore"
import authStore from "./authStore"


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
	@observable popupTimer = null
	@observable addingTrick = false

	@action toggleAddingTrick = ()=>{
		if (!authStore.user){
			window.alert("You must be signed in to add a trick");
		}else{
			this.popupTrick = null
			this.addingTrick = !this.addingTrick
		}
	}
	@action closePopups = ()=>{
		this.popupTrick = null
		this.addingTrick = false
	}
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
 	@action selectLastUpdated=()=>{
		if(this.lastTrickUpdated){
	    	console.log("it was this one")
		  	this.toggleSelectTrick([this.lastTrickUpdated])
    	}else{
    		this.toggleSelectTrick(['Cascade'])
    	}
	}
 	@action setSelectedList=(listType)=>{
 		this.selectedList = listType
 		this.popupTrick = null
 		this.popupCatchEditable = false
 		if(listType == "myTricks"){
 			filterStore.setTags([])
 			filterStore.setNumBalls([])
 		}
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
 		if(Object.keys(store.library).length == 0){ return }
	 	this.rootTricks = []
 		let sortedJugglingLibrary
	 	if (filterStore.sortType === 'alphabetical'){
		 	sortedJugglingLibrary = this.alphabeticalSortObject(store.library, 'name');
		}else if (filterStore.sortType === 'difficulty'){
		 	sortedJugglingLibrary = this.alphabeticalSortObject(store.library, 'difficulty');
		}
		const filterTagNames= []
		filterStore.tags.forEach(function (arrayItem) {
		    filterTagNames.push(arrayItem.id)
		});
		Object.keys(sortedJugglingLibrary).forEach((trickKey, i) => {
			if(this.selectedList === "allTricks" || 
			  (this.selectedList === "myTricks" && store.myTricks[trickKey])){
				const trick = sortedJugglingLibrary[trickKey]
				const tagsInFilter = trick.tags? trick.tags.filter((tag)=>{
					if (filterTagNames.includes(tag)){
						return tag
					}
				}) : []
				let thisTricksCatches = 0
				if(store.myTricks[trickKey] && store.myTricks[trickKey].catches){
					thisTricksCatches = parseInt(store.myTricks[trickKey].catches)
				}
				if(
				   parseInt(trick.difficulty) >= filterStore.difficultyRange[0] && 
				   parseInt(trick.difficulty) <= filterStore.difficultyRange[1] &&
				   (tagsInFilter.length >= filterTagNames.length || filterTagNames.length == 0) &&
				   (filterStore.numBalls.includes(trick.num.toString()) || filterStore.numBalls.length == 0) &&
				   thisTricksCatches >= parseInt(filterStore.minCatches) &&
				   thisTricksCatches <= parseInt(filterStore.maxCatches) &&
				   (this.searchTrick === '' || trick.name.toUpperCase().includes(this.searchTrick.toUpperCase()))
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

	 @action clearCatchInput=()=>{
	 	this.catchInput = ''
	 }
}

const uiStore = new UIStore()

export default uiStore