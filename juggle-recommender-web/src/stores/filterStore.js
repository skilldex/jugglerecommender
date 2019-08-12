import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"
import ReactGA from 'react-ga';

configure({ enforceActions: "always" })
console.log("filters " ,window.location)

const urlQueryContributor = window.location.search.match(/\?contributor=(.+)/)
const contributor = urlQueryContributor ? [{
									id: urlQueryContributor[1].split('&')[0].slice(0, -1),
									text: urlQueryContributor[1].split('&')[0].slice(0, -1)
								}] : []
let urlQueryDiff = window.location.search.match(/difficultyrange=(.+)/)	
let difficultyRange	= [1,10]
if (urlQueryDiff){					
	difficultyRange[0] = urlQueryDiff[1].split('&')[0].split(',')[0]
	difficultyRange[1] = urlQueryDiff[1].split('&')[0].split(',')[1]
}
let urlQueryNumBalls = window.location.search.match(/numballs=(.+)/)
let numBalls = []
if (urlQueryNumBalls){
		numBalls = urlQueryNumBalls[1].split('&')[0].split(',')
		numBalls = numBalls.filter(Boolean);
}
let urlQueryFlair = window.location.search.match(/flair=(.+)/)
let flair = []
if (urlQueryFlair){
		flair = urlQueryFlair[1].split('&')[0].split(',')
		flair = flair.filter(Boolean);
}
let urlQueryDemoType = window.location.search.match(/demotype=(.+)/)
let demoType = []
if (urlQueryDemoType && urlQueryDemoType[1] === "uservideo&"){demoType = [{
																	id: "User Video",
																	text: "User Video",
																}]
															}
if (urlQueryDemoType && urlQueryDemoType[1] === "jugglinglab&"){demoType = [{
																	id: "Juggling Lab",
																	text: "Juggling Lab",
																}]
															}
const urlQueryTags = window.location.search.match(/tags=(.+)/)
const tags = urlQueryTags ? [{
								id: urlQueryTags[1].split('&')[0].slice(0, -1),
								text: urlQueryTags[1].split('&')[0].slice(0, -1)
							}] : []
let urlQueryCatches = window.location.search.match(/catches=(.+)/)	
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
		console.log('searchText',searchText)
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
	}
	@action resetDifficultyRange=()=>{
		this.difficultyRange = [1,10]
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
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
	}
	@action handleDelete=(i)=>{
		this.setTags(
			this.tags.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
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
	}	
	@action handleContributorTagDelete=(i)=>{
		this.setContributors(
			this.contributors.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
	@action handleDemoTypeDelete=(i)=>{
		this.setDemoType(
			this.demoType.filter((tag, index) => index !== i)
		)
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()	
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