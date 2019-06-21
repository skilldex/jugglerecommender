import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { toJS } from "mobx"

import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import editCardIcon from './images/cardEditIcon.png'
import fullScreenIcon from './images/fullScreenIcon.png'
import minimizeIcon from './images/minimizeIcon.png'
import utilities from './utilities'
import PopupDemo from './popupDemo'
import authStore from "./stores/authStore"
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
  handleEditCatchButtonClick=()=>{
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
  }

  onMouseLeave(event){
    //this.setState({mouseInPopupDiv:false})
    mouseInPopupDiv = false
  }


  onBlur(event) {
    //detect click outside, but avoid cases where popup has just opened
    //if (!event.currentTarget.contains(event.relatedTarget) && !uiStore.popupTimer) {
    if (!uiStore.popupTimer && !mouseInPopupDiv) {
      uiStore.setPopupTrick(null)
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
    const popupTrick = store.library[popupTrickKey]
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
           onClick={()=>{ this.handleEditCatchButtonClick()}}
      />
    </div> : null
		const graphDiv = document.getElementById("graphDiv")
 		const addToMyTricksButton = uiStore.popupTrick && store.myTricks[uiStore.popupTrick.id] ? 
              		<button className="addAndRemoveMyTricksButtonOnPopup" onClick={()=>{store.removeFromMyTricks(uiStore.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButtonOnPopup" onClick={this.addToMyTricks}>&#9734;</button>
    const editTrickButton  = 
      popupTrick && authStore.user && (popupTrick.contributor == authStore.user.username || authStore.user.username == "tjthejuggler") ? 
      <img id="editCardButton" src={editCardIcon} className="editCardIcon" alt="toggleCardEdit" 
           onClick={()=>{uiStore.editPopupTrick()}}
      /> : null

    const popupCard = uiStore.popupTrick && popupTrickKey ? 
          			    <div style={{
                          left : Math.min(graphDiv.clientWidth-260,uiStore.popupTrick.x),
                      		top : Math.min(graphDiv.clientHeight-400,uiStore.popupTrick.y),
                          width : 260
                        }} 
                         className="popupDiv"
                    >
                      {editTrickButton}
                      <h3 className="popupHeader">{addToMyTricksButton}{popupTrick.name}</h3>             
                      {catchesSection}                         		
                      <label className="popupLabel">Difficulty: </label>{popupTrick.difficulty} / 10<br/>
                      <label className="popupLabel">Number of Balls: </label>{popupTrick.num}<br/>
                      {popupTrick.siteswap ? 
                        <div>
                          <label className="popupLabel">Siteswap: </label>{popupTrick.siteswap}<br/>
                        </div> : null
                      }
                      <label className="popupLabel">Contributor: </label>
                      {
                        popupTrick.contributor ? 
                        popupTrick.contributor : <a target="_" href='http://libraryOfJuggling.com'>libraryOfJuggling.com</a>
                      }
                      <br/><br/>
                      
                    	{popupTrick && popupTrick.url? 
                    		<span 
                         onClick={()=>{this.seeExplanation(popupTrickKey)}}
                         className="popupLink"
                    		>See explanation</span> : null
                      }
                      <PopupDemo/>
                      <br></br>
                      {popupTrick && popupTrick.tags?
                    		<label className="popupTags">
                    			Tags: {popupTrick.tags.join(', ')} 
                    		</label> : null
                      }<br></br>
                      {popupTrick && popupTrick.related && popupTrick.related.length>0 ?
                        <label className="popupTags">
                          Related: {popupTrick.related.join(', ')} 
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