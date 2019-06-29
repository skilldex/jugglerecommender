import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"
configure({ enforceActions: "always" })
console.log("filters " ,window.location)

const urlQuery = window.location.search.match(/\?contributor=(.+)/)
const contributor = urlQuery ? [{
									id: urlQuery[1],
									text: urlQuery[1]
								}] : [] 

console.log("contributors " ,contributor)
class FilterStore {

	@observable sortType = 'difficulty'
	@observable demoType = 'All'
	@observable sortDirection = 'ascending'
	@observable difficultyRange = [1,10]
	@observable numBalls = []
	@observable associationTypes = []
	@observable tags = []
	@observable contributors = contributor
	@observable minCatches = 0
	@observable maxCatches = 10000000

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
	@action setAssociationTypes=(associationTypes)=>{
		this.associationTypes = associationTypes
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
	}
}

const filterStore = new FilterStore()
export default filterStore