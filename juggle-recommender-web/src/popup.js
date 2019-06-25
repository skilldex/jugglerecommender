import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import deleteTrickIcon from './images/deleteTrickIcon.svg'
import editCardIcon from './images/cardEditIcon.png'
import closeIcon from './images/closeIcon.svg'
import PopupDemo from './popupDemo'
import authStore from "./stores/authStore"
import './App.css';
import './popup.css';

@observer
class Popup extends Component {
  state = {
    catches : null,
    gifFullScreen : false,
    changingInput : false,
  }

	onCatchesChange=(e)=>{
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
  onMouseEnter=(event)=>{
    uiStore.setMouseInPopupDiv(true)
  }

  onMouseLeave=(event)=>{
    uiStore.setMouseInPopupDiv(false)
  }
  toggleShowMoreInformation=()=>{
    uiStore.toggleShowMoreInformation()
  }
	render() {
//    document.body.style.overflow = 'hidden'
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
    const deleteTrickButton = 
      popupTrick && authStore.user && 
      (popupTrick.contributor === authStore.user.username || 
      authStore.user.username === "tjthejuggler") ?
        <img id="deleteTrickButton" 
              src={deleteTrickIcon} 
              className="deleteTrickIcon" 
              alt="deleteTrick" 
             onClick={()=>{store.deleteTrick()}}
        /> : null      
    const editTrickButton  = 
      popupTrick && authStore.user && 
      (popupTrick.contributor === authStore.user.username || 
      authStore.user.username === "tjthejuggler") ? 
        <img id="editCardButton" src={editCardIcon} className="editCardIcon" alt="toggleCardEdit" 
             onClick={()=>{uiStore.editPopupTrick()}}
        /> : null
    const closeButton  = 
        <img id="closeButton" src={closeIcon} className="closePopupIcon" alt="closeIcon" 
             onClick={()=>{uiStore.setPopupTrick(null)}}
        />

    const tags =  popupTrick && popupTrick.tags ? popupTrick.tags.sort().map((tag,i)=>{
                    if(i < popupTrick.tags.length-1){
                      return <span className="popupTag">{tag + ","}</span>
                    }else{
                      return <span className="popupTag">{tag}</span>
                    }
                  }) : null
    const related =  popupTrick && popupTrick.related ? popupTrick.related.sort().map((tag,i)=>{
                    if(i < popupTrick.related.length-1){
                      return <span className="popupTag">{tag + ","}</span>
                    }else{
                      return <span className="popupTag">{tag}</span>
                    }
                  }) : null
    const popupCard = uiStore.popupTrick && popupTrickKey ? 
          			    <div className="popupDiv">
                      {deleteTrickButton}
                      {editTrickButton}
                      {closeButton}
                      <h3 className="popupHeader">{addToMyTricksButton}{popupTrick.name}</h3>             
                      <div className="popupInfoDiv">
                        {catchesSection}
                        <label className="popupLabel">Contributor: </label>
                        {
                          popupTrick.contributor ? 
                          popupTrick.contributor : <a target="_" href='http://libraryOfJuggling.com'>Library Of Juggling</a>
                        }<br/>
                        {uiStore.showMoreInformation?
                          <div className="moreInfoDiv">                		
                            <label className="popupLabel">Difficulty: </label>{popupTrick.difficulty} / 10<br/>
                            <label className="popupLabel"># of Balls: </label>{popupTrick.num}<br/>
                            {popupTrick.siteswap ? 
                              <div>
                                <label className="popupLabel">Siteswap: </label>{popupTrick.siteswap}<br/>
                              </div> : null
                            }
                            {popupTrick && popupTrick.url ?
                              <label className="popupLabel">Tutorial: </label> : null
                            }
                            {popupTrick && popupTrick.url ?
                              <a target="_" href={popupTrick.url}>Library Of Juggling</a> : null
                            } 
                            {popupTrick && popupTrick.tags?
                              <div>
                                <label className="popupLabel">Tags:</label><br/>
                                <div className="popupTags">{tags}</div>
                              </div> : null
                            }
                            {popupTrick && popupTrick.related && popupTrick.related.length>0 ?
                              <div>
                                <label className="popupLabel">Related:</label><br/>
                                <div className="popupTags">{related}</div>
                              </div> : null
                            }
                          </div>:null
                        }
                      </div>   
                        <label className="showInfo" onClick={()=>this.toggleShowMoreInformation()}>
                          {uiStore.showMoreInformation?"(less info)":"(more info)"}
                        </label>                    
                      <PopupDemo/>                      
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