import { action, configure, observable} from "mobx"
import store from "./store"
import firebase from 'firebase'
import uiStore from './uiStore' 
import utilities from '../utilities'

configure({ enforceActions: "always" })
const actionCodeSettings = {
        url: 'www.skilldex.org/',
    };
class AuthStore {
    @observable mods = ['tjthejugglerx','Ianbrealx']
	@observable user = null
    @action signOut=()=>{
	 	//uiStore.closeDetails()
	 	window.alert(this.user.username + " has been signed out.")
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                this.setUser(null)
                resolve("signed out")
                uiStore.updateRootTricks()
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
                    utilities.addModIgnoreToURL()
                }
            })
        })
    }
    @action setUser=(user)=>{ 
        // console.log("set user user",user)
        // if(["ianbreal","tjthejuggler"].includes(user.username.toLowerCase())){
        //     console.log("turned off ga")
        //     window['ga-disable-UA-140392015-1'] = true;
        // }
      
        this.user = user
        store.getSavedTricks()
     }
    @action loginUser(username, pass) {
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
                    if (username.endsWith("_")){
                        resolve({message :"username can't end with _"})
                    }else{
                        firebase.auth().createUserWithEmailAndPassword(email, pass).then(data =>{
                            resolve("user created")
                        }).catch(function (error) {
                            resolve(error)
                        });
                    }
                }else{
                    resolve({message :"username already exists"})
                }
            })
        })
    }
    @action forgotPassword(email){
        return new Promise(resolve => {
            firebase.auth().sendPasswordResetEmail(email, this.actionCodeSettings).then(()=>{
                resolve("password reset email sent")
            })
        })
    }
    @action sendEmail(email){
        let headers = {"Content-Type": "application/json; charset=utf-8"};
        const api = "https://wt-b5a67af96f44fb6828d5a07d6bb70476-0.sandbox.auth0-extend.com/skilldex/email"
        return new Promise((resolve, reject) => {
            firebase.auth().currentUser.getIdToken(true).then( idToken => {
                fetch(
                    api, 
                        {
                            method: "POST",
                            body: JSON.stringify(email), 
                            headers: headers
                        }
                ).subscribe(res => {
                    resolve(res)
                }, err => {
                    if(parseInt(err.status,10) === 200){
                        resolve("good")
                    }else{
                        reject(err)
                    }
                    console.log("error sending email", err)
                });
            }).catch(function(error) {
                // Handle error
            });
        }) 
    }
    @action getEmailByUsername(username){
        const usersRef = firebase.database().ref('users/').orderByChild('lowerCaseUsername').equalTo(username.toLowerCase())
        let user
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                user = store.snapshotToArray(resp)[0]
                let email = 'skilldex.feedback@gmail.com'
                if(user){ email = user.email }
                resolve(email)
            })
        })
    }
}

const authStore = new AuthStore()

export default authStore