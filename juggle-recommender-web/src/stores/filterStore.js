import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"

configure({ enforceActions: "always" })
console.log("filters " ,window.location)

let urlQueryContributor = null
const locationURL = window.location.href.split('/modignore')[0]
const contributorMatch = locationURL.match(/contributor=(.+)/)
if (contributorMatch){
		urlQueryContributor = contributorMatch[1].split('&')[0].split(',')
}
const contributor = urlQueryContributor ? 
					urlQueryContributor.map((tag)=>{
						return {
							id : tag,
							text : tag
						}
					})	
				: []

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
	demoType = [{
		id: "User Video",
		text: "User Video",
	}]
}															
if (urlQueryDemoType && urlQueryDemoType[1] === "jugglinglab"){
	demoType = [{
		id: "Juggling Lab",
		text: "Juggling Lab",
	}]
}

let urlQueryTags = null
const tagsMatch = locationURL.match(/tags=(.+)/)
if (tagsMatch){
	urlQueryTags = tagsMatch[1].split('&')[0].split(',')
}
const tags = urlQueryTags ? 
				urlQueryTags.map((tag)=>{
					return {
						id : tag,
						text : tag
					}
				})	
			: []

let urlQueryCatches = locationURL.match(/catches=(.+)/)	
let minCatches = 0
let maxCatches = 1000000
if (urlQueryCatches){
	urlQueryCatches = urlQueryCatches[1].split('&')[0]					
	minCatches = urlQueryCatches.split(',')[0]
	maxCatches = urlQueryCatches.split(',')[1]
}

class FilterStore {

	@observable sortType = 'timeSubmitted'
	@observable demoType = demoType
	@observable sortDirection = 'ascending'
	@observable difficultyRange = difficultyRange
	@observable numBalls = numBalls
	@observable flair = flair
	@observable associations = []
	@observable tags = tags
	@observable contributors = contributor
	@observable minCatches = minCatches
	@observable maxCatches = maxCatches

	@action getURLtext=()=>{
		let urlText = "/tricklist/filter/"
    	if (this.contributors.length > 0){
			urlText = urlText + "contributor="    		
    		this.contributors.forEach((contributor,index) => {
	    		urlText = urlText + contributor.id 
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
	    		urlText = urlText + tag.id
	    		if(index < this.tags.length-1){
	    			urlText += ","
	    		}
			});
    	}
    	if (parseInt(this.minCatches,10)>0 || 
    		parseInt(this.maxCatches,10)<store.highestCatches){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
    		urlText = urlText + "catches=" + 
    			this.minCatches + "," + this.maxCatches 
    	}
    	if (this.demoType.length > 0 && this.demoType[0].id !== "All"){
    		if(urlText !== "/filter/"){
				urlText += "&"
			}
			urlText = urlText + "demotype=" + this.demoType[0].id.replace(" ","").toLowerCase()		
    	}

    	return urlText
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
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}

	@action setDemoType=(demoType)=>{
		this.demoType = demoType
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
	}
	@action resetDifficultyRange=()=>{
		this.difficultyRange = [1,10]
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
	}
	@action setTags=(tags)=>{
		this.tags = tags
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action setContributors=(contributors)=>{
		this.contributors = contributors
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action removeContributor=(i)=>{
		this.setContributors(
			this.contributors.filter((contributor, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()	
		uiStore.setFilterURL()	
	}
	@action handleDelete=(i)=>{
		this.setTags(
			this.tags.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
		uiStore.setFilterURL()
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
	@action handleContributorTagDelete=(i)=>{
		this.setContributors(
			this.contributors.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
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
	}
	@action setSortDirection=(direction)=>{
		this.sortDirection = direction
		uiStore.updateRootTricks()
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