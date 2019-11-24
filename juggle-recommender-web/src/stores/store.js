import { action, configure, computed, observable } from "mobx"
//import { toJS } from "mobx"
import firebase from 'firebase'
import uiStore from './uiStore'
import authStore from './authStore'
import {jugglingLibrary} from '../jugglingLibrary.js'
import {TAGS} from '../tags';
import history from "../history"
import utilities from '../utilities'
configure({ enforceActions: "always" })
class Store {

	@observable startTime = null
	@observable myTricks = {}
	@observable highestCatches = 0
	@observable isLoginPaneOpen = false
	@observable isCreateAccountPaneOpen = false
	@observable isForgotPasswordPaneOpen = false
	@observable library = {}
	@observable tagsSuggestions = []
	@observable presetTags = {}
	@observable presetAutoCompleteTags = []
	@observable videoURL = ""
	@observable randomLeaderboardTrick = null
	@observable mostRecentlySubmittedTrickKey = null
	@observable userCount = ""
	@observable registeredUserCount = ""
	@observable totalCatchCount = null
	@observable currentComments = []
	@observable showReplyStates = {}
	@observable enableReplyStates = {}
	@observable timeOfPreviousRandomTrickClick = 0
	@observable TJsPreviouslyUsedContributor = 'tjthejuggler'
	@observable patternCount = null

	@computed get isMobile(){
	   return true ?  /Mobi|Android/i.test(navigator.userAgent) : false
	}
	@computed get isLocalHost(){
		if(window.location.host.includes("localhost") || window.location.host.match(/(\.\d+){3}/)){
			return true
		}else{
			return false
		}
	}

	@computed get contributorTags(){
		let contributors = []
		for (let trick in this.library){
  			if (this.library[trick].contributor && 
  				!contributors.includes(this.library[trick].contributor)){
  					contributors.push(this.library[trick].contributor)
			}
  		}
  		contributors.push('libraryofjuggling.com')
  		contributors = contributors.sort()
		return contributors
	}

	@action setTJsPreviouslyUsedContributor=(contributor)=>{
		this.TJsPreviouslyUsedContributor = contributor
	}

	@action increaseViewsCounter=()=>{
		const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
		if (this.library[detailTrickKey]){
			const detailTrick = {...this.library[detailTrickKey]}
			if(!detailTrick['views']){
				detailTrick['views'] = 0
			}
			detailTrick['views'] = detailTrick['views'] + 1
			const viewsRef = firebase.database().ref('library/'+detailTrickKey+'/views')
			viewsRef.set(detailTrick['views'])
		}
	}
	@action setTimeOfPreviousRandomTrickClick=()=>{
		const date = new Date()
		this.timeOfPreviousRandomTrickClick = date.getTime()
	}
	@action changeUsersWithCatchesTally=(amount)=>{
		const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
		if (this.library[detailTrickKey]){
			const detailTrick = {...this.library[detailTrickKey]}
			if(!detailTrick['usersWithCatches']){
				detailTrick['usersWithCatches'] = 0
			}
			detailTrick['usersWithCatches'] = detailTrick['usersWithCatches'] + amount
			const usersWithCatchesRef = firebase.database().ref('library/'+detailTrickKey+'/usersWithCatches')
			usersWithCatchesRef.set(detailTrick['usersWithCatches'])
		}		
	}
	@action changeUsersWorkingOnTally=(amount)=>{
		const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
		if (this.library[detailTrickKey]){
			const detailTrick = {...this.library[detailTrickKey]}
			if(!detailTrick['usersWorkingOn']){
				detailTrick['usersWorkingOn'] = 0
			}
			detailTrick['usersWorkingOn'] = detailTrick['usersWorkingOn'] + amount
			const usersWorkingOnRef = firebase.database().ref('library/'+detailTrickKey+'/usersWorkingOn')
			usersWorkingOnRef.set(detailTrick['usersWorkingOn'])
		}		
	}
	@action vote(parentTrick, relatedTrickKey,listType, voteDirection){
		utilities.sendGA('detail',
			voteDirection.substring(0, voteDirection.length - 2) +
			' ' + relatedTrickKey + ' as ' + listType +
			' for ' + parentTrick)
		const oppositeVoteDirection = voteDirection === "upvoters" ? "downvoters" : "upvoters" 
		if(listType === "postreqs"){ listType = "dependents"}
		const relatedTrick = {...this.library[parentTrick][listType][relatedTrickKey]}
		//first voter
		if(!relatedTrick[voteDirection]){
			relatedTrick[voteDirection] = []
		}
		//voter already included
		if(relatedTrick[voteDirection] && relatedTrick[voteDirection].includes(authStore.user.username)){
			relatedTrick[voteDirection] = relatedTrick[voteDirection].filter((value)=>{
			    return value !== authStore.user.username;
			});
		}else{
			//voter not included
			relatedTrick[voteDirection].push(authStore.user.username)
		}
		//voter included in opposite voteDirection
		if(
			relatedTrick[oppositeVoteDirection] && 
			relatedTrick[oppositeVoteDirection].includes(authStore.user.username)
		){
			relatedTrick[oppositeVoteDirection] = relatedTrick[oppositeVoteDirection].filter((value)=>{
			    return value !== authStore.user.username;
			});
			const oppositeVotesRef = firebase.database().ref(
				'library/'+parentTrick+ 
				"/"+listType + 
				"/" + relatedTrickKey + 
				"/" + oppositeVoteDirection
			)
			oppositeVotesRef.set([...relatedTrick[oppositeVoteDirection]])
		}
		//Set vote
		const votesRef = firebase.database().ref(
			'library/'+parentTrick+ 
			"/"+listType + 
			"/" + relatedTrickKey + 
			"/" + voteDirection
		)
		votesRef.set([...relatedTrick[voteDirection]])

		/*
		TODO: add votes collection
		const votesCollectionRef = firebase.database().ref("votes/")
		let newData = votesCollectionRef.push();
        newData.set({
        	parentTrickKey: parentTrick,
        	relatedTrickKey : relatedTrickKey,
        	user : authStore.user.username,
        	voteDirection : voteDirection
        });*/
	}
	@action getCommentsByTrickId(trickId){
		const commentsRef = firebase.database().ref('comments/').orderByChild("trickId").equalTo(trickId)
		let parentComments = []
		commentsRef.on('value', resp =>{
			const allComments = this.snapshotToArrayWithKey(resp)
            allComments.forEach(
                function(curComment){
                    if(!curComment["parentId"]){
                        parentComments.push(curComment)
                    }
            })
            this.setComments(this.filterUniqueComments(parentComments))
		})
	}
	@action filterUniqueComments(currentComments){
        let comments = {}
        currentComments.forEach((comment)=>{
            comments[comment["key"]] = comment
        }) 
        currentComments = []         
        for(var commentKey in comments){
            currentComments.push(comments[commentKey])
        }
        return currentComments
    }
	@action setComments(comments){
		this.currentComments = comments
	}
	@action createComment(comment) {
      const commentsRef = firebase.database().ref('comments/'+comment.previousKeys);
	  utilities.sendGA('comment','commented ' + comment.trickId)
      return new Promise((resolve, reject) => {

        let newData = commentsRef.push();
        newData.set(comment);
        if (comment["parentId"]) {
            
            const repliesRef = firebase.database().ref('comments/' + comment.previousKeys.replace("replies/","") + '/numReplies')
            repliesRef.transaction(function (currentValue) {
                return (currentValue || 0) + 1;
            });
        }
        resolve(comment)
      });
    }
    @action getCommentReplies(refPath){
        const comments = firebase.database().ref('comments/'+refPath)
        return new Promise(resolve => {
            comments.on('value', resp => {
                resolve(this.snapshotToArrayWithKey(resp))
            });
        }); 
    }

    @action toggleShowReplies(commentKey){
    	if(this.showReplyStates[commentKey]){
    		this.showReplyStates[commentKey] = !this.showReplyStates[commentKey]
    	}else{
    		this.showReplyStates[commentKey] = true
    	}
    	this.showReplyStates = {...this.showReplyStates}
    }
    @action clearShowReplies(){
    	this.showReplyStates = {}
    }
    @action toggleEnableReplies(commentKey){
    	
    	if(!this.enableReplyStates[commentKey]){
    		this.enableReplyStates = {}
    		this.enableReplyStates[commentKey] = true
    		this.enableReplyStates = {...this.enableReplyStates}
    	}else{
    		this.enableReplyStates = {}
    	}
    }
	@action getMostRecentlySubmittedTrick(){
		let mostRecentlySubmittedTrickKey = ''
		let mostRecentlySubmittedTrickTime = 0
		let trickKey
		for (trickKey in this.library){
			if (parseInt(this.library[trickKey]['timeSubmitted'],10)>mostRecentlySubmittedTrickTime){
				mostRecentlySubmittedTrickTime = parseInt(this.library[trickKey]['timeSubmitted'],10)
				mostRecentlySubmittedTrickKey = trickKey
			}
		}
		return mostRecentlySubmittedTrickKey
	}
	@action getTrickOfTheDay(){
		let trickKeyToUse = null
		const currentDate = new Date()
		let TJsExtraDay = 0
		if (authStore.user){
			TJsExtraDay = authStore.user.username === 'tjthejuggler' ? 1 : 0 
		}
		const formatted_date = (currentDate.getMonth() + 1).toString() + (currentDate.getDate() + 1 + TJsExtraDay).toString()
		let trickOfTheDayReadRef = firebase.database().ref('trickOfTheDay/')
		trickOfTheDayReadRef.on('value', resp =>{
			let allTricksOfTheDay = this.snapshotToArrayWithKey(resp)
			let trickOfTheDay
			for (trickOfTheDay in allTricksOfTheDay){
				if (allTricksOfTheDay[trickOfTheDay]['date'] === formatted_date){
					trickKeyToUse = allTricksOfTheDay[trickOfTheDay]['trick']
				}
			}
		   	let leaderboardRef = firebase.database().ref('leaderboard/')
		   	let trickToUse
			leaderboardRef.on('value', resp =>{
				if (!trickKeyToUse){
					var keys = Object.keys(this.library)
    				trickKeyToUse = keys[ keys.length * Math.random() << 0];
					const trickToSet = {	
						date: formatted_date,
						trick: trickKeyToUse,
					}		
					let trickOfTheDayWriteRef = firebase.database().ref('trickOfTheDay/'+formatted_date)
					trickOfTheDayWriteRef.set(trickToSet);
				}
				trickToUse = {...this.snapshotToObject(resp)[trickKeyToUse], key:trickKeyToUse}
				this.setTrickOfTheDay(trickToUse)
				leaderboardRef.off()
				trickOfTheDayReadRef.off()
    		})
			trickOfTheDayReadRef.off()
        }) 
	}
	@action setTrickOfTheDay=(randomTrick)=>{
		this.randomLeaderboardTrick = randomTrick
	}
	@action updateTotalCatchCount(amount){
	   	const totalCatchCountRef = firebase.database().ref('stats/')
	   	let currentTotalCatchCount
		totalCatchCountRef.on('value', resp =>{
			currentTotalCatchCount = this.snapshotToArray(resp)[0]
        })
		let leaderboardTrickRef = firebase.database().ref('stats/totalCatchCount')
		const updatedStats = currentTotalCatchCount + amount
		leaderboardTrickRef.set(updatedStats);

	}

	@action setStartTime=(startTime)=>{
		this.startTime = startTime
	}
	@action setIsLoginPaneOpen=(isOpen)=>{
		this.isLoginPaneOpen = isOpen
	}
	@action toggleCreateAccountPane=()=>{
		this.isCreateAccountPaneOpen = !this.isCreateAccountPaneOpen
	}
	@action toggleForgotPasswordPane=()=>{
		this.isForgotPasswordPaneOpen = !this.isForgotPasswordPaneOpen
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
    		//uiStore.setSelectedList("myTricks")
    	}else{
    		uiStore.setSelectedList("allTricks")
    	}
	}
	@action initializeLibrary=()=>{
		let libraryRef = firebase.database().ref('library/')
        libraryRef.set(jugglingLibrary);
	}
	@action getLibraryFromDatabase=()=>{
		return new Promise(resolve => {
			let libraryRef = firebase.database().ref('library/')
			libraryRef.on('value', resp =>{
				const library = this.snapshotToObject(resp)
	        	this.setLibrary(library)
	        	this.setPatternCount(this.snapshotToArray(resp).length)
	        	resolve()
	        })
	    })
	}
	@action setPatternCount=(count)=>{
		this.patternCount = count
	}
	@action getUserCountFromDatabase=()=>{
		let libraryRef = firebase.database().ref('stats/')
		libraryRef.on('value', resp =>{
        	this.setUserCount(this.snapshotToArray(resp)[1])
        })		
	}
	@action setUserCount=(count)=>{
		this.userCount = count
	}
	@action getRegisteredUserCountFromDatabase=()=>{
		let libraryRef = firebase.database().ref('users/')
		libraryRef.on('value', resp =>{
        	this.setRegisteredUserCount(this.snapshotToArray(resp).length)
        })		
	}
	@action setRegisteredUserCount=(count)=>{
		this.registeredUserCount = count
	}
	@action getTotalCatchCountFromDatabase=()=>{
		let libraryRef = firebase.database().ref('stats/')
		libraryRef.on('value', resp =>{
        	this.setTotalCatchCount(this.snapshotToArray(resp)[0])
        })
	}
	@action setTotalCatchCount=(count)=>{
		this.totalCatchCount = count
	}
	@action ObjectLength=(object)=> {
	    var length = 0;
	    for( var key in object ) {
	        if( object.hasOwnProperty(key) ) {
	            ++length;
	        }
	    }
	    return length;
	}
	@action setLibrary=(library)=>{
		this.library = library
		//TODO clean this up
		uiStore.updateRootTricks() 
	}

	@action initializeTags=()=>{
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
		this.tagsSuggestions = tagsSuggestions.sort()

		this.presetTags = this.tagsSuggestions.map((tag) => {
		  return {
		  	size: null,
		    id: tag,
		    text: tag,
		  }
		})
	}
	@action removeOldRelationship=(relation, newTrickData, oldTrickKey)=>{
		const relatedProperty = relation === "related" ? "related" : 
								relation === "prereqs" ? "dependents" :
								"prereqs"
		const oldTrick = this.library[oldTrickKey]
		if(oldTrick[relation]){
			let staleRelations = []
			if(newTrickData){
				Object.keys(oldTrick[relation]).forEach((key) => {
					if(!newTrickData[relation][key]){
						staleRelations.push(key)
					}
				})
			}else{//for the case of deleting a trick
				staleRelations = Object.keys(oldTrick[relation]).map(key => key)
			}
			staleRelations.forEach((staleRelation)=>{
				const trick = this.library[staleRelation]
				if(trick && trick[relatedProperty]){
					let newRelatedPropert = {}
					Object.keys(trick[relatedProperty]).forEach((key)=> {
						if(key !== oldTrickKey){
							newRelatedPropert[key] = trick[relatedProperty][key]
						}
					})
					let newTrickRef = firebase.database().ref('library/'+staleRelation+'/'+relatedProperty)
	        		newTrickRef.set(newRelatedPropert);
	        	}
			})
		}
	}
	@action changeNameInAllUsersMyTricks=(newTrick,oldTrickKey)=>{
		let fullDBRef = firebase.database().ref('myTricks/')
		fullDBRef.on('value', resp =>{
			fullDBRef.off()
        	const allUsersMyTricks = this.snapshotToArray(resp)
        	Object.keys(allUsersMyTricks).forEach((user)=>{
        		if (allUsersMyTricks[user]['myTricks']){
					Object.keys(allUsersMyTricks[user]['myTricks']).forEach((trickKey)=>{
						if (trickKey === oldTrickKey){	
							allUsersMyTricks[user]['myTricks'][newTrick.name] = allUsersMyTricks[user]['myTricks'][oldTrickKey]
							delete allUsersMyTricks[user]['myTricks'][oldTrickKey]
						}
					})
				}
			})
			let newMyTricksRef = firebase.database().ref('myTricks/')	
			newMyTricksRef.set(allUsersMyTricks)
        })   
	}
	@action removeTrickFromDatabase=(oldTrickKey)=>{
    	let oldTrickRef = firebase.database().ref('library/'+oldTrickKey)
		oldTrickRef.remove()
	}
	@action deleteTrick=()=>{
		var result = window.confirm("Are you sure you want to permanently delete this pattern?");
		if (result){
			const trickToDelete = uiStore.detailTrick.id
			utilities.sendGA('details',trickToDelete+' deleted')
			uiStore.detailTrick = null
		    this.removeOldRelationship('dependents',null,trickToDelete)
		    this.removeOldRelationship('prereqs',null,trickToDelete)
		    this.removeOldRelationship('related',null,trickToDelete)
		    this.removeTrickFromDatabase(trickToDelete)
		    history.go(-1);
		}


	 }
	@action addTrickToDatabase=(trick)=>{
		const trickKey = 
			trick.name.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
		let oldTrickKey
		let shouldBackUpBecauseEditing = false
		if(uiStore.editingDetailTrick){
			oldTrickKey = uiStore.detailTrick.id
			this.removeOldRelationship('dependents',trick,oldTrickKey)
			this.removeOldRelationship('prereqs',trick,oldTrickKey)
			this.removeOldRelationship('related',trick,oldTrickKey)
			if (trickKey !== oldTrickKey){
				this.changeNameInAllUsersMyTricks(trick,oldTrickKey)
			}
			if (trickKey === oldTrickKey){
				shouldBackUpBecauseEditing = true
			}
			//if the leaderboard trick is having it's name edited
			if (trickKey !== oldTrickKey && 
				this.randomLeaderboardTrick &&
				oldTrickKey === this.randomLeaderboardTrick.key)
				{
					let leaderboardRef = firebase.database().ref('leaderboard/')
					leaderboardRef.on('value', resp =>{
						const currentDate = new Date()
						const formatted_date = (currentDate.getMonth() + 1).toString() + (currentDate.getDate() + 1).toString()
						const trickToSet = {	
							date: formatted_date,
							trick: trickKey,
						}		
						let trickOfTheDayWriteRef = firebase.database().ref('trickOfTheDay/'+formatted_date)
						trickOfTheDayWriteRef.set(trickToSet);
						const trickToUse = {...this.snapshotToObject(resp)[trickKey], key:trickKey}
						this.setTrickOfTheDay(trickToUse)
						leaderboardRef.off()
					})
				}
		}
		//put most of the info from the form into the library
		let newTrickRef = firebase.database().ref('library/'+trickKey)
        newTrickRef.set(trick);
        //put the rest in, the relateds information
        const relationships = ['prereqs','related','dependents']
        Object.keys(relationships).forEach((i)=>{
           	if (relationships[i] in trick){
          		Object.keys(trick[relationships[i]]).forEach((relatedTrick)=>{
        			let relation = {'source':trick[relationships[i]][relatedTrick]['source']}
        			if(trick[relationships[i]][relatedTrick]['upvoters']){
        				relation['upvoters'] = [...trick[relationships[i]][relatedTrick]['upvoters']]
        			}if(trick[relationships[i]][relatedTrick]['downvoters']){
        				relation['downvoters'] = [...trick[relationships[i]][relatedTrick]['downvoters']]
        			}
					let newRelatedPatternUpvotersRef = firebase.database().ref('library/'+trickKey+'/'+relationships[i]+'/'+relatedTrick)
			        newRelatedPatternUpvotersRef.set(relation);  
        		})
        	}
        })
        //if name changed, delete old reference in firebase
        //delete in mytricks and selected tricks, swap with new key
        
        if(uiStore.editingDetailTrick && trickKey !== uiStore.detailTrick.id){
        	if(uiStore.selectedTrick === oldTrickKey){
    			uiStore.toggleSelectedTrick(oldTrickKey)
    			uiStore.toggleSelectedTrick(trickKey)
    		}
        	if(this.myTricks[oldTrickKey]){
        		this.myTricks[trickKey] = this.myTricks[oldTrickKey]
        		console.log('delete from myTricks')
        		delete this.myTricks[oldTrickKey]
        		this.updateTricksInDatabase()
		 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
        	}
        	let oldTrickRef = firebase.database().ref('library/'+oldTrickKey)
			oldTrickRef.remove()
		}

        Object.keys(relationships).forEach((i)=>{
        	const relationship = relationships[i]
	        this.addEquivalentRelated(trick,relationship)
	        if (trick[relationship]){
	      		Object.keys(trick[relationship]).forEach((relatedTrickKey)=>{
	      			if (!trick[relationship][relatedTrickKey]['upvoters'] ||
	      				!trick[relationship][relatedTrickKey]['upvoters'].includes(authStore.user.username)){
		    			this.vote(trickKey, relatedTrickKey,relationship, 'upvoters')
		    		}
					const oppositeRelationship = relationship === "related" ? "related" : 
								 				relationship === "prereqs" ? "dependents" : "prereqs"
					if (this.library[relatedTrickKey]){
			    		if (!this.library[relatedTrickKey][oppositeRelationship][trickKey]['upvoters'] ||
			    			!this.library[relatedTrickKey][oppositeRelationship][trickKey]['upvoters'].includes(authStore.user.username)){
			    			this.vote(relatedTrickKey, trickKey, oppositeRelationship, 'upvoters')
			    		}
			    	}
	    		})	  
    		}      
      	})		

        uiStore.toggleAddingTrick()
		uiStore.setDetailTrick(	{...store.library[trickKey], id: trickKey} )
        history.replace('/detail/'+trickKey, {detail : trickKey})
        if(shouldBackUpBecauseEditing){
        	uiStore.handleBackButtonClick()
        }else{
        	store.increaseViewsCounter()
        }

        console.log('myTrick2'+JSON.stringify(this.myTricks[uiStore.detailTrick.id]))
	}
	
	@action addEquivalentRelated=(trick,relation)=>{
		const relatedProperty = relation === "related" ? "related" : 
								relation === "prereqs" ? "dependents" :
								"prereqs"
		const trickKey = 
			trick.name.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
		if(trick[relation]){
			Object.keys(trick[relation]).forEach((key)=>{
				const relatedTrickKey = key.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')				
				if(!this.library[relatedTrickKey]){
					//console.log("problem with ",relatedTrickKey)
				}
				if(this.library[relatedTrickKey]){
					if (!this.library[relatedTrickKey][relatedProperty]){
						this.library[relatedTrickKey][relatedProperty] = []	
						let relationWriteRef = firebase.database().ref('library/'+relatedTrickKey+'/'+relatedProperty)
				    	relationWriteRef.set({...this.library[relatedTrickKey][relatedProperty]});
					}
					if (!this.library[relatedTrickKey][relatedProperty][trickKey]){
						this.library[relatedTrickKey][relatedProperty][trickKey] = {
							source : "automatic"
						}
						let relatedWriteRef = firebase.database().ref('library/'+relatedTrickKey+'/'+relatedProperty+'/'+trickKey)
				    	relatedWriteRef.set({...this.library[relatedTrickKey][relatedProperty][trickKey]});
	    		    }
        		}
			})
		}
	}

	submitSuggestedRelated=(relation,trickKey,suggestedTrickKey)=>{
		utilities.sendGA('detail','submit suggestion')
	    if(!this.library[trickKey][relation]){
			this.library[trickKey][relation] = []	
	    }

	    this.library[trickKey][relation][suggestedTrickKey] = {
	      source : "suggested",
	      upvoters : [authStore.user.username]
	    }
	    let relationWriteRef = firebase.database().ref('library/'+trickKey+'/'+relation+'/'+suggestedTrickKey)
	    relationWriteRef.set({...this.library[trickKey][relation][suggestedTrickKey]});
	    relationWriteRef.off()

		const otherRelation = relation === "related" ? "related" : 
								relation === "prereqs" ? "dependents" :
								"prereqs"

	    if(!this.library[suggestedTrickKey][otherRelation]){
	    	this.library[suggestedTrickKey][otherRelation] = []
	    }

	    this.library[suggestedTrickKey][otherRelation][trickKey] = {
	      source : "suggested",
	      upvoters : [authStore.user.username]
	    }
	    let otherRelationWriteRef = firebase.database().ref('library/'+suggestedTrickKey+'/'+otherRelation+'/'+trickKey)
	      otherRelationWriteRef.set({...this.library[suggestedTrickKey][otherRelation][trickKey]});
	
	    uiStore.clearRelationSuggestions()
	}
	@action removeRelationshipTrick=(detailTrick,listType,trickKeyToRemove)=>{
		if (this.library[detailTrick][listType][trickKeyToRemove]){
			delete this.library[detailTrick][listType][trickKeyToRemove]
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
	            	uiStore.setSearchInput(document.getElementById("searchTextInput").value)
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
 		if(!this.myTricks[trickKey]){
			this.myTricks[trickKey] = {}
		}		
 		this.myTricks[trickKey].catches = catches
 		const date = new Date()
 		this.myTricks[trickKey].lastUpdated = date.getTime()
 		this.updateTricksInDatabase()
		utilities.sendGA('catches','set catches ' + trickKey + ' ' + catches)
 		uiStore.updateRootTricks()
		this.updateLeaderboard(trickKey,catches)
 	}

 	@action updateLeaderboard=(trickKey,catches)=>{
	   	let leaderboardRef = firebase.database().ref('leaderboard/')
	   	let currentLeaderboardCatches
	   	let newLeaderEntry = {}
		leaderboardRef.on('value', resp =>{
			let allLeaderBoardTricks = this.snapshotToObject(resp)
			if(allLeaderBoardTricks[trickKey]){
				currentLeaderboardCatches = parseInt(allLeaderBoardTricks[trickKey]['catches'],10)
			}
	 		if (parseInt(catches,10)<currentLeaderboardCatches &&
	 			authStore.user.username === allLeaderBoardTricks[trickKey]['user']){
	 			let allUsersMyTricksRef = firebase.database().ref('myTricks/')
				allUsersMyTricksRef.on('value', resp =>{	 
					let allUsersMyTricks = this.snapshotToObject(resp)
					let userid
						newLeaderEntry = {
			 				user: authStore.user.username,
			 				catches: catches,
			 				trick: trickKey
			 			}	
					for (userid in allUsersMyTricks){
						if (allUsersMyTricks[userid] &&
							allUsersMyTricks[userid]['myTricks'] && 
							allUsersMyTricks[userid]['myTricks'][trickKey] && 
							allUsersMyTricks[userid]['myTricks'][trickKey]['catches'] &&
							parseInt(allUsersMyTricks[userid]['myTricks'][trickKey]['catches'],10) >
							newLeaderEntry.catches){
								newLeaderEntry = {
					 				user: allUsersMyTricks[userid]['username'],
					 				catches: allUsersMyTricks[userid]['myTricks'][trickKey]['catches'],
					 				trick: trickKey
					 			}
						}
			 			let leaderboardTrickRef = firebase.database().ref('leaderboard/'+trickKey)
		        		leaderboardTrickRef.set(newLeaderEntry);
		        		leaderboardRef.off()
					}
				});			
	 		}else if(parseInt(catches,10)>currentLeaderboardCatches){ 			
	 			newLeaderEntry = {
	 				user: authStore.user.username,
	 				catches: catches,
	 				trick: trickKey
	 			}
	 			let leaderboardTrickRef = firebase.database().ref('leaderboard/'+trickKey)
        		leaderboardTrickRef.set(newLeaderEntry);
        		leaderboardRef.off()
	 		}
        })
	}

	@action toggleFlair=(trickKey,flairType)=>{
		if(!this.myTricks[trickKey]){
			this.myTricks[trickKey] = {}
		}
		if (this.myTricks[trickKey][flairType] === 'false' || 
			!this.myTricks[trickKey][flairType]){
	 		this.myTricks[trickKey][flairType] = 'true'
	 		const date = new Date()
	 		this.myTricks[trickKey].lastUpdated = date.getTime()
	 		if (flairType === "baby"  ||
	 			flairType === "ninja"){
	 			if (!this.myTricks[trickKey].catches ||
	 				parseInt(this.myTricks[trickKey].catches, 10) < 1){
	 					this.changeUsersWorkingOnTally(1)
	 			}
	 		}
	 		if(flairType === "baby" && this.myTricks[trickKey]["ninja"] === 'true'){
	 			this.toggleFlair(trickKey, "ninja")
	 		}
	 		if(flairType === "ninja" && this.myTricks[trickKey]["baby"] === 'true'){
	 			this.toggleFlair(trickKey, "baby")
	 		}
	 	}else{
	 		this.myTricks[trickKey][flairType] = 'false'
	 		if (flairType === "baby"  ||
	 			flairType === "ninja"){
	 			if (!this.myTricks[trickKey].catches ||
	 				parseInt(this.myTricks[trickKey].catches, 10) < 1){
	 					this.changeUsersWorkingOnTally(-1)
	 			}
	 		}
	 	}
	 	this.myTricks = {...this.myTricks}
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