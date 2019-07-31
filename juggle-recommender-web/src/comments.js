

import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import catchesIcon from './images/catchesIcon.svg'
import Demo from './demo'
import MainTagsBar from "./mainTagsBar"
import './trickList.css';
import './App.css';
import Gauge from 'react-svg-gauge';
import utilities from './utilities'
//import { Resizable } from "re-resizable";
import ReactGA from 'react-ga';
import history from './history';
import InfiniteScroll from 'react-infinite-scroller';
const paginationSize = 20

@observer
class Comments extends Component {
	
	componentDidMount(){
        /*this.timer = Observable.timer(500,500);
        let subscription = this.timer.subscribe(t => {
            if( this.comments instanceof Array) {
                this.comments.forEach(
                    function(curComment){
                        curComment["date"] = this.getTimeDiff(curComment["date"])
                        this.setComments.push(curComment)
                        
                    }, this
                )
                subscription.unsubscribe()
            }else if(this.comments instanceof Object){
                for( let curCommentKey in this.comments){
                    this.comments[curCommentKey]["key"] = curCommentKey
                    this.comments[curCommentKey]["date"] = this.getTimeDiff(this.comments[curCommentKey]["date"])
                    this.setComments.push(this.comments[curCommentKey])
                }
                subscription.unsubscribe()
            }
        });  */
        console.log(this.comments)
    }

    getTimeDiff=(referenceTimestamp)=>{
        const curTime = new Date()
        const timeDiff = curTime.getTime() -  Date.parse(referenceTimestamp) 
        const diffDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));
        const diffHours = Math.round(timeDiff / (1000 * 60 * 60));
        const diffMinutes = Math.round(timeDiff / (1000 * 60));
        const diffseconds = Math.round(timeDiff / (1000));

        if(diffDays > 0){
            return diffDays + "d"
        }else if (diffHours > 0){
            return diffHours + "h"
        }else if (diffMinutes > 0){
            return diffMinutes + "m"
        }else if (diffseconds > 0){
            return diffseconds + "s"
        }
    }
    onComponentDidUpdate=()=>{
        if(changes.pageType){
            this.pageType = changes.pageType.currentValue
        }
        if(changes.comments){

            this.setComments = []
            if( changes.comments.currentValue instanceof Array) {
                changes.comments.currentValue.forEach(
                    function(curComment){
                        curComment["date"] = this.getTimeDiff(curComment["date"] )
                        this.setComments.push(curComment)
                    }, this
                )
            }else if(changes.comments instanceof Object){
                for( let curCommentKey in changes.comments.currentValue){
                    changes.comments.currentValue[curCommentKey]["key"] = curCommentKey
                    changes.comments.currentValue[curCommentKey]["date"] = this.getTimeDiff(changes.comments.currentValue[curCommentKey]["date"])
                    this.setComments.push(changes.comments.currentValue[curCommentKey])
                }
            }
        }

    }
    showReplies=(key)=>{

        this.firstComment = ""
        var enabledComments = []
        this.setComments.forEach(
            function(curComment){
            if(curComment.key == key||curComment.showReplies){
                curComment.showReplies = true
            }else{
                curComment.showReplies = false
            }
            enabledComments.push(curComment)

        })
        this.setComments = enabledComments
    }
    enableReply=(key)=>{

        this.parentCommentDisabled = true
        this.firstComment = ""
        this.newComment = ""
        var enabledComments = []
        this.setComments.forEach(
            function(curComment){
            if(curComment.key == key){
                curComment.replying = true
            }else{
                curComment.replying = false
            }
            enabledComments.push(curComment)
        })
        this.setComments = enabledComments
    }
    replyComment= (parent)=>{

        let commentData = {
          comment: this.newComment,
          parentId: parent.key,
          previousKeys : parent.previousKeys + parent.key + "/replies/",
          date: Date(),
          projectId: parent.projectId ? parent.projectId:false ,
          featureId: parent.featureId ? parent.featureId:false ,
          solutionId: parent.solutionId ? parent.solutionId:false ,
          user:this.userService.username,
          parentPost: false,
        };
        var tempComments = []
        this.remoteService.createComment(commentData).then(data => {
            this.remoteService.getCommentReplies(commentData.previousKeys).then(replies=>{
                
                this.setComments.forEach(
                    function(curComment){
                        if(curComment.key == parent.key){
                            curComment.showReplies = true
                            curComment.replies = replies
                            curComment.replying = false
                            if(curComment.numReplies){
                                curComment.numReplies = curComment.numReplies + 1
                            }else{
                                curComment.numReplies = 1
                            }
                        }
                        tempComments.push(curComment)
                },this)
                this.setComments = tempComments

            })
        })
        
      }			
    like=(commentKey)=>{

    }
	render() {
	 	let comments = store.currentComments.map((comment)=>{
	 		<div class="comment" ngFor="let comment of setComments">
			    <div class="comment-div" >
			        <span class="comment-user" style="color:rgb(63, 79, 221)">{comment.user}</span>
			        <span>{comment.comment}</span>
			    </div> 
			         
			    <button class="reply-button" ngIf="userService.user" onClick={this.like(comment.key)}>Like</button>
			    <button class="reply-button" ngIf="userService.user" onClick={this.enableReply(comment.key)}>Reply</button>
			    <span style="color:gray;margin-left:5px">{comment.date}</span>

			    <form ngIf="comment.replying" ngSubmit="replyComment(comment)">
			        <input class="reply-box" placeholder="Write a reply..." type="text" ngModel="newComment" name="comment.key"/>
			    </form>
			    <br/>
			    <button style="color:rgb(63, 79, 221)" ngIf="comment.numReplies > 0 && !comment.showReplies" onClick="showReplies(comment.key)">Read {comment.numReplies} Replies</button>

			    <div  ngIf="comment.showReplies" class="reply">
			        <Comments comments="comment.replies" ngIf="comment.replies"></Comments>
			    </div>

			</div>
	 	})
		return (
			<div>
				{comments}
			</div>
		)
	}
}

export default Comments