import React,{Component} from 'react'
import store from './stores/store'
import { toJS } from "mobx"
import { observer } from "mobx-react"
import instagramLogoIcon from "./images/instagramLogo.png"
import './App.css';
import './demo.css';
import YouTube from 'react-youtube';
@observer
class Demo extends Component {
  state = {
    igData : null,
    videoURL : null,
    youtubeId : null
  }
  componentDidMount(){
    const trick = store.library[this.props.trickKey]
    if(trick && trick.video){
      this.getUsableVideoURL(trick.video, this.props.trickKey)
    }
  }
  componentDidUpdate(prevProps,prevState){
    const trick = store.library[this.props.trickKey]
    if(this.props.trickKey !== prevProps.trickKey ){
      this.setState({
        igData : null,
        videoURL : null,
        youtubeId : null
      })
      if(trick.video){
        this.getUsableVideoURL(trick.video, this.props.trickKey)
      }
    }
  }
  setVideoURL=(url, trickKey)=>{
    let modifiedVideoURL = url
    if (store.library[trickKey] &&
      store.library[trickKey].videoStartTime && 
      store.library[trickKey].videoEndTime &&
      url.includes("instagram.com")
    ){
      const startTime = store.library[trickKey].videoStartTime
      const endTime = store.library[trickKey].videoEndTime
      modifiedVideoURL = url+"#t="+startTime+","+endTime
    } 
    this.setState({videoURL : modifiedVideoURL})
  }
  setIGData=(data, trickKey)=>{
    if(!this.state.igData || 
      !store.library[trickKey] || 
      this.state.igData.username !== data.graphql.shortcode_media.owner.username
    ){
      this.setState({
        igData : {
          username : data.graphql.shortcode_media.owner.username,
          picURL :  data.graphql.shortcode_media.owner.profile_pic_url,
          profileURL : "https://www.instagram.com/"+data.graphql.shortcode_media.owner.username
        }
      })
    }
  }

  getUsableVideoURL=(userProvidedURL, trickKey)=>{
      let videoURLtoUse = "notValid"
      if (userProvidedURL.includes("instagram.com")){
      const usefulPart = userProvidedURL.match(new RegExp("(?:/p/)(.*?)(?:/)", "ig"))
      videoURLtoUse = "https://www.instagram.com"+usefulPart+"?__a=1"  
      const url = "https://www.instagram.com"+usefulPart+"?__a=1"
        fetch(url).then(
            response => response.json()
        ).then(
            (data) => {
              if(data.graphql.shortcode_media.__typename === "GraphSidecar"){
          this.setVideoURL(data.graphql.shortcode_media.edge_sidecar_to_children.edges[0].node.video_url, trickKey)
          this.setIGData(data, trickKey)
              }else{
                this.setVideoURL(data.graphql.shortcode_media.video_url, trickKey)
                this.setIGData(data, trickKey)
              }
            }
        );                                
      }
      else if(userProvidedURL.includes("youtu")){
        let usefulPart
        if (userProvidedURL.includes("youtube.com/watch")){
          usefulPart = userProvidedURL.split('youtube.com/watch?v=')
          usefulPart = usefulPart[usefulPart.length-1]
          if (usefulPart.includes("&feature=youtu.be")){
            usefulPart = usefulPart.replace("&feature=youtu.be","")
          }
          //https://www.youtube.com/watch?v=Kr8LhLGjyiY            
        }else if (userProvidedURL.includes("youtu.be/")){
          //https://youtu.be/Kr8LhLGjyiY
          usefulPart = userProvidedURL.split('youtu.be/')
          usefulPart = usefulPart[usefulPart.length-1]            
        }
        videoURLtoUse = usefulPart
        this.setVideoURL("https://www.youtube.com/embed/"+usefulPart+
                       "?rel=0&autoplay=1&mute=1&loop=1&playlist="+usefulPart)
        this.setState({youtubeId : usefulPart})
      }
      return videoURLtoUse
    }
  youtubeEnded = (data) => {
    if(store.library[this.props.trickKey].videoStartTime){
      const trick = store.library[this.props.trickKey]
      this.video.internalPlayer.seekTo(trick.videoStartTime)
    }
  }
  instagramPaused = (data) => {
    if(this.video.currentTime >= parseInt(store.library[this.props.trickKey].videoEndTime,10)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime,10);
      this.video.load()
    }
  }
  instagramTimeUpdate = (data) => {
    if(this.video.currentTime < parseInt(store.library[this.props.trickKey].videoStartTime,10)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime,10);
      this.video.load()
    }
  }
  frameStep=(direction)=>{
    if (this.state.videoURL && this.state.videoURL.includes('youtube')){
      const video = this.video.internalPlayer
      video.getCurrentTime().then((time)=>{
        video.pauseVideo()
        if(direction === "back"){
          video.seekTo(time - .033)
        }else if (direction === "forward"){
          video.seekTo(time + .033)
        }
      })
    }else{
      const video = document.getElementById("instagramVideo")
      video.pause()
      if(direction === "back"){
        video.currentTime = video.currentTime - .033
      }else if (direction === "forward"){
        video.currentTime = video.currentTime + .033
      }
    }
  }
	render() {
    const trickKey = store.library[this.props.trickKey] ? this.props.trickKey : ""
    const trick = store.library[trickKey]
    const gifSection = trick && trick.url? 
                          <img 
                             alt = ''
                             className="gifDemo"
                             src={trick.gifUrl}
                          /> : null
    
    const instagramLogo = <img 
                             alt = ''
                             className="instagramLogo"
                             src={instagramLogoIcon}
                             onClick={()=>{window.open(trick.video)}}
                          />
    let igHeader = this.state.videoURL && this.props.demoLocation !== 'expandedSection' && this.state.videoURL.includes('instagram') && this.state.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" 
                                  alt=""
                                  src={this.state.igData.picURL}/>
                            <span className="instagramUsername">{this.state.igData.username}</span>
                            {instagramLogo}
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
      youtubeOpts.playerVars.playlist = this.state.youtubeId
    }
    let video = this.state.videoURL && this.state.videoURL.includes('youtube') ? 
                        <YouTube
                          id="YouTubeVideo"
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          videoId={this.state.youtubeId}
                          className= "demo" 
                          opts={youtubeOpts}      
                          muted={true}                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={this.state.videoURL}
                          onEnd={this.youtubeEnded}
                          ref={(video)=> {this.video = video}}  
                        ></YouTube> : this.state.videoURL && this.state.videoURL.includes('instagram') ? 
                        <video 
                          id="instagramVideo"
                          ref={(video)=> {this.video = video}}
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= "demo"                                  
                          autoPlay
                          muted={true}
                          playsInline
                          controls  
                          loop
                          onTimeUpdate={this.instagramTimeUpdate}
                          onPause={this.instagramPaused}
                          src={this.state.videoURL}
                        ></video> : null 
    let frameButtons = <div className = "frameButtons">
                          <label onClick = {() => this.frameStep('back')}>Back</label>
                          <label onClick = {() => this.frameStep('forward')}>Forward</label>
                       </div>
    let outerDivClass
    if (this.props.demoLocation === "detail"){
      outerDivClass = "demoOuterDivDetail"
    }else if(this.props.demoLocation === "expandedSection"){
      outerDivClass = "demoOuterDivExpandedSection"
    }
		return(
      			<div className={outerDivClass}>
              {video}
              {video? frameButtons:gifSection}
              {igHeader}
      			</div>
          )
    }
  }

export default Demo