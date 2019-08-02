

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
import "./comments.css"
const paginationSize = 20

@observer
class Comments extends Component {
	
    state = {
        newComment : "",
        comments : this.props.comments
    }
    componentDidUpdate(prevProps,prevState){
        if (this.props.comments.length>0 && prevProps.comments.length===0){
            this.state.comments = this.props.comments
        }
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
        store.toggleShowReplies(key)
    }
    enableReply=(key)=>{
        this.parentCommentDisabled = true//this variable seems to no be anywhere else
        this.firstComment = ""
        var newComments = []
        console.log('key',key)
        console.log('this.state.comments',this.state.comments)
        this.state.comments.forEach((curComment)=>{
            if(curComment.key == key){
                curComment.replying = true
            }else{
                curComment.replying = false
            }
            newComments.push(curComment)
        })
        console.log('newComments',newComments)
        this.setState({ comments : newComments})
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
        console.log("replying", parent, commentData)
        store.createComment(commentData).then(data => {
            store.getCommentReplies(commentData.previousKeys).then(replies=>{
                
                this.props.comments.forEach(
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
                this.setState({comments:tempComments})

            })
        })
        
      }			
    like=(commentKey)=>{

    }

	render() {
        console.log('this.state.comments',this.state.comments)
        console.log("listing comments", this.props.comments)
        
	 	let comments = this.state.comments.map((comment)=>{
            return <div>
                        <div className="commentContainer">
                            <span className="commentUser">{comment.user}</span>
                            <span className="commentText">{comment.comment}</span>
                        </div>
                        <div>
                            <button className="replyButton" onClick={()=>{this.like(comment.key)}}>Like</button>
                            <button className="replyButton" onClick={()=>{this.enableReply(comment.key)}}>Reply</button>
                            <span className="date">{this.getTimeDiff(comment.date)}</span>
                        </div>
                        { 
                            comment.replying ? 
                            <div>
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
                                <button onClick={()=>{this.replyComment(comment)}}>Submit</button>
                            </div> : 
                            null
                        }
                        
                        <br/>
                        {comment.numReplies > 0 ?
                        <button className="replyButton" onClick={()=>{this.showReplies(comment.key)}}>Read {comment.numReplies} Replies</button>
                        :null}
                        { comment.replies && store.showReplyStates[comment.key] ? 
                            <div className="reply">
                                <Comments comments={utilities.objectToArray(comment.replies)}></Comments>
                            </div> : null}

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

export default Comments