import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
//import { toJS } from "mobx"
import { observer } from "mobx-react"
import fullScreenIcon from './images/fullScreenIcon.png'
import instagramLogoIcon from "./images/instagramLogo.png"
import './App.css';
import './demo.css';
import YouTube from 'react-youtube';
@observer
class Demo extends Component {
  youtubeEnded = (data) => {
    if(store.library[this.props.trickKey].videoStartTime){
      const trick = store.library[this.props.trickKey]
      this.video.internalPlayer.seekTo(trick.videoStartTime)
    }
  }
  instagramPaused = (data) => {
    if(this.video.currentTime >= parseInt(store.library[this.props.trickKey].videoEndTime)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime);
      this.video.load()
    }
  }
  instagramTimeUpdate = (data) => {
    if(this.video.currentTime < parseInt(store.library[this.props.trickKey].videoStartTime)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime);
      this.video.load()
    }
  }
	render() {
    
    const trickKey = store.library[this.props.trickKey] ? this.props.trickKey : ""
    const trick = store.library[trickKey]
    if (trick && trick.video){
      store.getUsableVideoURL(trick.video, trickKey)
    } else {
      store.setVideoURL('','')
    }

    const demoClass = uiStore.detailFullScreen ? "fullScreenDemo" : "demo"
    const gifClass = uiStore.detailFullScreen ? "gifFullScreenDemo" : "gifDemo"
    const gifSection = trick && trick.url? 
                          <img 
                             alt = ''
                             className={gifClass} 
                             src={trick.gifUrl}
                          /> : null
    
    const instagramLogo = <img 
                             alt = ''
                             className="instagramLogo"
                             src={instagramLogoIcon}
                          />
    const fullScreenButton = trick && trick.gifUrl 
                             && this.props.demoLocation !== 'expandedSection'?
                                <img 
                                  src={fullScreenIcon} 
                                  className="fullScreenIcon" 
                                  alt="" 
                                  onClick={()=>{uiStore.toggleDetailFullScreen()}} 
                                /> : null
    let igHeader = this.props.demoLocation !== 'expandedSection' && store.videoURL.includes('instagram') && store.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" 
                                  alt=""
                                  src={store.igData.picURL}/>
                            <span className="instagramUsername">{store.igData.username}</span>
                            <div className="instagramViewProfileButton" onClick={()=>{window.open(trick.video)}}>View {instagramLogo}</div>
                          </div> : null
    const youtubeOpts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        mute : true,
        loop : 1,
      }
    }
    if(trick && trick.videoStartTime > -1){
      youtubeOpts.playerVars.start = trick.videoStartTime
      youtubeOpts.playerVars.end = trick.videoEndTime
    }else{
      youtubeOpts.playerVars.playlist = store.youtubeId
    }
    let video  = store.videoURL.includes('youtube') ? 
                        <YouTube 
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          videoId={store.youtubeId}
                          className= {demoClass} 
                          opts={youtubeOpts}      
                          muted={true}                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={store.videoURL}
                          onEnd={this.youtubeEnded}
                          ref={(video)=> {this.video = video}}  
                        ></YouTube> : store.videoURL.includes('instagram') ? 
                        <video 
                          id="instagramVideo"
                          ref={(video)=> {this.video = video}}
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
                          src={store.videoURL}
                        ></video> : null

    let outerDivClass
    if (this.props.demoLocation === "detail"){
      outerDivClass = "demoOuterDivDetail"
    }else if(this.props.demoLocation === "expandedSection"){
      outerDivClass = "demoOuterDivExpandedSection"
    }
		return(
      			<div className={outerDivClass}>
              {fullScreenButton}
              {igHeader}
              {video}
              {video? null:gifSection}
      			</div>
          )
    }
  }

export default Demo