import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
//import { toJS } from "mobx"
import { observer } from "mobx-react"
import fullScreenIcon from './images/fullScreenIcon.png'
import instagramLogoIcon from "./images/instagramLogo.png"
import './App.css';
import './popupDemo.css';
import YouTube from 'react-youtube';
@observer
class PopupDemo extends Component {
  youtubeEnded = (data) => {
    if(store.library[uiStore.popupTrick.id].videoStartTime > -1){
      const popupTrick = store.library[uiStore.popupTrick.id]
      this.popupVideo.internalPlayer.seekTo(popupTrick.videoStartTime)
    }
  }
  instagramPaused = (data) => {
    if(this.popupVideo.currentTime >= parseInt(uiStore.popupTrick.videoEndTime)){
      this.popupVideo.currentTime = parseInt(uiStore.popupTrick.videoStartTime);
      this.popupVideo.load()
    }
  }
  instagramTimeUpdate = (data) => {
    if(this.popupVideo.currentTime < parseInt(uiStore.popupTrick.videoStartTime)){
      this.popupVideo.currentTime = parseInt(uiStore.popupTrick.videoStartTime);
      this.popupVideo.load()
    }
  }
	render() {
    const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    const popupTrick = store.library[popupTrickKey]
    if (popupTrick && popupTrick.video){
      store.getUsableVideoURL(popupTrick.video)
    } else {
      store.setPopupVideoURL('')
    }

    const demoClass = uiStore.popupFullScreen ? "fullScreenDemo" : "demo"
    const gifClass = uiStore.popupFullScreen ? "gifFullScreenDemo" : "gifDemo"
    const gifSection = popupTrick && popupTrick.url? 
                          <img 
                             alt = ''
                             className={gifClass} 
                             src={popupTrick.gifUrl}
                          /> : null
    
    const instagramLogo = <img 
                             alt = ''
                             className="instagramLogo"
                             src={instagramLogoIcon}
                          />
    const fullScreenButton = popupTrick && popupTrick.gifUrl?
                                <img 
                                  src={fullScreenIcon} 
                                  className="fullScreenIcon" 
                                  alt="" 
                                  onClick={()=>{uiStore.togglePopupFullScreen()}} 
                                /> : null
    let igHeader = store.popupVideoURL.includes('instagram') && store.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" 
                                  alt=""
                                  src={store.igData.picURL}/>
                            <span className="instagramUsername">{store.igData.username}</span>
                            <div className="instagramViewProfileButton" onClick={()=>{window.open(popupTrick.video)}}>View {instagramLogo}</div>
                          </div> : null
    const youtubeOpts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        mute : true,
        loop : 1,
      }
    }
    if(popupTrick.videoStartTime > -1){
      youtubeOpts.playerVars.start = popupTrick.videoStartTime
      youtubeOpts.playerVars.end = popupTrick.videoEndTime
    }else{
      youtubeOpts.playerVars.playlist = store.youtubeId
    }
    let video  = store.popupVideoURL.includes('youtube') ? 
                        <YouTube 
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          videoId={store.youtubeId}
                          className= {demoClass} 
                          opts={youtubeOpts}      
                          muted={true}                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={store.popupVideoURL}
                          onEnd={this.youtubeEnded}
                          ref={(video)=> {this.popupVideo = video}}  
                        ></YouTube> : store.popupVideoURL.includes('instagram') ? 
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
                          onTimeUpdate={this.instagramTimeUpdate}
                          onPause={this.instagramPaused}
                          src={store.popupVideoURL}
                        ></video> : null

    const outerDiv = uiStore.popupFullScreen ? "fullScreenOuterDiv" : "outerDiv"
		return(
      			<div className={outerDiv}>
              {fullScreenButton}
              {igHeader}
              {video}
              {gifSection}
      			</div>
          )
    }
  }

export default PopupDemo