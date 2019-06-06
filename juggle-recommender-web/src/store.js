import { action, configure, computed, observable, toJS} from "mobx"
import firebase from 'firebase'
import uiStore from './uiStore'
import filterStore from './filterStore'
import authStore from './authStore'
import {jugglingLibrary} from './jugglingLibrary.js'

configure({ enforceActions: "always" })
class Store {

	@observable myTricks = {}
	@observable isLoginPaneOpen = false
	@observable library = {}
	@computed get isMobile(){
	   return true ?  /Mobi|Android/i.test(navigator.userAgent) : false
	 }

	@action setIsLoginPaneOpen=(isOpen)=>{
		this.isLoginPaneOpen = isOpen
	}

	@action updateTricksInDatabase=()=>{

		if(!authStore.user){return}
		let myTricksKey = ""
 		let myTricksRef = firebase.database().ref('myTricks/').orderByChild('username').equalTo(authStore.user.username)
  	 	myTricksRef.on('value', resp =>{
           const myTricksObject =this.snapshotToArray(resp)[0]
            if(myTricksObject){
            	myTricksKey = myTricksObject.key
            }
            myTricksRef.off()
            if(myTricksKey){
	            const userTricksRef = firebase.database().ref('myTricks/'+myTricksKey)
		        userTricksRef.set({	        	
		        		'username': authStore.user.username,
		        		'myTricks' : this.myTricks        	
		        })	
            }else{
            	myTricksRef = firebase.database().ref('myTricks/')
                let newData = myTricksRef.push();
                newData.set({"username": authStore.user.username, "myTricks" : []});
            }            
        })
	}

	@action initializeTricks=()=>{
		uiStore.setSelectedList("allTricks")
	}
	
		
	@action getTricksFromBrowser=()=>{
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
    	if(myTricks  && Object.keys(myTricks).length > 0){
    		this.setMyTricks(myTricks)
    		uiStore.setSelectedList("myTricks")
    		filterStore.setTags([])
    	}else{
    		this.initializeTricks()
    	}
	}
	@action initializeLibrary=()=>{
		let libraryRef = firebase.database().ref('library/')
        libraryRef.set(jugglingLibrary);
	}
	@action getLibraryFromDatabase=()=>{
		let libraryRef = firebase.database().ref('library/')
		libraryRef.on('value', resp =>{
        	this.setLibrary(this.snapshotToObject(resp))
        })

	}
	@action setLibrary=(library)=>{
		this.library = library
		console.log(toJS(this.library))
		uiStore.updateRootTricks()
	}
	@action addTrickToDatabase=(trick)=>{

		/*const trick = {
			name : "newtrick",
			num : 3,
			difficulty : 5,
			contributor : "jsmith", 
			video : "https://www.instagram.com/p/ByQHRQNA3ss/",
			siteswap :  "431(1x)[3]",
			prereqs : ["Cascade"],
			tags : ["multiplex"]
		}*/
		const trickKey = trick.name
		let newTrickRef = firebase.database().ref('library/'+trickKey)
        newTrickRef.set(trick);
	}
	@action getSavedTricks=()=>{
		if(authStore.user){
			const myTricksRef = firebase.database().ref('myTricks/').orderByChild('username').equalTo(authStore.user.username)
	  	 	myTricksRef.on('value', resp =>{
	           const myTricksObject =this.snapshotToArray(resp)[0]
	            if(myTricksObject && myTricksObject.myTricks){
	            	if(Object.keys(myTricksObject.myTricks).length > 1){
	            		this.setMyTricks(myTricksObject.myTricks)
	            	}
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
		if(!catches){
			catches = 0
		}
		if (catches.length>1){
 			catches = catches.replace(/^0+/,'');
 		}
 		this.myTricks[trickKey].catches = catches
 		uiStore.updateRootTricks()
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
 		var shouldDelete = false
 		if (uiStore.selectedList === 'myTricks'){
			var result = window.confirm("Are you sure you want to remove this pattern and it's data from your list?");
			if (result){
				shouldDelete = true
			}
		}else{
			shouldDelete = true
		}
		if (shouldDelete){
			if (this.myTricks[trickKey]) {
				delete this.myTricks[trickKey]
			}
			this.updateTricksInDatabase()
	 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
	 		uiStore.updateRootTricks()
		}
 	}
	@action snapshotToArray=(snapshot)=>{
	    let returnArr = [];	    
	    snapshot.forEach(childSnapshot => {
	        let item = childSnapshot.val();
	        item.key = childSnapshot.key;
	        returnArr.push(item);
	    });
	    return returnArr;
	}
	@action snapshotToObject=(snapshot) => {
	  let returnObj = {};
	  //returnObj["key"] = Object.keys(snapshot.val())[0]
	  snapshot.forEach(childSnapshot => {
	      returnObj[childSnapshot.key] = childSnapshot.val()
	  });
	  return returnObj;
	}
}

const store = new Store()

export default store