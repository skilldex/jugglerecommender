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
 	@action toggleSelectedTrick=(clickedTrick)=>{
 		if (this.selectedTricks.includes(clickedTrick)){
 			for (var i=this.selectedTricks.length-1; i>=0; i--) {
			    if (this.selectedTricks[i] === clickedTrick) {
			        this.selectedTricks.splice(i, 1);
			    }
			}
 		}else{
	 		this.selectedTricks.push(clickedTrick)
	 	}
	 	this.updateRootTricks()
	 	if(!clickedTrick.includes(clickedTrick)){
	 		this.popupTrick = null
	 	}
	 	this.popupTrick = null
	 	this.popupCatchEditable = false	 	
 	}

	@action resetSelectedTrick=()=>{
		for(let i = 0; i<this.selectedTricks.length; i++){
			const trick = this.selectedTricks[i]
			if (!uiStore.rootTricks.includes(trick)){
				this.selectedTricks.splice(i, 1);
			}
		}
		if (this.selectedTricks.length<1){
			this.selectTopTrick()
		}
	}
	@action selectTopTrick=()=>{
		if (uiStore.rootTricks.length>0){
			this.selectedTricks = [uiStore.rootTricks[0]]
		}
	}
	@action selectTrick=(trick)=>{
		this.selectedTricks = [trick]
	}
 	@action setSelectedList=(listType)=>{
 		this.selectedList = listType
 		this.popupTrick = null
 		this.popupCatchEditable = false
 		this.resetSelectedTrick()
 		this.updateRootTricks()
 	}

 	@action setSearchInput=(newInput)=>{
 		this.searchInput = newInput
 		this.performSearch()
 	}

 	@action	searchInputChange=(e)=>{
		uiStore.searchInput = e.target.value 		
		if(e.target.value === ""){
			this.searchTrick = ""
		}
		this.performSearch()
		//this.popupTrick = null
		this.resetSelectedTrick()
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
 		if(Object.keys(store.library).length === 0){ return }
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
					thisTricksCatches = parseInt(store.myTricks[trickKey].catches, 10)
				}
				if(
				   parseInt(trick.difficulty, 10) >= filterStore.difficultyRange[0] && 
				   parseInt(trick.difficulty, 10) <= filterStore.difficultyRange[1] &&
				   (tagsInFilter.length >= filterTagNames.length || filterTagNames.length === 0) &&
				   (filterStore.numBalls.includes(trick.num.toString()) || filterStore.numBalls.length === 0) &&
				   thisTricksCatches >= parseInt(filterStore.minCatches, 10) &&
				   thisTricksCatches <= parseInt(filterStore.maxCatches, 10) &&
				   (this.searchTrick === '' || trick.name.toUpperCase().includes(this.searchTrick.toUpperCase()))
				 ){
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