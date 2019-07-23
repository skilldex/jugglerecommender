import { action, configure, observable} from "mobx"
import store from "./store"
import filterStore from "./filterStore"
import authStore from "./authStore"
import utilities from '../utilities'
import ReactGA from 'react-ga';
import history from '../history';

configure({ enforceActions: "always" })
class UIStore {

	@observable selectedTrick = null
	@observable selectedList = "allTricks"
	@observable rootTricks = []
	@observable searchInput = ''
	@observable searchTrick = ''
	@observable detailCatchEditable = false
	@observable detailTrick = null
	@observable detailTimer = null
	@observable sortTimer = null
	@observable filterTimer = null
	@observable expandedMenuTimer = null
	@observable addingTrick = false
	@observable editingDetailTrick = false
	@observable mouseInSortDiv = false
	@observable mouseInExpandedMenu = false
	@observable showSortDiv = false
	@observable showFilterDiv = false
	@observable showMoreInformation = false
	@observable showExplanation = false
	@observable showExpandedMenu = false
	@observable showHomeScreen = true
	@observable showStatsScreen = false
	@observable showProfileScreen = false
	@observable mainListScrollerPosition = null
	@action toggleShowMoreInformation=()=>{
		this.showMoreInformation = !this.showMoreInformation
	}
	@action toggleShowExplanation=()=>{
		this.showExplanation = !this.showExplanation
	}
	@action toggleShowHomeScreen=()=>{
		this.showHomeScreen = !this.showHomeScreen
	}
	@action setShowHomeScreen=(bool)=>{
		this.showHomeScreen = bool
	}
	@action setShowStatsScreen=(bool)=>{
		this.showStatsScreen = bool
	}
	@action setShowProfileScreen=(bool)=>{
		this.showProfileScreen = bool
	}
  	@action editDetailTrick=()=>{
  		this.editingDetailTrick = true
  		//shows form
  		this.addingTrick = true
  	}
  	@action	handleBackButtonClick=()=>{
	    history.go(-1);
	  }
	@action toggleAddingTrick = ()=>{
		if (!authStore.user){
			window.alert("You must be signed in to add a trick");
		}else{
			this.detailTrick = null
			this.addingTrick = !this.addingTrick
		}
		if(!this.addingTrick){
			this.editingDetailTrick = false
		}
	}
	@action closeDetails = ()=>{
		this.detailTrick = null
		this.addingTrick = false
	}
	@action clearDetailTimer=()=>{
		this.detailTimer = null
	}
	@action setMainListScrollerPosition=(scrollPos)=>{
		this.mainListScrollerPosition = scrollPos
	}
	@action setDetailTrick=(clickedTrick)=>{
		if(this.showMoreInformation){
			this.toggleShowMoreInformation()
		}
		this.detailTimer = setTimeout(()=>{
			this.clearDetailTimer()
		}, 500)
	 	this.detailTrick = clickedTrick
	 	this.detailCatchEditable = false
	 	if (this.detailTrick){
	        if(this.showFilterDiv){
	        	this.toggleFilterDiv()
	        }
	        if(this.showSortDiv){
	        	this.toggleSortDiv()
	        }
	 	}

	}
	@action toggleCatchEdit=(catches, trickKey)=>{
		this.detailCatchEditable = !this.detailCatchEditable		
		if (!this.detailCatchEditable){
			if(!store.myTricks[trickKey]){
				store.myTricks[trickKey] = {}
		 		const date = new Date()
		 		store.myTricks[trickKey].lastUpdated = date.getTime()
		        store.updateTricksInDatabase()
		 		localStorage.setItem('myTricks', JSON.stringify(store.myTricks))
		 		uiStore.updateRootTricks()
			}
			let previousCatches = 0
			if (store.myTricks[trickKey].catches){
				previousCatches = store.myTricks[trickKey].catches
			}
			store.updateTotalCatchCount(catches-previousCatches)
			store.setCatches(catches, trickKey)
			store.updateTricksInDatabase()
 			localStorage.setItem('myTricks', JSON.stringify(store.myTricks))
		}
	}

 	@action toggleSelectedTrick=(clickedTrick)=>{
 		if (this.selectedTrick === clickedTrick){
 			this.selectedTrick = null
 			this.detailCatchEditable = false
 		}else{
	 		this.selectedTrick = clickedTrick
	 	}	 	
 	}

	@action resetSelectedTrick=()=>{
		uiStore.updateRootTricks()
	}

	@action selectTrick=(trick)=>{
		this.selectedTrick = trick
	}
 	@action setSelectedList=(listType)=>{
 		this.selectedList = listType
 		this.detailTrick = null
 		this.detailCatchEditable = false
 		this.resetSelectedTrick()
 		this.updateRootTricks()
 	}

	@action setMouseInSortDiv=(inDiv)=>{
		this.mouseInSortDiv = inDiv
	}
	@action setMouseInExpandedMenu=(inDiv)=>{
		this.mouseInExpandedMenu = inDiv
	}
    @action clearSortTimer=()=>{
		this.sortTimer = null
	}
	@action toggleSortDiv=()=>{
	  this.setShowExpandedMenu(false)
      if(!this.showSortDiv){
      	this.setShowSortDiv(true)
        if(this.showFilterDiv){
          this.toggleFilterDiv()
        }
      }else{
      	this.setShowSortDiv(false)
      }
    }
	@action setShowSortDiv=(showDiv)=>{
		this.sortTimer = setTimeout(()=>{
			this.clearSortTimer()
		}, 500)
		this.showSortDiv=showDiv
	}

 	@action clearFilterTimer=()=>{
		this.filterTimer = null
	}
	@action toggleFilterDiv=()=>{
		this.setShowExpandedMenu(false)
		if(!this.showFilterDiv){
	      	this.setShowFilterDiv(true)
	        if (filterStore.maxCatches > store.highestCatches){
				filterStore.setMaxCatches(store.highestCatches)
			}
	    }else{
	    	if(!store.isLocalHost){
				const filterStrings = 
					Object.keys(filterStore).map((key)=>{
						let value = filterStore[key]
						//for tags and the like
						if(Array.isArray(filterStore[key])){
							value = filterStore[key].map((object)=>{
								return object.id + " , "
							})
						}						
						return key + " : " + value
					})
				ReactGA.event({
					  category: 'filter',
					  action: "close filter",
					  label : filterStrings.join(" | ")
				});
			}
	    	this.setShowFilterDiv(false)
	    }
	}
	@action setShowFilterDiv=(showDiv)=>{
		this.filterTimer = setTimeout(()=>{
			this.clearFilterTimer()
		}, 50)
		this.showFilterDiv=showDiv
	}	

	@action clearExpandedMenuTimer=()=>{
		this.expandedMenuTimer = null
	}
	@action toggleExpandedMenu=()=>{
		if(!this.showExpandedMenu){
	      	this.setShowExpandedMenu(true)
	    }else{
	    	this.setShowExpandedMenu(false)
	    }
	}
	@action setShowExpandedMenu=(showDiv)=>{
		this.expandedMenuTimer = setTimeout(()=>{
			this.clearExpandedMenuTimer()
		}, 50)
		this.showExpandedMenu=showDiv
	}

 	@action setSearchInput=(newInput)=>{
 		this.searchInput = newInput
 		this.performSearch()
 	}
 	@action	searchInputChange=(e)=>{
 		if (this.selectedTrick){
			const previoslySelected = document.getElementById(this.selectedTrick+"listCard");
			previoslySelected.classList.toggle("expand");
		}
		this.searchInput = e.target.value 		
		if(e.target.value === ""){
			this.searchTrick = ""
		}
		this.performSearch()
		this.resetSelectedTrick()
		this.updateRootTricks()
 	}
 		
 	@action performSearch=()=>{
 		this.selectedTrick = null
 		this.searchTrick = this.searchInput
 		this.updateRootTricks()
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
	@action sortLibrary=()=>{
		let sortedJugglingLibrary
	 	if (filterStore.sortType === 'alphabetical'){
		 	sortedJugglingLibrary = utilities.sortObjectByAttribute(store.library, 'name');
		}else if (filterStore.sortType === 'difficulty'){
		 	sortedJugglingLibrary = utilities.sortObjectByAttribute(store.library, 'difficulty');
		}else if (filterStore.sortType === 'lastUpdated'){
			let tempLibraryWithTimes = store.library
			for (let trick in tempLibraryWithTimes){
				if (store.myTricks[trick] && store.myTricks[trick].lastUpdated){
					tempLibraryWithTimes[trick].lastUpdated = 999999999999 - store.myTricks[trick].lastUpdated
				}else{
					tempLibraryWithTimes[trick].lastUpdated = 0
				}
			}
			sortedJugglingLibrary = utilities.sortObjectByAttribute(tempLibraryWithTimes, 'lastUpdated');
		}else if (filterStore.sortType === 'catches'){
			let tempLibraryWithCatches = store.library
			for (let trick in tempLibraryWithCatches){
				if (store.myTricks[trick] && store.myTricks[trick].catches){
					tempLibraryWithCatches[trick].catches = store.myTricks[trick].catches
				}else{
					tempLibraryWithCatches[trick].catches = 0
				}
			}
			sortedJugglingLibrary = utilities.sortObjectByAttribute(tempLibraryWithCatches, 'catches');
		}else if (filterStore.sortType === 'timeSubmitted'){
			const tempLibraryWithSubmitted = store.library
			for (let trick in tempLibraryWithSubmitted){
				if (!tempLibraryWithSubmitted[trick].timeSubmitted){
					tempLibraryWithSubmitted[trick].timeSubmitted = 0
				}
			}
			sortedJugglingLibrary = utilities.sortObjectByAttribute(tempLibraryWithSubmitted, 'timeSubmitted');
		}else if (filterStore.sortType === 'random'){
			sortedJugglingLibrary = utilities.sortObjectByAttribute(store.library, 'random');
		}
		if (filterStore.sortType === 'timeSubmitted' || 
			filterStore.sortType === 'catches'){
			if(filterStore.sortDirection==='ascending'){
				sortedJugglingLibrary.reverse()
			}
		}else{
			if(filterStore.sortDirection==='descending'){
				sortedJugglingLibrary.reverse()
			}
		}
		return sortedJugglingLibrary
	}
 	@action updateRootTricks=(rootTricks)=>{
 		if(Object.keys(store.library).length === 0){ return }
	 	this.rootTricks = []
 		const sortedJugglingLibrary = this.sortLibrary()
		const filterTagNames= []
		filterStore.tags.forEach(function (arrayItem) {
		    filterTagNames.push(arrayItem.id)
		});
		sortedJugglingLibrary.forEach((trickObj, i) => {
			const trickKey = Object.keys(trickObj)[0]
			const trick = trickObj[trickKey]
			if(this.selectedList === "allTricks" || 
			  (this.selectedList === "myTricks" && store.myTricks[trickKey])){
				const tagsInFilter = trick.tags? trick.tags.filter((tag)=>{
					if (filterTagNames.includes(tag)){
						return tag
					}else{
						return ''
					}
				}) : []
				let passesContributorFilter = false
				if (filterStore.contributors.length===0){
					passesContributorFilter = true
				}else{
					filterStore.contributors.forEach(function (arrayItem) {
					    if (trick.contributor === arrayItem.id ){
					    	passesContributorFilter = true
					    }
					    if (trick.contributor == null && 
					    	arrayItem.id === "libraryofjuggling.com"){
					    	passesContributorFilter = true
					    }
					})
				}
				let passesDemoTypeFilter = false
				if (filterStore.demoType.length===0){
					passesDemoTypeFilter = true
				}else{
					if(filterStore.demoType[0].id === "All"){
						passesDemoTypeFilter = true
					}else if(trick.video == null && 
				    	filterStore.demoType[0].id === "Juggling Lab" ){
				    	passesDemoTypeFilter = true
				    }
				    else if(trick.video && filterStore.demoType[0].id === "User Video" ){
				    	passesDemoTypeFilter = true
				    }
				    else{
				    	passesDemoTypeFilter = false
				    }
				}//give message if flair filter clicked and (!authStore.user)
				let passesFlairFilter = false 
				let myFlairForThisTrick = []
				if (filterStore.flair.length === 0){
					passesFlairFilter = true
				}else{
					if (store.myTricks[trickKey]){
						if (store.myTricks[trickKey].starred === 'true'){
							myFlairForThisTrick.push('starred')
						} 
						if (store.myTricks[trickKey].baby === 'true'){
							myFlairForThisTrick.push('baby')
						} 
						if (store.myTricks[trickKey].ninja === 'true'){
							myFlairForThisTrick.push('ninja')
						} 
						var flairOverlap = myFlairForThisTrick.filter(function(n) {
						  if (filterStore.flair.indexOf(n) > -1){
						  	passesFlairFilter = true
						  }
						})
					}
				}
				let passesSearch = false
				if (this.searchTrick === '' || 
					trick.name.toUpperCase().includes(this.searchTrick.toUpperCase())){
					passesSearch = true					
				}else{
					if (trick.tags){
						trick.tags.forEach((tag) => {
							if (tag.toUpperCase().includes(this.searchTrick.toUpperCase())){
								passesSearch = true
							}
						})
					}
				}


				let thisTricksCatches = 0
				if(store.myTricks[trickKey] && store.myTricks[trickKey].catches){
					thisTricksCatches = parseInt(store.myTricks[trickKey].catches, 10)
				}
				if(
				   passesContributorFilter && passesDemoTypeFilter &&
				   trick.difficulty >= filterStore.difficultyRange[0] && 
				   trick.difficulty <= filterStore.difficultyRange[1] &&
				   (tagsInFilter.length >= filterTagNames.length || filterTagNames.length === 0) &&
				   (filterStore.numBalls.includes(trick.num.toString()) || filterStore.numBalls.length === 0) &&
				   passesFlairFilter &&
				   thisTricksCatches >= parseInt(filterStore.minCatches, 10) &&
				   thisTricksCatches <= parseInt(filterStore.maxCatches, 10) &&
				   passesSearch
				 ){
					this.rootTricks.push(trickKey)
				}
			}
		})	
	}
	@action clearUI=()=>{
		this.setShowHomeScreen(false)
		this.setShowExpandedMenu(false)
		this.setDetailTrick(null)
		this.setShowFilterDiv(false)
		this.setShowStatsScreen(false)
		this.setShowProfileScreen(false)
	}
	 @action clearCatchInput=()=>{
	 	this.catchInput = ''
	 }
}

const uiStore = new UIStore()

export default uiStore