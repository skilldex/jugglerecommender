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
	 	window.alert(this.user.username + " has been signed out.")
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                this.setUser(null)
                resolve("signed out")
            });
        })
    }
    @action loginUser(username, pass) {
        console.log("logging user", username, pass)
        const usersRef = firebase.database().ref('users/').orderByChild('username').equalTo(username)
        let user
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                user = store.snapshotToArray(resp)[0]
                console.log('store.snapshotToArray(resp)',store.snapshotToArray(resp))
                console.log("user", user)
                firebase.auth().signInWithEmailAndPassword(user.email, pass).then(data => {
                    this.setUser({"email": user.email,"username" : user.username})
                    store.setIsLoginPaneOpen(false)
                    resolve("success")
                }).catch(error=>{
                    resolve(error)
                });
            }) 
        });
    }
    @action registerUser(user, pass) {        
        return new Promise(resolve => {
            firebase.auth().createUserWithEmailAndPassword(user, pass).then(data =>{
                resolve("user created")
            }).catch(function (error) {
                resolve(error)
            });
        })
    }
}

const authStore = new AuthStore()

export default authStore