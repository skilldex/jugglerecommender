import { action, configure, computed, observable, toJS} from "mobx"
import {jugglingLibrary} from './jugglingLibrary.js'
import firebase from 'firebase'
import uiStore from './uiStore'

configure({ enforceActions: "always" })
class Store {

	@observable myTricks = {}
	@observable user = {}

	@computed get isMobile(){
	   return true ?  /Mobi|Android/i.test(navigator.userAgent) : false
	 }

	@action updateTricksInDatabase=()=>{
		if(!this.user.username){return}
		let myTricksKey = ""
 		const myTricksRef = firebase.database().ref('myTricks/').orderByChild('username').equalTo(this.user.username)
  	 	myTricksRef.on('value', resp =>{
           const myTricksObject =this.snapshotToArray(resp)[0]
            if(myTricksObject){
            	myTricksKey = myTricksObject.key
            }
            if(myTricksKey){
	            const userTricksRef = firebase.database().ref('myTricks/'+myTricksKey)
		        userTricksRef.set({	        	
		        		'username': this.user.username,
		        		'myTricks' : this.myTricks        	
		        })	
            }            
        })
	}

	@action initializeTricks=()=>{
		this.setMyTricks({"Cascade": { "catches":0}})
		uiStore.setSearchInput('common')
		uiStore.selectTricks(['Cascade'])
	}
	@action getTricksFromBrowser=()=>{
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
    	if(myTricks  && Object.keys(myTricks).length > 0){
    		this.setMyTricks(myTricks)
    		uiStore.setSelectedList("myTricks")
    	}else{
    		this.initializeTricks()
    	}
	}

	@action getSavedTricks=()=>{
		if(this.user.username){
			const myTricksRef = firebase.database().ref('myTricks/').orderByChild('username').equalTo(this.user.username)
	  	 	let myTricksKey = ""
	  	 	myTricksRef.on('value', resp =>{
	           const myTricksObject =this.snapshotToArray(resp)[0]
	            if(myTricksObject){
	            	myTricksKey = myTricksObject.key
	            }
	            if(myTricksObject && myTricksObject.myTricks){
	            	if(Object.keys(myTricksObject.myTricks).length > 1){
	            		this.setMyTricks(myTricksObject.myTricks)
	            	}
	            	//this.setSelectedList("myTricks")
	            	uiStore.setSearchInput('')
	            }else{
	            	this.getTricksFromBrowser()
	            }
	            
	        })
	  	 }else{
	  	 	this.getTricksFromBrowser()
	  	 }
		uiStore.updateRootTricks()
	}
	@action setCatches=(catches, trickKey)=>{
 		this.myTricks[trickKey].catches = catches
 		this.updateTricksInDatabase()
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 	}
	@action addToMyTricks=(trickKey)=>{

 		this.myTricks[trickKey] = {
 			"catches" : 0
 		}
        this.updateTricksInDatabase()
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 		uiStore.updateRootTricks()
 	}
 	@action setMyTricks=(tricks)=>{
 		this.myTricks = tricks        
 		uiStore.updateRootTricks()
 	}
 	@action removeFromMyTricks=(trickKey)=>{
		if (this.myTricks[trickKey]) {
		  delete this.myTricks[trickKey]
		}
		this.updateTricksInDatabase()
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 		uiStore.updateRootTricks()
 	}



	 @action snapshotToArray = snapshot => {
	    let returnArr = [];
	    
	    snapshot.forEach(childSnapshot => {
	        let item = childSnapshot.val();
	        item.key = childSnapshot.key;
	        returnArr.push(item);
	    });
	    return returnArr;
	};
}

const store = new Store()

export default store