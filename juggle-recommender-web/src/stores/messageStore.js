import { action, configure, observable } from "mobx"

configure({ enforceActions: "always" })
const MESSAGE_DURATION = 5800

class MessageStore {

  @observable messageQueue = []

  @action addMessageToQueue(message){
    this.messageQueue.push(message)
    setTimeout(()=>{
      this.shiftMessageFromQueue()
    }, MESSAGE_DURATION)
  }

  @action shiftMessageFromQueue(){
    this.messageQueue.shift()
  }
}

const messageStore = new MessageStore()
export default messageStore