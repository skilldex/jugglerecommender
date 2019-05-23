import { action, configure, computed, observable, toJS} from "mobx"
import store from "./store"

configure({ enforceActions: "always" })
class AuthStore {


	 @action setUser=(user)=>{
	 	console.log('setUser')
	 	store.user = user
	 	store.getSavedTricks()
	 }


}

const authStore = new AuthStore()

export default authStore