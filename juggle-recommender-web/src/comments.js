

import React,{Component} from 'react'
import store from './stores/store'
import authStore from './stores/authStore'

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
	
    state = {
        newComment : ""
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
    showReplies=(key)=>{
        this.firstComment = ""
        var enabledComments = []
        this.props.comments.forEach((curComment)=>{
            if(curComment.key == key||curComment.showReplies){
                curComment.showReplies = true
            }else{
                curComment.showReplies = false
            }
            enabledComments.push(curComment)

        })
        this.props.comments = enabledComments
    }
    enableReply=(key)=>{

        this.parentCommentDisabled = true
        this.firstComment = ""
        this.newComment = ""
        var enabledComments = []
        this.props.comments.forEach((curComment)=>{
            const newComment = {...curComment}
            if(newComment.key == key){
                newComment.replying = true
            }else{
                newComment.replying = false
            }
            enabledComments.push(newComment)
        })
        store.setComments(enabledComments)
    }
    replyComment= (parent)=>{

        let commentData = {
          comment: this.state.newComment,
          parentId: parent.key,
          previousKeys : parent.previousKeys + parent.key + "/replies/",
          date: Date(),
          user:authStore.user.username,
          parentPost: false,
        };
        var tempComments = []
        console.log("replying", parent)
        store.createComment(commentData).then(data => {
            store.getCommentReplies(commentData.previousKeys).then(replies=>{
                
                this.props.comment.forEach(
                    (curComment)=>{
                        const newComment = {...curComment}
                        if(newComment.key == parent.key){
                            newComment.showReplies = true
                            newComment.replies = replies
                            newComment.replying = false
                            if(newComment.numReplies){
                                newComment.numReplies = newComment.numReplies + 1
                            }else{
                                newComment.numReplies = 1
                            }
                        }
                        tempComments.push(newComment)
                })
                console.log("getting replies")
                //store.setComments(tempComments)

            })
        })
        
      }			
    like=(commentKey)=>{

    }
	render() {
        console.log("listing comments", this.props.comments)
	 	let comments = this.props.comments.map((comment)=>{
            return <div>
                        <div className="commentContainer">
                            <span className="commentUser">{comment.user}</span>
                            <span className="commentText">{comment.comment}</span>
                        </div>
                        <button className="replyButton" onClick={()=>{this.like(comment.key)}}>Like</button>
                        <button className="replyButton" onClick={()=>{this.enableReply(comment.key)}}>Reply</button>
                        <button className="replyButton" onClick={()=>{this.replyComment(comment)}}>Actually reply</button>

                        <span >{this.getTimeDiff(comment.date)}</span>
                        <input 
                            className="replyInput" 
                            placeholder="Write a reply..." 
                            type="text"  
                            name="comment.key"
                            onChange={(e)=>{
                                console.log("changed" , e.target.value)
                                this.setState({newComment : e.target.value })
                            }}
                        />
                        <br/>
                        <button   onClick={()=>{this.showReplies(comment.key)}}>Read {comment.numReplies} Replies</button>
                        { comment.replies ? <Comments comments={comment.replies}></Comments> : null}

                    </div>
            
    	 		
            
	 	})
        console.log("comment divs", comments)
		return (
			<div>
				{comments}
			</div>
		)
	}
}
/*
<div class="comment" >
                    <div class="comment-div" >
                        <span class="comment-user" >{comment.user}</span>
                        <span>{comment.comment}</span>
                    </div> 
                         
                    <button class="reply-button" onClick={()=>{this.like(comment.key)}}>Like</button>
                    <button class="reply-button" onClick={()=>{this.enableReply(comment.key)}}>Reply</button>
                    <span >{comment.date}</span>
                     <input class="reply-box" placeholder="Write a reply..." type="text"  name="comment.key"/>
                    <br/>
                    <button   onClick={()=>{this.showReplies(comment.key)}}>Read {comment.numReplies} Replies</button>

                   

                </div>
            */
/* <div  ngIf="comment.showReplies" class="reply">
                        <Comments comments="comment.replies" ngIf="comment.replies"></Comments>
                    </div>*/
export default Comments