import React, { Component } from "react"
import {observer} from "mobx-react"
//import { toJS } from "mobx"
import messageStore from "./stores/messageStore"
import './messageQueue.css'; 

@observer
class MessageQueue extends Component {
  render() {
    const messageQueue = messageStore.messageQueue.map((message, index)=>{
      return(
        <div      key = {index}
            className = "message"
                 index = {index}
        >
          {message}
        </div>
      )
    })

    return (
      <div>
        {messageQueue}
      </div>
    )
  }
}


export default MessageQueue