import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class FilterStore {

	@observable filterVisible = false
	@observable sortType = 'alphabetical'
	@observable difficultyRange = [1,10]
	@observable numberOfBalls = ['3']
	@observable tags = []

	@action setTags=(tags)=>{
		this.tags = tags
	}

	@action toggleFilterDiv=()=>{
		this.filterVisible = !this.filterVisible
	}
	@action setSortType=(type)=>{
		this.sortType = type
	}
	@action setDifficultyRange=(difficultyRange)=>{
		this.difficultyRange = difficultyRange
	}
	@action setNumberOfBalls=(numberOfBalls)=>{
		this.numberOfBalls = numberOfBalls
	}
}

const filterStore = new FilterStore()
export default filterStore