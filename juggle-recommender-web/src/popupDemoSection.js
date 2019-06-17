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
import './popup.css';

@observer
class PopupDemoSection extends Component {
  state = {

  }

	render() {
    const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    const gifSection = store.library[popupTrickKey] && store.library[popupTrickKey].url? 
                        <div className = "gifDiv">
                          <img src={fullScreenIcon} className="fullScreenIcon" alt="" onClick={()=>{uiStore.toggleGifFullscreen()}} />
                          <img width = '100' 
                               alt = ''
                               className="popupGif" 
                               src={store.library[popupTrickKey].gifUrl}/> 
                        </div> : null
    if (store.library[popupTrickKey] && store.library[popupTrickKey].video){
      store.getUsableVideoURL(store.library[popupTrickKey].video)
    }
    if(store.igData){
      console.log("profile img", toJS(store.igData.picURL))
    }
    let igHeader = store.popupVideoURL.includes('instagram') && store.igData ? 
                          <div className="instagramHeader">
                            <img className="profileImage" src={store.igData.picURL}/>
                            <span>{store.igData.username}</span>
                            <button className="instagramViewProfileButton" onClick={()=>{window.open(store.igData.profileURL)}}>View Profile</button>
                          </div> : null
    let videoIframe  = store.popupVideoURL.includes('youtube') ? 
                        <iframe name="vidFrame" 
                                title="UniqueTitleForVideoIframeToStopWarning"
                                className= {store.popupVideoURL.includes('youtube')?
                                                "popupGif":"instagramVideo"}                                  
                                  allow="autoplay"  
                                  allowtransparency="true"
                                  src={store.popupVideoURL}      
                        ></iframe> : store.popupVideoURL.includes('instagram') ? 
                        <video 
                          ref={(video)=> {this.popupVideo = video}}
                          name="vidFrame" 
                          title="UniqueTitleForVideoIframeToStopWarning"
                          className= {store.popupVideoURL.includes('youtube')?
                          "popupGif":"instagramVideo"}                                  
                          autoPlay
                          playsInline
                          controls  
                          loop
                          src={store.popupVideoURL}
                        ></video> : null

    const videoFullscreen  = <iframe  className= {store.popupVideoURL.includes('youtube')?
                                                "youtubeFullScreen" : "instagramFullScreen"}   
                                  title="UniqueTitleForvideoFullscreenToStopWarning"                             
                                  allow="autoplay"  
                                  allowtransparency="true" 
                                  src={store.popupVideoURL}></iframe>
    const videoSection = store.library[popupTrickKey] && store.library[popupTrickKey].video ?
                        <div className = {store.popupVideoURL.includes('youtube')?
                                        "gifDiv":"instagramDiv"}>
                          <img src={fullScreenIcon} className="fullScreenIcon" alt="" onClick={()=>{uiStore.toggleGifFullscreen()}} />
                          {videoIframe}
                        </div> : null
    const gifFullScreenPopupGif = 
          store.library[popupTrickKey] && store.library[popupTrickKey].gifUrl?
              <div>
                <img src={minimizeIcon} 
                      className="fullScreenIcon" 
                      alt="" onClick={()=>{uiStore.toggleGifFullscreen()}} />
                <img  height = '90%'
                      alt = ''                   
                      src={store.library[popupTrickKey].gifUrl}/> 
              </div> 
             : null
    const gifFullScreenPopupVideo = 
      store.library[popupTrickKey] && store.library[popupTrickKey].video?
          <div>
            <img src={minimizeIcon} 
                className="fullScreenIcon" 
                alt="" onClick={()=>{uiStore.toggleGifFullscreen()}} />
            {videoFullscreen}
          </div> 
         : null
    const fullScreenDemo = <div className = "fullScreenPopup">
                            {gifFullScreenPopupVideo}
                            {gifFullScreenPopupGif}
                           </div>

    const popupDemo = <div>
                        {igHeader}
                        {videoSection}
                        {gifSection}
                      </div>
    
		return(
      			<div>
              {uiStore.gifFullscreen ? fullScreenDemo : popupDemo}
      			</div>
          )
    }
  }

export default PopupDemoSection