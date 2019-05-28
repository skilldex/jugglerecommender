import { action, configure, observable} from "mobx"
import store from "./store"
import graphStore from "./graphStore"
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class FilterStore {

	@observable filterVisible = false

	@action toggleFilterDiv=()=>{
		this.filterVisible = !this.filterVisible
	}
}

const filterStore = new FilterStore()
export default filterStore