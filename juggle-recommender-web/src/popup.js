import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { toJS } from "mobx"

import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import fullScreenIcon from './images/fullScreenIcon.png'
import minimizeIcon from './images/minimizeIcon.png'
import utilities from './utilities'
import PopupDemoSection from './popupDemoSection'

import './App.css';
import './popup.css';

let mouseInPopupDiv = true

@observer
class Popup extends Component {
  state = {
    catches : null,
    gifFullScreen : false,
    changingInput : false,
  }


	onCatchesChange=(e)=>{
    console.log("change")
	 	const re = /^[0-9\b]+$/;
	  	if (e.target.value === '' || re.test(e.target.value)) {
	       const catches = e.target.value
         this.setState({catches})
  	  }

	}
  onCatchesKeyPress=(target)=> {
    // If enter pressed
    console.log("caught", target)
    if(target.charCode===13){  
      uiStore.toggleCatchEdit(this.state.catches, uiStore.popupTrick.id)
      //set focus back to outer div
      this.outerDiv.focus()   
    }
  }
  seeExplanation=(trickKey)=>{
    if(!uiStore.popupTimer){
        window.open(store.library[trickKey].url)
    }
  }
  addToMyTricks=()=>{
    this.setState({"catches":0})
    store.addToMyTricks(uiStore.popupTrick.id)
  }
  handleEditButtonClick=()=>{
    this.setState({catches:store.myTricks[uiStore.popupTrick.id].catches})
    uiStore.toggleCatchEdit(this.state.catches,uiStore.popupTrick.id)
    //focus after render
    setTimeout(function() {
      if (this.catchInput){
        this.catchInput.focus();
        this.catchInput.select();
      }
    }, 100);  
  }
  onMouseEnter(event){
    //this.setState({mouseInPopupDiv:true})
    mouseInPopupDiv = true
    console.log('mouseInPopupDiv',mouseInPopupDiv)
  }

  onMouseLeave(event){
    //this.setState({mouseInPopupDiv:false})
    mouseInPopupDiv = false
    console.log('mouseInPopupDiv',mouseInPopupDiv)
  }


  onBlur(event) {

    //detect click outside, but avoid cases where popup has just opened
    //if (!event.currentTarget.contains(event.relatedTarget) && !uiStore.popupTimer) {
 if (!uiStore.popupTimer) {

      if(!mouseInPopupDiv){
        uiStore.setPopupTrick(null)
      }

    }

  }
	render() {
    //set focus for outer div for onblur closing
    if(this.outerDiv){this.outerDiv.focus()}
    //set focus to compensate for onblur function
    if(this.catchInput){this.catchInput.focus()}

    document.addEventListener("click", (evt) => {
      const inputElement = document.getElementById("catchInput");
      const buttonElement = document.getElementById("editCatchButton");
      let targetElement = evt.target;
      do {
        if (targetElement === inputElement || targetElement === buttonElement) {
          return;
        }
        targetElement = targetElement.parentNode;
      } while (targetElement);
      if (uiStore.popupCatchEditable){
        uiStore.toggleCatchEdit(this.state.catches, uiStore.popupTrick.id)
      }
    });
   
    const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    const catchesSection = store.myTricks[popupTrickKey] ?
    <div>
      <label className="popupLabel">Catches: </label>
      {uiStore.popupCatchEditable ?
        <input 
              ref={(input)=> {this.catchInput = input}}
              id = "catchInput"
               type="number" 
               onKeyPress = {(e)=>this.onCatchesKeyPress(e)}
               onChange={this.onCatchesChange}
        /> :
        <span>{store.myTricks[popupTrickKey].catches}</span>
      }
      <img id="editCatchButton" src={editIcon} className="editCatchIcon" alt="toggleCatchEdit" 
           onClick={()=>{ this.handleEditButtonClick()}}
      />
    </div> : null
		const graphDiv = document.getElementById("graphDiv")
 		const addToMyTricksButton = uiStore.popupTrick && store.myTricks[uiStore.popupTrick.id] ? 
              		<button className="addAndRemoveMyTricksButtonOnPopup" onClick={()=>{store.removeFromMyTricks(uiStore.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButtonOnPopup" onClick={this.addToMyTricks}>&#9734;</button>

    const popupCard = uiStore.popupTrick && popupTrickKey ? 
          			    <div style={{
                          left : Math.min(graphDiv.clientWidth-260,uiStore.popupTrick.x),
                      		top : Math.min(graphDiv.clientHeight-400,uiStore.popupTrick.y),
                          width : 260
                        }} 
                         className="popupDiv"
                    >
                      <h3 className="popupHeader">{addToMyTricksButton}{store.library[popupTrickKey].name}</h3>             
                      {catchesSection}                         		
                      <label className="popupLabel">Difficulty: </label>{store.library[popupTrickKey].difficulty} / 10<br/>
                      <label className="popupLabel">Number of Balls: </label>{store.library[popupTrickKey].num}<br/>
                      {store.library[popupTrickKey].siteswap ? 
                        <div>
                          <label className="popupLabel">Siteswap: </label>{store.library[popupTrickKey].siteswap}<br/>
                        </div> : null
                      }
                      <label className="popupLabel">Contributor: </label>
                      {
                        store.library[popupTrickKey].contributor ? 
                        store.library[popupTrickKey].contributor : <a target="_" href='http://libraryOfJuggling.com'>libraryOfJuggling.com</a>
                      }
                      <br/><br/>
                      
                    	{store.library[popupTrickKey] && store.library[popupTrickKey].url? 
                    		<span 
                         onClick={()=>{this.seeExplanation(popupTrickKey)}}
                         className="popupLink"
                    		>See explanation</span> : null
                      }
                      <PopupDemoSection/>
                      <br></br>
                      {store.library[popupTrickKey] && store.library[popupTrickKey].tags?
                    		<label className="popupTags">
                    			Tags: {store.library[popupTrickKey].tags.join(', ')} 
                    		</label> : null
                      }<br></br>
                      {store.library[popupTrickKey] && store.library[popupTrickKey].related && store.library[popupTrickKey].related.length>0 ?
                        <label className="popupTags">
                          Related: {store.library[popupTrickKey].related.join(', ')} 
                        </label> : null
                      }
                    </div> : null
		return(
      
      			<div onMouseEnter={this.onMouseEnter} 
                 onMouseLeave={this.onMouseLeave}
                 onBlur={this.onBlur} 
                 ref={(div)=> {this.outerDiv = div}}  
                 tabIndex="0">
              {popupCard}
      			</div>
          )
    }
  }

export default Popup