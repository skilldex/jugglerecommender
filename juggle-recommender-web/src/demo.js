import React,{Component} from 'react'
import store from './stores/store'
//import { toJS } from "mobx"
import { observer } from "mobx-react"
import instagramLogoIcon from "./images/instagramLogo.png"
import frameIcon from "./images/frameIcon.svg"
import './App.css';
import './demo.css';
import YouTube from 'react-youtube';
import utilities from './utilities'

@observer
class Demo extends Component {
  state = {
    igData : null,
    videoURL : null,
    youtubeId : null,
    mouseDown : false,
    timer : null,
    videoExists : true,
    embedURL: null,
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
      this.setState({slowmoPlayback: null})
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
      console.log("url "+url)
      if (!userProvidedURL.includes('ig_web_copy_link')) {
        this.setState({embedURL : "https://www.instagram.com"+usefulPart+"embed"})
      }else{
        this.setState({embedURL : null})
      }

        let fetchResponse = fetch(url).then(
            response => response.json()
        ).then(
            (data) => {
              //console.log(JSON.stringify(data))
              if(data.graphql.shortcode_media.__typename === "GraphSidecar"){
                console.log("if")
                this.setVideoURL(data.graphql.shortcode_media.edge_sidecar_to_children.edges[0].node.video_url, trickKey)
                this.setIGData(data, trickKey)
              }else{
                console.log("else")
                this.setVideoURL(data.graphql.shortcode_media.video_url, trickKey)
                this.setIGData(data, trickKey)
                console.log(data.graphql.shortcode_media.video_url)
              }
              console.log(data)
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
  youtubeEnded = (data) => {//when i set the end time in add trick, i should set a 0 start time if none is given
    if(store.library[this.props.trickKey].videoStartTime){
      const trick = store.library[this.props.trickKey]
      this.video.internalPlayer.seekTo(trick.videoStartTime)
    }
  }
  youtubeStateChange = (data) => {
    const video = this.video.internalPlayer
      //video.setAttribute("controls", 0)
      video.getCurrentTime().then((time)=>{
        if (time < store.library[this.props.trickKey].videoStartTime ||
            time > store.library[this.props.trickKey].videoEndTime){
              if (store.library[this.props.trickKey].videoStartTime){
                video.seekTo(store.library[this.props.trickKey].videoStartTime)
              }else{
                video.seekTo(store.library[this.props.trickKey].videoStartTime)
              }
              video.playVideo()
        }
      })

  }
  instagramPaused = (data) => {
    if(this.video.currentTime >= parseInt(store.library[this.props.trickKey].videoEndTime,10)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime,10);
      this.video.load()
    }
  }
  instagramTimeUpdate = (data) => {
    if(this.video.currentTime < parseInt(store.library[this.props.trickKey].videoStartTime,10) ||
      this.video.currentTime > parseInt(store.library[this.props.trickKey].videoEndTime,10)){
      this.video.currentTime = parseInt(store.library[this.props.trickKey].videoStartTime,10);
      this.video.load()
      if(this.state.slowmoPlayback){
        this.toggleInstagramSlowmoPlayback(this.state.slowmoPlayback)
      }
    }
  }
    toggleInstagramSlowmoPlayback=(direction)=>{
      const videoStartTime = store.library[this.props.trickKey].videoStartTime
      const videoEndTime = store.library[this.props.trickKey].videoEndTime
      let toSetPlaybackTo
      const video = document.getElementById("instagramVideo") 
      video.removeAttribute( 'controls' );
      if (direction === "back"){
        if (this.state.slowmoPlayback === "back"){
          toSetPlaybackTo = null
        }else{
          toSetPlaybackTo = "back"
          video.pause();
        }
      }else if(direction === "forward"){
        if (this.state.slowmoPlayback === "forward"){
          toSetPlaybackTo = null
        }else{
          clearInterval(this.state.intervalRewind);
          video.play();
          toSetPlaybackTo = "forward"
        }
      }
      this.setState({slowmoPlayback: toSetPlaybackTo},()=>{
        if(this.state.slowmoPlayback){
            if(this.state.slowmoPlayback === "forward"){
              video.playbackRate = .1
            }else if(this.state.slowmoPlayback === "back"){
              const intervalRewind = setInterval(function(){
                 if(video.currentTime <= Math.max(videoStartTime, 0)){
                    video.currentTime = Math.min(videoEndTime, video.duration);                  
                 }
                 else{
                  video.play();
                  video.removeAttribute( 'controls' );
                  video.currentTime += -.035;
                  video.pause();
                 }
              },200);

              this.setState({intervalRewind:intervalRewind})
            }
        }else{
          clearInterval(this.state.intervalRewind);
          video.playbackRate = 1.0
          video.play();
        }
      })      
    }

    toggleYoutubeSlowmoPlayback=(direction)=>{
      const video = this.video.internalPlayer
      const videoStartTime = store.library[this.props.trickKey].videoStartTime
      const videoEndTime = store.library[this.props.trickKey].videoEndTime
      let videoDuration
      video.getDuration().then((duration)=>{
        videoDuration = duration
      })
      const thisVideo = document.getElementById("YouTubeVideo")
      thisVideo.opts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        mute : true,
        loop : 1,
        controls : 0,
      }
    }
      let toSetPlaybackTo
      if (direction === "back"){
        if (this.state.slowmoPlayback === "back"){
          toSetPlaybackTo = null
        }else{
          toSetPlaybackTo = "back"
          video.pauseVideo()
        }
      }else if(direction === "forward"){
        if (this.state.slowmoPlayback === "forward"){
          toSetPlaybackTo = null
        }else{
          clearInterval(this.state.intervalRewind);
          video.playVideo()
          toSetPlaybackTo = "forward"
        }
      }
      this.setState({slowmoPlayback: toSetPlaybackTo},()=>{
        if(this.state.slowmoPlayback){
            if(this.state.slowmoPlayback === "forward"){
              video.setPlaybackRate(0.25)
            }else if(this.state.slowmoPlayback === "back"){
              const intervalRewind = setInterval(function(){
                 video.getCurrentTime().then((currentTime)=>{
                   if(currentTime <= Math.max(videoStartTime, 0)){
                      video.seekTo(Math.min(videoEndTime, videoDuration));                  
                   }
                   else{
                    video.playVideo()
                    video.seekTo(currentTime - .033)
                    video.pauseVideo()
                   }
                 })
              },400);

              this.setState({intervalRewind:intervalRewind})
            }
        }else{
          clearInterval(this.state.intervalRewind);
          video.setPlaybackRate(1)
          video.playVideo()
        }
      })      
    }

   toggleSlowmoPlayback=(direction)=>{
      if (this.state.videoURL && this.state.videoURL.includes('youtube')){
        this.toggleYoutubeSlowmoPlayback(direction)
      }else{
        this.toggleInstagramSlowmoPlayback(direction)
      }
   }

  handleInstagramVideoClick=()=>{
    const video = document.getElementById("instagramVideo")
    video.setAttribute( 'controls', '' );
  }
  handleInstagramLogoClick=()=>{
    utilities.sendGA('demo','instagram link')
    if (store.library[this.props.trickKey]){
      const trick = store.library[this.props.trickKey]
      window.open(trick.video)
    }
  }
  onYoutubePlayerReady=(e)=>{
    const video = e.target
    if (this.state.slowmoPlayback !== 'forward'){
      video.setPlaybackRate(1)
    }
    video.setOption({playsinline : 1})
    video.playVideo();
  }
  setVideoErrorMessage=(e)=>{
    console.log("video Doesn't exist")
    this.setState({videoExists: false})
  }

	render() {
    const trickKey = store.library[this.props.trickKey] ? this.props.trickKey : ""
    const trick = store.library[trickKey]
    const gifSection = trick && trick.gifUrl? trick.gifUrl.includes('library') ?
                          <img 
                             alt = ''
                             className="gifDemo"
                             src={trick.gifUrl}
                          /> :
                          <div className="jugglingLabGifSection">
                          <span>Generated by</span> <a target="_" href='http://www.jugglinglab.org'>jugglinglab.org</a>
                            <iframe
                              title={trick.name}
                              src={trick.gifUrl}
                              scrolling="no"
                            />
                          </div>
                          : null
    const instagramLogo = <img 
                             alt = ''
                             className="instagramLogo"
                             src={instagramLogoIcon}
                             onClick={()=>{this.handleInstagramLogoClick()}}
                          />
    let igHeader = !this.state.embedURL && this.state.videoURL && this.props.demoLocation !== 'expandedSection' && this.state.videoURL.includes('instagram') && this.state.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" 
                                  onClick={()=>{this.handleInstagramLogoClick()}}
                                  alt=""
                                  src={this.state.igData.picURL}/>
                            <span className="instagramUsername"
                                  onClick={()=>{this.handleInstagramLogoClick()}}>
                                    {this.state.igData.username}
                                  </span>
                            {instagramLogo}
                          </div> : null
    const youtubeOpts = {
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        mute : true,
        loop : 1,
        playsinline : 1
        /*events: {
         onReady: this.onYoutubePlayerReady(),
        }*/
      }
    }
    if(trick && trick.videoStartTime > -1){
      youtubeOpts.playerVars.start = trick.videoStartTime
      youtubeOpts.playerVars.end = trick.videoEndTime
    }else{
      youtubeOpts.playerVars.playlist = this.state.youtubeId
    }
    console.log("..."+this.state.embedURL)
    const igEmbedSection = this.state.embedURL ?

                          <iframe 
                               className={this.props.demoLocation === "expandedSection"?"igEmbedClassExpanded":"igEmbedClass"}
                               src={this.state.embedURL}></iframe> 
                         : null
    let video = this.state.videoURL && this.state.videoURL.includes('youtube') ? 
                        <YouTube
                          id="YouTubeVideo"
                          name="vidFrame" 
                          title="YouTubeVid"
                          videoId={this.state.youtubeId}
                          className= "youTubeDemo"
                          onClick = {() => this.handleYoutubeVideoClick()}
                          opts={youtubeOpts}      
                          muted={true}                          
                          allow="autoplay"  
                          allowtransparency="true"
                          src={this.state.videoURL}
                          onStateChange={this.youtubeStateChange}
                          onReady={this.onYoutubePlayerReady}
                          onEnd={this.youtubeEnded}
                          onError={() => this.setVideoErrorMessage()}
                          ref={(video)=> {this.video = video}}  
                        ></YouTube> : this.state.videoURL && this.state.videoURL.includes('instagram') ? 
                        <video 
                          id="instagramVideo"
                          ref={(video)=> {this.video = video}}
                          name="vidFrame" 
                          title="InstagramVid"
                          className= "demo"
                          onClick = {() => this.handleInstagramVideoClick()}                                  
                          autoPlay
                          muted={true}
                          playsInline
                          controls  
                          loop
                          onTimeUpdate={this.instagramTimeUpdate}
                          onPause={this.instagramPaused}
                          src={this.state.videoURL}
                        ></video> : null 
    if (igEmbedSection){
      console.log(igEmbedSection)
      video = igEmbedSection
    }
    let frameButtons = this.props.demoLocation === "detail" && !igEmbedSection ?
                        <div className = "frameButtons">
                          <img src = {frameIcon} 
                               alt = ""
                               title = "slow motion backwards"
                               className = {this.state.slowmoPlayback === "back" ? "frameIcon rotated180 selectedFlair" : "frameIcon rotated180"}
                               onClick = {() => this.toggleSlowmoPlayback('back')}
                               onContextMenu={(e) => e.preventDefault()}
                          />
                          <img src = {frameIcon}  
                               alt = ""
                               title = "slow motion forwards"
                               className = {this.state.slowmoPlayback === "forward" ? "frameIcon selectedFlair" : "frameIcon"}
                               onClick = {() => this.toggleSlowmoPlayback('forward')}
                               onContextMenu={(e) => e.preventDefault()}
                          />
                       </div> : null
    let outerDivClass
    if (this.props.demoLocation === "detail" || this.props.demoLocation === "home"){
      
      if (trick.gifUrl && trick.gifUrl.includes('lab') && !video){
        outerDivClass = "demoOuterDivDetailLab"
      }else{
        outerDivClass = "demoOuterDivDetail"
      }
    }else if(this.props.demoLocation === "expandedSection"){
      if (trick.gifUrl && trick.gifUrl.includes('lab')){
        outerDivClass = "demoOuterDivExpandedSectionLab"
      }else{
        outerDivClass = "demoOuterDivExpandedSection"
      }
    }if(this.state.embedURL){
      if(this.props.demoLocation === "expandedSection"){
        console.log("expanded")
        outerDivClass = "igEmbedOuterDivExpandedSection"
      }else{
        outerDivClass = "igEmbedOuterDiv"
      }
    }
    let videoRemovedMessage = 
                            <span className="videoRemovedMessage">
                              VIDEO HAS BEEN REMOVED!
                            </span>
		return(
      			<div className={outerDivClass}>
              {!this.state.videoExists || !video && !gifSection ? videoRemovedMessage : ""}
              {this.props.demoLocation === "detailExtraGif" ? gifSection:this.state.videoExists?video:""}
              {video? frameButtons:gifSection}
              {this.props.demoLocation === "detailExtraGif" ? null:igHeader}
      			</div>
          )
    }
  }

export default Demo