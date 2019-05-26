import { action, configure, observable} from "mobx"
import store from "./store"
import firebase from 'firebase' 

configure({ enforceActions: "always" })
class AuthStore {


	@observable user = null

	 @action setUser=(user)=>{
	 	console.log('setUser', user)
	 	this.user = user
	 	store.getSavedTricks()
	 }

	 @action signOut=()=>{
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                authStore.setUser(null)
                console.log('anything')
                resolve("signed out")
            });
        })
    }


}

const authStore = new AuthStore()

export default authStore