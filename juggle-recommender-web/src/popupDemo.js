import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
//import { toJS } from "mobx"
import { observer } from "mobx-react"
import fullScreenIcon from './images/fullScreenIcon.png'
import instagramLogoIcon from "./images/instagramLogo.png"
import './App.css';
import './popupDemo.css';

@observer
class PopupDemo extends Component {
	render() {
    var instVideo
    var getIdInterval = setInterval(function() {
        if (!instVideo) {
            instVideo = document.getElementById("instagramVideo");              
       }else{
        instVideo.currentTime = parseInt(uiStore.popupTrick.videoStartTime);
        clearInterval(getIdInterval)
       }
    },100);
    var loopVideoInterval =setInterval(function() {
        if (!uiStore.popupTrick){
          clearInterval(loopVideoInterval)
       }else if (instVideo && instVideo.currentTime > parseInt(uiStore.popupTrick.videoEndTime)) {
          instVideo.currentTime = parseInt(uiStore.popupTrick.videoStartTime);
       }
    },100);

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
    
    const instagramLogo = <img 
                             alt = ''
                             className="instagramLogo"
                             src={instagramLogoIcon}
                          />
    let igHeader = store.popupVideoURL.includes('instagram') && store.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" 
                                  alt=""
                                  src={store.igData.picURL}/>
                            <span className="instagramUsername">{store.igData.username}</span>
                            <div className="instagramViewProfileButton" onClick={()=>{window.open(store.library[popupTrickKey].video)}}>View {instagramLogo}</div>
                          </div> : null
    let video  = store.popupVideoURL.includes('youtube') ? 
                        <iframe 
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= {demoClass}        
                          muted={true}                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={store.popupVideoURL}      
                        ></iframe> : store.popupVideoURL.includes('instagram') ? 
                        <video 
                          id="instagramVideo"
                          ref={(video)=> {this.popupVideo = video}}
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= {demoClass}                                  
                          autoPlay
                          muted={true}
                          playsInline
                          controls  
                          loop
                          src={store.popupVideoURL}
                        ></video> : null

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