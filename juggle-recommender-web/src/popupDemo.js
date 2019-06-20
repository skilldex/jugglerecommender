import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { toJS } from "mobx"

import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import fullScreenIcon from './images/fullScreenIcon.png'
import minimizeIcon from './images/minimizeIcon.png'
import utilities from './utilities'

import './App.css';

import './popupDemo.css';

@observer
class PopupDemo extends Component {
	render() {
    const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    if (store.library[popupTrickKey] && store.library[popupTrickKey].video){
      store.getUsableVideoURL(store.library[popupTrickKey].video)
    } else {
      store.setPopupVideoURL('')
    }
    const demoClass = uiStore.popupFullScreen ? "fullScreenDemo" : "demo"
    const gifClass = uiStore.popupFullScreen ? "gifFullScreenDemo" : "gifDemo"
    const gifSection = store.library[popupTrickKey] && store.library[popupTrickKey].url? 
                          <img 
                             alt = ''
                             className={gifClass} 
                             src={store.library[popupTrickKey].gifUrl}
                          /> : null
    

    let igHeader = store.popupVideoURL.includes('instagram') && store.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" src={store.igData.picURL}/>
                            <span>{store.igData.username}</span>
                            <button className="instagramViewProfileButton" onClick={()=>{window.open(store.library[popupTrickKey].video)}}>View on Instagram</button>
                          </div> : null
    let video  = store.popupVideoURL.includes('youtube') ? 
                        <iframe 
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= {demoClass}        
                          muted="true"                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={store.popupVideoURL}      
                        ></iframe> : store.popupVideoURL.includes('instagram') ? 
                        <video 
                          ref={(video)=> {this.popupVideo = video}}
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= {demoClass}                                  
                          autoPlay
                          muted="true"
                          playsInline
                          controls  
                          loop
                          src={store.popupVideoURL}
                        ></video> : null
    console.log("popup " ,uiStore.popupFullScreen, store.popupVideoURL, store.igData)
    const outerDiv = uiStore.popupFullScreen ? "fullScreenOuterDiv" : "outerDiv"
		return(
      			<div className={outerDiv}>
              <img 
                src={fullScreenIcon} 
                className="fullScreenIcon" 
                alt="" 
                onClick={()=>{uiStore.togglePopupFullScreen()}} 
              />
              {igHeader}
              {video}
              {gifSection}
      			</div>
          )
    }
  }

export default PopupDemo