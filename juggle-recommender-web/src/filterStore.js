import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import uiStore from "./uiStore"
import {toJS} from "mobx"
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
	@action handleDelete=(i)=>{
		this.setTags(
			this.tags.filter((tag, index) => index !== i)
		)
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