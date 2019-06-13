import { action, configure, computed, observable, toJS} from "mobx"
import firebase from 'firebase'
import uiStore from './uiStore'
import filterStore from './filterStore'
import authStore from './authStore'
import {jugglingLibrary} from '../jugglingLibrary.js'
import {TAGS} from '../tags';

configure({ enforceActions: "always" })
class Store {

	@observable myTricks = {}
	@observable highestCatches = 0
	@observable isLoginPaneOpen = false
	@observable isCreateAccountPaneOpen = false
	@observable library = {}
	@observable tagsSuggestions = []
	@observable presetTags = {}
	@computed get isMobile(){
	   return true ?  /Mobi|Android/i.test(navigator.userAgent) : false
	 }
	@computed get lastTrickUpdated(){
		let mostRecentTime = 0
		let lastTrickUpdated = ""
		
		let rootTricks = []
		for(var key in uiStore.rootTricks) {
		    rootTricks.push(uiStore.rootTricks[key])
		}
		console.log('rootTricks',rootTricks)

 		for(var trick in this.myTricks) {
	        if(this.myTricks[trick].lastUpdated && 
	        	this.myTricks[trick].lastUpdated>mostRecentTime &&
	        	rootTricks.includes(trick)){
	        	console.log('trick',trick)
	          mostRecentTime = parseInt(this.myTricks[trick].lastUpdated)
	          lastTrickUpdated = trick
	        }       
	    }
	    console.log('lastTrickUpdated',lastTrickUpdated)
	    return lastTrickUpdated
	}
	@action setIsLoginPaneOpen=(isOpen)=>{
		this.isLoginPaneOpen = isOpen
	}
	@action toggleCreateAccountPane=()=>{
		this.isCreateAccountPaneOpen = !this.isCreateAccountPaneOpen
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
	
	@action getTricksFromBrowser=()=>{
		console.log("tricks from brwoser")
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
    	if(myTricks  && Object.keys(myTricks).length > 0){
    		this.setMyTricks(myTricks)
    		uiStore.setSelectedList("myTricks")
    		console.log("selected ", uiStore.selectedTricks)
    	}else{
    		uiStore.setSelectedList("allTricks")
    		uiStore.toggleSelectedTrick('Cascade')
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
		uiStore.updateRootTricks()
	}

	@action initializeTags=()=>{
		console.log('initializeTags')
		let tagRef = firebase.database().ref('tags/')
        tagRef.set(TAGS);
	}
	@action getTagsFromDatabase=()=>{
		let tagRef = firebase.database().ref('tags/')
		tagRef.on('value', resp =>{
        	this.setTagsSuggestions(this.snapshotToArray(resp))

        })
	}
	@action setTagsSuggestions=(tagsSuggestions)=>{
		this.tagsSuggestions = tagsSuggestions
		this.presetTags = this.tagsSuggestions.map((tag) => {

		  return {
		  	size: null,
		    id: tag,
		    text: tag,
		  }
		})

	}	
	@action addTrickToDatabase=(trick)=>{
		const trickKey = trick.name
		let newTrickRef = firebase.database().ref('library/'+trickKey)
        newTrickRef.set(trick);
        this.addDependents(trick)
        uiStore.toggleAddingTrick()
	}
	@action addDependents=(trick)=>{
		if(trick.prereqs){
			trick.prereqs.forEach((prereq)=>{
				console.log("depeds" ,toJS(this.library[prereq]))
				if(this.library[prereq].dependents){
					this.library[prereq].dependents.push(trick.name)
				}{
					this.library[prereq].dependents = [trick.name]
				}
				console.log(toJS(this.library[prereq].dependents))
				let prereqRef = firebase.database().ref('library/'+prereq)
        		prereqRef.set(this.library[prereq]);
			})
		}
	}
	@action getSavedTricks=()=>{
		if(authStore.user){
			console.log("saved user")
			const myTricksRef = firebase.database().ref('myTricks/').orderByChild('username').equalTo(authStore.user.username)
	  	 	myTricksRef.on('value', resp =>{
	  	 		console.log("my tricks data")
	           const myTricksObject =this.snapshotToArray(resp)[0]
	            if(myTricksObject && myTricksObject.myTricks){
	            	if(Object.keys(myTricksObject.myTricks).length > 1){
	            		this.setMyTricks(myTricksObject.myTricks)
	            	}
	            	uiStore.setSearchInput('')
	            	uiStore.selectLastUpdated()
	            	uiStore.updateRootTricks()
	            	console.log("had tricks")
	            }else{
	            	console.log("had no tricks")
	            	this.getTricksFromBrowser()
	            	uiStore.selectLastUpdated()
					uiStore.updateRootTricks()
	            }	           
	        })
	  	 }else{
	  	 	console.log("saved no user")
	  	 	this.getTricksFromBrowser()
	  	 	uiStore.selectLastUpdated()
	  	 	uiStore.updateRootTricks()
	  	 }	  
	}
	@action setCatches=(catches, trickKey)=>{
		if(!catches){
			catches = 0
		}
		if (catches.length>1){
 			catches = catches.replace(/^0+/,'');
 		}
 		this.myTricks[trickKey].catches = catches
 		const date = new Date()
 		this.myTricks[trickKey].lastUpdated = date.getTime()
 		uiStore.updateRootTricks()
 	}

	@action addToMyTricks=(trickKey)=>{
		const date = new Date()
 		this.myTricks[trickKey] = {
 			"catches" : 0,
 			"lastUpdated" : date.getTime()
 		}
        this.updateTricksInDatabase()
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 		uiStore.updateRootTricks()
 	}
 	@action findHighestCatches=()=>{
	    for(var trick in this.myTricks) {
	        if(this.myTricks[trick].catches>this.highestCatches){
	          this.highestCatches = parseInt(this.myTricks[trick].catches)
	        }       
	    }
 	}
 	@action setMyTricks=(tricks)=>{
 		this.myTricks = tricks        
 		uiStore.updateRootTricks()
 		this.findHighestCatches()
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