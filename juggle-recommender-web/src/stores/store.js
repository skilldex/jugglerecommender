import { action, configure, computed, observable } from "mobx"
import firebase from 'firebase'
import uiStore from './uiStore'
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
	@observable popupVideoURL = ""
	@observable igData = null
	@computed get isMobile(){
	   return true ?  /Mobi|Android/i.test(navigator.userAgent) : false
	}
	@action setPopupVideoURL=(url)=>{
		this.popupVideoURL = url
	}
	@action setIGData=(data)=>{
		if(!this.igData){
			this.igData = {
				username : data.graphql.shortcode_media.owner.username,
				picURL :  data.graphql.shortcode_media.owner.profile_pic_url,
				profileURL : "https://www.instagram.com/"+data.graphql.shortcode_media.owner.username
			}
		}
	}
	@action getUsableVideoURL=(userProvidedURL)=>{
      let videoURLtoUse = "notValid"
      if (userProvidedURL.includes("instagram.com")){
	    const usefulPart = userProvidedURL.match(new RegExp("(?:/p/)(.*?)(?:/)", "ig"))
	    videoURLtoUse = "https://www.instagram.com"+usefulPart+"?__a=1"  
	    const url = "https://www.instagram.com"+usefulPart+"?__a=1"
        fetch(url).then(
            response => response.json()
        ).then(
            (data) => {
            console.log(data)
              this.setPopupVideoURL(data.graphql.shortcode_media.video_url)
              this.setIGData(data)
            }
        );                                
      }
      else if(userProvidedURL.includes("youtu")){
        let usefulPart
        if (userProvidedURL.includes("youtube.com/watch")){
          usefulPart = userProvidedURL.split('youtube.com/watch?v=')
          usefulPart = usefulPart[usefulPart.length-1]
          if (usefulPart.includes("&feature=youtu.be")){
            usefulPart = usefulPart.replace("&feature=youtu.be","")
          }
          //https://www.youtube.com/watch?v=Kr8LhLGjyiY            
        }else if (userProvidedURL.includes("youtu.be/")){
          //https://youtu.be/Kr8LhLGjyiY
          usefulPart = userProvidedURL.split('youtu.be/')
          usefulPart = usefulPart[usefulPart.length-1]            
        }
        this.setPopupVideoURL("https://www.youtube.com/embed/"+usefulPart+
                       "?rel=0&autoplay=1&mute=1&loop=1&playlist="+usefulPart)
      }
      
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
 		let myTricksRef = firebase.database()
 									.ref('myTricks/')
 									.orderByChild('username')
 									.equalTo(authStore.user.username)
  	 	myTricksRef.on('value', resp =>{
           const myTricksObject =this.snapshotToArrayWithKey(resp)[0]
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
		const myTricks = JSON.parse(localStorage.getItem("myTricks"))
    	if(myTricks  && Object.keys(myTricks).length > 0){
    		this.setMyTricks(myTricks)
    		uiStore.setSelectedList("myTricks")
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
		//TODO clean this up
		uiStore.updateRootTricks() 
		uiStore.resetSelectedTrick()
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
				if(this.library[prereq].dependents){
					this.library[prereq].dependents.push(trick.name)
				}else{
					this.library[prereq].dependents = [trick.name]
				}
				let prereqRef = firebase.database().ref('library/'+prereq)
        		prereqRef.set(this.library[prereq]);
			})
		}
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
	            	uiStore.resetSelectedTrick()
	            	uiStore.updateRootTricks()
	            }else{
	            	//For when we delete data for existing users
	            	this.getTricksFromBrowser()
	            	uiStore.resetSelectedTrick()
					uiStore.updateRootTricks()
	            }	           
	        })
	  	 }else{
	  	 	//Not logged in
	  	 	this.getTricksFromBrowser()
	  	 	uiStore.resetSelectedTrick()
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
 		this.updateTricksInDatabase()
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
	          this.highestCatches = parseInt(this.myTricks[trick].catches, 10)
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
	@action snapshotToArrayWithKey=(snapshot)=>{
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