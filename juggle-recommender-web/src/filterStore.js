import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import {jugglingLibrary} from './jugglingLibrary.js'
import uiStore from "./uiStore"
configure({ enforceActions: "always" })
class FilterStore {

	@observable filterVisible = false
	@observable sortType = 'alphabetical'
	@observable difficultyRange = [1,10]
	@observable numBalls = ['3']
	@observable tags = [
		{'id' : 'common','text':'common'}
	]
	 
	@action setTags=(tags)=>{
		this.tags = tags
		uiStore.updateRootTricks()
	}

	@action toggleFilterDiv=()=>{
		this.filterVisible = !this.filterVisible
	}
	@action setSortType=(type)=>{
		this.sortType = type
		uiStore.updateRootTricks()
	}
	@action setDifficultyRange=(difficultyRange)=>{
		this.difficultyRange = difficultyRange
		uiStore.updateRootTricks()
	}
	@action setNumBalls=(numBalls)=>{
		this.numBalls = numBalls
		uiStore.updateRootTricks()
	}
}

const filterStore = new FilterStore()
export default filterStore