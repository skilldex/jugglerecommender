import { action, configure, observable} from "mobx"
import store from "./store"
import firebase from 'firebase'
import uiStore from './uiStore' 

configure({ enforceActions: "always" })
const actionCodeSettings = {
        url: 'www.skilldex.org/',
    };
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
                    console.log("found user", user)
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
                console.log(email, JSON.stringify(email))
                fetch(
                    api, 
                        {
                            method: "POST",
                            body: JSON.stringify(email), 
                            headers: headers
                        }
                ).subscribe(res => {
                    console.log("sending email", res)
                    resolve(res)
                }, err => {
                    if(err.status == 200){
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
}

const authStore = new AuthStore()

export default authStore