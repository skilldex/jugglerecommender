import { action, configure, observable} from "mobx"
import store from "./store"
import filterStore from "./filterStore"
import authStore from "./authStore"
import utilities from '../utilities'
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
	@observable showCommentsSection = false
	@observable mainListScrollerPosition = null
	@observable pageNumber = 0

	@observable suggestingPrereq = false
    @observable suggestedPrereq = null
    @observable suggestedPrereqSubmitDisabledMessage = null
    @observable autoCompletedSuggestedPrereq = false

	@observable suggestingDependent = false
    @observable suggestedDependent = null
    @observable suggestedDependentSubmitDisabledMessage = null
    @observable autoCompletedSuggestedDependent = false

	@observable suggestingRelated = false
    @observable suggestedRelated = null
    @observable suggestedRelatedSubmitDisabledMessage = null
    @observable autoCompletedSuggestedRelated = false

    @observable addTrickFormPrereqs = []
 	@observable addTrickFormRelated = []
 	@observable addTrickFormPostreqs = []	    
    @observable smallListPageNumber = 0

    @action clearAddTrickSmallTrickLists=()=>{
    	this.addTrickFormPrereqs = []
 		this.addTrickFormRelated = []
 		this.addTrickFormPostreqs = []	
    }

    @action clearSuggestions=(listType)=>{
		if (listType.includes('prereq')){
    		this.suggestedPrereq = null
		    this.autoCompletedSuggestedPrereq = false
			}
		if (listType.includes('related')){
		    this.suggestedRelated = null
		    this.autoCompletedSuggestedRelated = false
			}
		if (listType.includes('postreq')){
		    this.suggestedPostreq = null
		    this.autoCompletedSuggestedPostreq = false
			}
    }

    @action addTrickToSmallTrickList=(listOfTricks, trickKey)=>{
    	if (listOfTricks === this.suggestedPrereq){
		     this.suggestedPrereq = trickKey
		     this.autoCompletedSuggestedPrereq = true
	   	}else if(listOfTricks === this.suggestedRelated){
		     this.suggestedRelated = trickKey
		     this.autoCompletedSuggestedRelated = true
    	}else if(listOfTricks === this.suggestedPostreq){
		     this.suggestedPostreq = trickKey
		     this.autoCompletedSuggestedPostreq = true
    	}else{//if we are in the add trick form
    		listOfTricks.push(trickKey)
    	}
    }

    @action removeTrickFromSmallTrickList=(listOfTricks, trickName)=>{
    	let canRemove = true
    	const trickKey = trickName.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
        if (this.editingDetailTrick){
	    	let prereqTrick = null
	    	let listType = null
	    	if (listOfTricks === this.addTrickFormPrereqs){
	    		listType = 'prereqs'
	    	}
	    	if (listOfTricks === this.addTrickFormRelated){
	    		listType = 'related'
	    	}
	    	if (listOfTricks === this.addTrickFormPostreqs){
	    		listType = 'postreqs'
	    	}
	    	const trick = store.library[this.detailTrick.id][listType][trickKey]
	    	if (trick && trick['upvoters']){
	    		let otherUpvoters = []
	    		otherUpvoters = trick['upvoters'].filter(function(item) { 
				    return item !== authStore.user.username
				})
	    		if (otherUpvoters.length>0){
		    		alert('Prereqs with community upvotes can not be removed.')
		    		canRemove = false
		    	}
	    	}
		}	

		if (canRemove){
			var index = listOfTricks.indexOf(trickName);
			if (index > -1) {
			  listOfTricks.splice(index, 1);
			}
		}
    }

    @action toggleSuggestingRelation=(relation)=>{
    	if (relation === 'prereq'){
    		this.suggestingPrereq = !this.suggestingPrereq
    		if (this.suggestingPrereq){
	    		utilities.sendGA('detail','enable suggestion')
	    	}else{
	    		utilities.sendGA('detail','cancel suggestion')
	    	}
    	}else if (relation === 'dependent'){
    		this.suggestingDependent = !this.suggestingDependent
    		if (this.suggestingDependent){
	    		utilities.sendGA('detail','enable suggestion')
	    	}else{
	    		utilities.sendGA('detail','cancel suggestion')
	    	}
    	}else if (relation === 'related'){
    		this.suggestingRelated = !this.suggestingRelated
    		if (this.suggestingRelated){
	    		utilities.sendGA('detail','enable suggestion')
	    	}else{
	    		utilities.sendGA('detail','cancel suggestion')
	    	}
    	}
    }
    @action setSuggestedRelation=(relation,toSetTo)=>{
    	if (relation === 'prereq'){
    		this.suggestedPrereq = toSetTo
    	}else if (relation === 'dependent'){
    		this.suggestedDependent = toSetTo
    	}else if (relation === 'related'){
    		this.suggestedRelated = toSetTo
    	}
    }
    @action setSuggestedRelationSubmitDisabledMessage=(relation,toSetTo)=>{
    	if (relation === 'prereq'){
    		this.suggestedPrereqSubmitDisabledMessage = toSetTo
    	}else if (relation === 'dependent'){
    		this.suggestedDependentSubmitDisabledMessage = toSetTo
    	}else if (relation === 'related'){
    		this.suggestedRelatedSubmitDisabledMessage = toSetTo
    	}
    }
    @action setAutoCompletedSuggestedRelation=(relation,toSetTo)=>{
    	if (relation === 'prereq'){
    		this.autoCompletedSuggestedPrereq = toSetTo
    	}else if (relation === 'dependent'){
    		this.autoCompletedSuggestedDependent = toSetTo
    	}else if (relation === 'related'){
    		this.autoCompletedSuggestedRelated = toSetTo
    	}
    }
	@action setPageNumber=(page)=>{
		this.pageNumber = page
	}
	@action setSmallListPageNumber=(page)=>{
		this.smallListPageNumber = page
	}
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
	@action toggleShowCommentsSection=()=>{
		this.showCommentsSection = !this.showCommentsSection
	}
  	@action editDetailTrick=()=>{
  		const tempDetailTrick = this.detailTrick
  		utilities.sendGA('detail','edit pattern')
  		utilities.openPage('addpattern',true)
		this.detailTrick = tempDetailTrick
		this.editingDetailTrick = true
  	}
  	@action	handleBackButtonClick=()=>{
  		if(this.addingTrick){
  			this.toggleAddingTrick()
  		}
  		history.go(-1);
	  }
	@action toggleAddingTrick = ()=>{
		if (!authStore.user){
			window.alert("You must be signed in to add a trick");
		}else{
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
	@action clearRelationSuggestions=()=>{
		this.suggestingPrereq = false
	    this.suggestedPrereq = null
	    this.suggestedPrereqSubmitDisabledMessage = null
	    this.autoCompletedSuggestedPrereq = false

		this.suggestingDependent = false
	    this.suggestedDependent = null
	    this.suggestedDependentSubmitDisabledMessage = null
	    this.autoCompletedSuggestedDependent = false

		this.suggestingRelated = false
	    this.suggestedRelated = null
	    this.suggestedRelatedSubmitDisabledMessage = null
	    this.autoCompletedSuggestedRelated = false
	}

	@action setDetailTrick=(clickedTrick)=>{

		this.clearRelationSuggestions()
		this.showCommentsSection = false
		this.detailTrick = null
		if(this.showMoreInformation){
			this.toggleShowMoreInformation()
		}
		this.detailTimer = setTimeout(()=>{
			this.clearDetailTimer()
		}, 500)
	 	this.detailTrick = clickedTrick
	 	this.detailCatchEditable = false
	 	if (this.detailTrick){

	 		store.getCommentsByTrickId(clickedTrick.id)
	 		store.clearShowReplies()
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
			if (previousCatches == 0){
				store.changeUsersWithCatchesTally(1)
			}
			if (catches == 0){
				store.changeUsersWithCatchesTally(-1)
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
	@action showPatternList=()=>{
      this.setFilterURL()
      uiStore.clearUI()
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }
	@action toggleSortDiv=()=>{
	  //this.showPatternList()
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
	@action setFilterURL=()=>{
		let filterURL = filterStore.getURLtext()
		if(filterURL === '/tricklist/filter/'){
			filterURL = '/tricklist'
		}
		if (window.history.replaceState) {
			window.history.replaceState({}, null, filterURL);
		} else {
		  	window.location.href = filterURL
		}
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
								return object + " , "
							})
						}						
						return key + " : " + value
					})
				utilities.sendGA('filter','close filter',filterStrings.join(" | "))
			}
			this.setFilterURL()
	    	this.setShowFilterDiv(false)
	    	this.showPatternList()
	    }
	}
	@action setShowFilterDiv=(showDiv)=>{
		if (showDiv){
			utilities.sendGA('mainTagsBar','filter')
		}
		this.filterTimer = setTimeout(()=>{
			this.clearFilterTimer()
		}, 50)
		this.showFilterDiv=showDiv
		//this.showPatternList()
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
		filterStore.setSearchText(e.target.value)
		this.searchInput = e.target.value 		
		if(e.target.value === ""){
			this.searchTrick = ""
		}
		this.performSearch()
		this.resetSelectedTrick()
		this.updateRootTricks()
		this.showPatternList()
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
		if (filterStore.sortType === 'relevance'){
		 	sortedJugglingLibrary = utilities.sortObjectByAttribute(store.library, 'relevance');
		}else if (filterStore.sortType === 'alphabetical'){
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

	@action allTrickKeysSorted=(sortType, sortDirection)=>{
		const allTrickKeys = []
 		let sortedJugglingLibrary = this.sortLibrary()
 		sortedJugglingLibrary = utilities.sortObjectByAttribute(store.library, sortType);
 		if(sortDirection==='descending'){
			sortedJugglingLibrary.reverse()
		}
		sortedJugglingLibrary.forEach((trickObj, i) => {
			const trickKey = Object.keys(trickObj)[0]
			allTrickKeys.push(trickKey)
		})

		return allTrickKeys
	}

 	@action updateRootTricks=(rootTricks)=>{
 		if(Object.keys(store.library).length === 0){ return }
	 	this.rootTricks = []
 		const sortedJugglingLibrary = this.sortLibrary()
		const filterTagNames= []
		filterStore.tags.forEach(function (arrayItem) {
		    filterTagNames.push(arrayItem)
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
					    if (trick.contributor === arrayItem ){
					    	passesContributorFilter = true
					    }
					    if (trick.contributor == null && 
					    	arrayItem === "libraryofjuggling.com"){
					    	passesContributorFilter = true
					    }
					})
				}
				let passesDemoTypeFilter = false
				if (filterStore.demoType.length===0){
					passesDemoTypeFilter = true
				}else{
					if(filterStore.demoType[0] === "All"){
						passesDemoTypeFilter = true
					}else if(trick.video == null && 
				    	filterStore.demoType[0] === "Juggling Lab" ){
				    	passesDemoTypeFilter = true
				    }
				    else if(trick.video && filterStore.demoType[0] === "User Video" ){
				    	passesDemoTypeFilter = true
				    }
				    else{
				    	passesDemoTypeFilter = false
				    }
				}
				let thisTricksCatches = 0
				if(store.myTricks[trickKey] && store.myTricks[trickKey].catches){
					thisTricksCatches = parseInt(store.myTricks[trickKey].catches, 10)
				}
				//give message if flair filter clicked and (!authStore.user)
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
						if (thisTricksCatches>0 && 
							filterStore.flair.includes('catches')){
							passesFlairFilter = true	
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
					trick.name.toUpperCase().includes(this.searchTrick.toUpperCase()) ||
					this.searchTrick.toUpperCase() === ("SS:"+trick.siteswap.toUpperCase())){
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
		})	//should we put all sorts down here instead of before filtering?
			//we pass roottricks into this function, but i think we dont actually use it in here?
		if (uiStore.rootTricks && filterStore.sortType == 'relevance'){
			utilities.sortRootTricksBySearchRelevance()
		}
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