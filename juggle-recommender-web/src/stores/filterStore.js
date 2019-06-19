import { action, configure, observable} from "mobx"
import store from "./store"
import uiStore from "./uiStore"
configure({ enforceActions: "always" })
class FilterStore {

	@observable filterVisible = false
	@observable sortType = 'alphabetical'
	@observable sortDirection = 'ascending'
	@observable difficultyRange = [1,10]
	@observable numBalls = []
	@observable tags = []
	@observable contributors = []
	@observable minCatches = 0
	@observable maxCatches = 10000000

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
		console.log('i',i)
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
	@action toggleFilterDiv=()=>{
		this.filterVisible = !this.filterVisible
		if(this.filterVisible){
			filterStore.setMaxCatches(store.highestCatches)
		}
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
}

const filterStore = new FilterStore()
export default filterStore