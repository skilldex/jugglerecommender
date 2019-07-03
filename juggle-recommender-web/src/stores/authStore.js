import { action, configure, observable} from "mobx"
import store from "./store"
import firebase from 'firebase'
import uiStore from './uiStore' 

configure({ enforceActions: "always" })
class AuthStore {
	@observable user = null
    @action signOut=()=>{
	 	uiStore.closeDetails()
	 	window.alert(this.user.username + " has been signed out.")
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                this.setUser(null)
                resolve("signed out")
            });
        })
    }
    @action setUsername(email){
    	const usersRef = firebase.database().ref('users/').orderByChild('email').equalTo(email)
        let user
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                user = store.snapshotToArray(resp)[0]
                if (user){
                	this.setUser({"email": user.email,"username" : user.username})
                }
            })
        })
    }
    @action setUser=(user)=>{       
        this.user = user
        store.getSavedTricks()
        console.log('setUser', user)
     }
    @action loginUser(username, pass) {
        console.log("logging user", username, pass)
        const usersRef = firebase.database().ref('users/').orderByChild('lowerCaseUsername').equalTo(username.toLowerCase())
        let user
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                user = store.snapshotToArray(resp)[0]
                if (user){
	                firebase.auth().signInWithEmailAndPassword(user.email, pass).then(data => {
	                    this.setUser({"email": user.email,"username" : user.username})
	                    store.setIsLoginPaneOpen(false)
	                    resolve("success")
	                }).catch(error=>{
	                    resolve(error)
	                });
	            }else{
	            	alert(username+" does not exist")
	            }
            }) 
        });
    }
    @action registerUser(email, pass,username) { 
        const usersRef = firebase.database().ref('users/').orderByChild('lowerCaseUsername').equalTo(username.toLowerCase())
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                const user = store.snapshotToArray(resp)[0]
                if(!user){
                    firebase.auth().createUserWithEmailAndPassword(email, pass).then(data =>{
                        resolve("user created")
                    }).catch(function (error) {
                        resolve(error)
                    });
                }else{
                    resolve({message :"username already exists"})
                }
            })
        })
    }
}

const authStore = new AuthStore()

export default authStore