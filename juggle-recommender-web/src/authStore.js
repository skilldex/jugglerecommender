import { action, configure, computed, observable, toJS} from "mobx"
import store from "./store"

configure({ enforceActions: "always" })
class AuthStore {
	@observable user = null

	 @action setUser=(user)=>{
	 	console.log('setUser', user)
	 	this.user = user
	 	store.getSavedTricks()
	 }


}

const authStore = new AuthStore()

export default authStore