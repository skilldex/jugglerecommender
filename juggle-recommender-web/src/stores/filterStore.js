import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"
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
let urlQueryDemoType = window.location.search.match(/demotype=(.+)/)
let demoType = "All"
console.log('urlQueryDemoType',urlQueryDemoType[1])
if (urlQueryDemoType[1] === "uservideo&"){demoType = "User Video"}
if (urlQueryDemoType[1] === "jugglinglab&"){demoType = "Juggling Lab"}
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

	@observable sortType = 'difficulty'
	@observable demoType = demoType
	@observable sortDirection = 'ascending'
	@observable difficultyRange = difficultyRange
	@observable numBalls = numBalls
	@observable associations = []
	@observable tags = tags
	@observable contributors = contributor
	@observable minCatches = minCatches
	@observable maxCatches = maxCatches

	@action setDemoType=(demoType)=>{
		this.demoType = demoType
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
	@action handleDemoTypeDelete=()=>{
		this.demoType = "All"
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
	@action setAssociations=(associations)=>{
		this.associations = associations
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
}

const filterStore = new FilterStore()
export default filterStore