import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"

configure({ enforceActions: "always" })

let urlQueryContributor = null
const locationURL = window.location.href.split('/modignore')[0]
const contributorMatch = locationURL.match(/contributor=(.+)/)
if (contributorMatch){
		urlQueryContributor = contributorMatch[1].split('&')[0].split(',')
}
const contributor = urlQueryContributor ? urlQueryContributor : []

let urlQueryDiff = locationURL.match(/difficultyrange=(.+)/)	
let difficultyRange	= [1,10]
if (urlQueryDiff){					
	difficultyRange[0] = urlQueryDiff[1].split('&')[0].split(',')[0]
	difficultyRange[1] = urlQueryDiff[1].split('&')[0].split(',')[1]
}
let urlQueryNumBalls = locationURL.match(/numballs=(.+)/)
let numBalls = []
if (urlQueryNumBalls){
	numBalls = urlQueryNumBalls[1].split('&')[0].split(',')
}
let urlQueryFlair = locationURL.match(/flair=(.+)/)
let flair = []
if (urlQueryFlair){
	flair = urlQueryFlair[1].split('&')[0].split(',')
}
let urlQueryDemoType = locationURL.match(/demotype=(.+)/)
let demoType = []
if (urlQueryDemoType && urlQueryDemoType[1] === "uservideo"){
	demoType = ["User Video"]
}															
if (urlQueryDemoType && urlQueryDemoType[1] === "jugglinglab"){
	demoType = ["Juggling Lab"]
}

let urlQueryTags = null
const tagsMatch = locationURL.match(/tags=(.+)/)
if (tagsMatch){
	urlQueryTags = tagsMatch[1].split('&')[0].split(',')
}
const tags = urlQueryTags ? urlQueryTags : []

let urlQueryWorkedOn = locationURL.match(/workedon=(.+)/)	
let workedOnPeriod = null
let workedOnValue = ''
if (urlQueryWorkedOn){
	urlQueryWorkedOn = urlQueryWorkedOn[1].split('&')[0]					
	workedOnValue = urlQueryWorkedOn.split(',')[0]
	workedOnPeriod = urlQueryWorkedOn.split(',')[1]
}

let urlQueryCatches = locationURL.match(/catches=(.+)/)	
let minCatches = 0
let maxCatches = 1000000
if (urlQueryCatches){
	urlQueryCatches = urlQueryCatches[1].split('&')[0]					
	minCatches = urlQueryCatches.split(',')[0]
	maxCatches = urlQueryCatches.split(',')[1]
}
let urlQueryTutorial = locationURL.match(/tutorial=true/)	
let hasTutorialSelected = urlQueryTutorial ? true : false

class FilterStore {

	@observable sortType = 'timeSubmitted'
	@observable demoType = demoType
	@observable sortDirection = 'ascending'
	@observable hasSetSort = false
	@observable difficultyRange = difficultyRange
	@observable numBalls = numBalls
	@observable flair = flair
	@observable associations = []
	@observable tags = tags
	@observable contributors = contributor
	@observable workedOnPeriod = workedOnPeriod
	@observable workedOnValue = workedOnValue
	@observable minCatches = minCatches
	@observable maxCatches = maxCatches
	@observable hasTutorialSelected = hasTutorialSelected

	@action getURLtext=()=>{
		let urlText = "/tricklist/filter/"
    	if (this.contributors.length > 0){
			urlText = urlText + "contributor="    		
    		this.contributors.forEach((contributor,index) => {
	    		urlText = urlText + contributor
	    		if(index < this.contributors.length-1){
	    			urlText += ","
	    		}
			});
    	}  
    	if (parseInt(this.difficultyRange[0],10)!==1 || 
    		parseInt(this.difficultyRange[1],10)!==10){
    			if(urlText !== "/filter/"){
    				urlText += "&"
    			}
	    		urlText = urlText + "difficultyrange=" + 
	    			this.difficultyRange[0] + "," + this.difficultyRange[1] + "&"
    	}
    	if (this.numBalls.length > 0){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "numballs="    		
    		this.numBalls.forEach((numball,index) => {
	    		urlText = urlText + numball 
	    		if(index < this.numBalls.length-1){
	    			urlText += ","
	    		}
			});
    	}
    	if (this.flair.length > 0){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "flair="    		
    		this.flair.forEach((flair,index) => {
	    		urlText = urlText + flair
	    		if(index < this.flair.length-1){
	    			urlText += ","
	    		}
			});

    	}
    	if (this.tags.length > 0){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "tags="   		
    		this.tags.forEach((tag,index) => {
	    		urlText = urlText + tag
	    		if(index < this.tags.length-1){
	    			urlText += ","
	    		}
			});
    	}
    	if (this.workedOnPeriod !== null){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "workedon=" + this.workedOnValue + ',' +this.workedOnPeriod  		
    	}
    	if (parseInt(this.minCatches,10)>0 || 
    		parseInt(this.maxCatches,10)<store.highestCatches){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
    		urlText = urlText + "catches=" + 
    			this.minCatches + "," + this.maxCatches 
    	}
    	if (this.demoType.length > 0 && this.demoType[0] !== "All"){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "demotype=" + this.demoType[0].replace(" ","").toLowerCase()		
    	}
    	if (this.hasTutorialSelected){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "tutorial=true"	
    	}
    	return urlText
	}

	@action toggleHasTutorialSelected=()=>{
		this.hasTutorialSelected = !this.hasTutorialSelected
		if (!this.hasTutorialSelected){
			uiStore.setFilterURL()
		}			
		uiStore.updateRootTricks()
	}

	@action resetAllFilters=()=>{
		this.contributors = []
		this.difficultyRange = [1,10]
		this.numBalls = []
		this.flair = []
		this.demoType = []
		this.tags = []
		this.minCatches = 0
		this.maxCatches = 1000000
		this.searchText = null
	}
	@action setSearchText=(searchText)=>{
		this.searchText = searchText
		uiStore.setSearchInput(searchText)
	}

	@action setDemoType=(demoType)=>{
		this.demoType = demoType
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	@action setWorkedOnPeriod=(period)=>{
		this.workedOnPeriod = period
		if (!period){
			this.workedOnValue = ''
		}
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	@action setWorkedOnValue=(value)=>{
		this.workedOnValue = value
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	@action setMinCatches=(minCatches)=>{
		this.minCatches = parseInt(minCatches, 10)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setMaxCatches=(maxCatches)=>{
		this.maxCatches = parseInt(maxCatches, 10)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action resetCatches=()=>{
		this.minCatches = 0
		this.maxCatches = store.highestCatches
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
		uiStore.showPatternList()
	}
	@action resetDifficultyRange=()=>{
		this.difficultyRange = [1,10]
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
		uiStore.showPatternList()
	}
	@action setTags=(tagType, tags)=>{
		if (tagType === 'tags'){
			this.tags = tags
		}else if(tagType === 'contributor'){
			this.contributors = tags	
		}else if(tagType === 'demoType'){
			this.demoType = tags
		}			
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setContributors=(contributors)=>{
		this.contributors = contributors
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.showPatternList()
	}

	@action removeTag=(tagType, tagToRemove)=>{
		let tagList
		if(tagType === 'tags'){
			tagList = this.tags
		}else if(tagType === 'contributor'){
			tagList = this.contributors	
		}else if(tagType === 'demoType'){
			tagList = this.demoType
		}	
		this.setTags(
			tagType,tagList.filter((tag) => tag !== tagToRemove)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
		uiStore.showPatternList()
	}
	@action setFlair=(flair)=>{
		this.flair = flair
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action handleFlairDelete=(i)=>{
		this.setFlair(
			this.flair.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
	}	
	@action handleDemoTypeDelete=(i)=>{
		this.demoType = []
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()	
		uiStore.setFilterURL()
	}
	@action setSortType=(type)=>{
		this.sortType = type
		uiStore.updateRootTricks()
		this.hasSetSort = true
	}
	@action setSortDirection=(direction)=>{
		this.sortDirection = direction
		uiStore.updateRootTricks()
		this.hasSetSort = true
	}
	@action setHasSetSort=(bool)=>{
		this.hasSetSort = bool
	}
	@action setDifficultyRange=(difficultyRange)=>{
		this.difficultyRange = difficultyRange
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setNumBalls=(numBalls)=>{
		this.numBalls = numBalls
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setFlair=(flair)=>{
		this.flair = flair
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setAssociations=(associations)=>{
		this.associations = associations
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
}

const filterStore = new FilterStore()
export default filterStore