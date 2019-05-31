import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import uiStore from './uiStore'
import { observer } from "mobx-react"
import editIcon from './editIcon.png'
import './App.css';
import './popup.css';

@observer
class Popup extends Component {


  state = {
    catches : null
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
    } 
  }
  seeExplanation=(trickKey)=>{
    if(!uiStore.popupTimer){
        window.open(jugglingLibrary[trickKey].url)
    }
  }
	render() {
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
		const graphDiv = document.getElementById("graphDiv")
 		const addToMyTricksButton = uiStore.popupTrick && store.myTricks[uiStore.popupTrick.id] ? 
              		<button className="addAndRemoveMyTricksButtonOnPopup" onClick={()=>{store.removeFromMyTricks(uiStore.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButtonOnPopup" onClick={()=>{store.addToMyTricks(uiStore.popupTrick.id)}}>&#9734;</button>
		const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    const popup = uiStore.popupTrick && popupTrickKey ? 
			    <div style={{left : Math.min(graphDiv.clientWidth-260,uiStore.popupTrick.x),
          					   top : Math.min(graphDiv.clientHeight-460,uiStore.popupTrick.y),
                       width : 260,}} 
              className="popupDiv">
            <h3>{addToMyTricksButton}{jugglingLibrary[popupTrickKey].name}</h3> 
            {store.myTricks[popupTrickKey] ? 
              <div>
          			<label>Catches: </label><br/>
          			{uiStore.popupCatchEditable ?
            			<input id = "catchInput"
                         type="number" 
                         onKeyPress = {(e)=>this.onCatchesKeyPress(e)}
                         onChange={this.onCatchesChange}/> :
            			<span>{store.myTricks[popupTrickKey].catches}</span>
                }
						    <img id="editCatchButton" src={editIcon} className="editCatchIcon" alt="toggleCatchEdit" 
					 			     onClick={()=>{uiStore.toggleCatchEdit(this.state.catches,uiStore.popupTrick.id)}} height='15px'width='15px'/>
              </div>: null
            }              		
            		<label>Difficulty: {jugglingLibrary[popupTrickKey].difficulty} / 10</label><br/>
                <label>Siteswap: {jugglingLibrary[popupTrickKey].siteswap}</label><br/><br/>
          			{
                  jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].url? 
          				<span 
                     onClick={()=>{this.seeExplanation(popupTrickKey)}}
                     className="popupLink"
          				>See explanation</span> : null
                 }
          			{
                  jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].url? 
            		  <img width = '100' 
                       alt = ''
                       className="popupGif" 
            			     src={jugglingLibrary[popupTrickKey].gifUrl}/> : null
                }
            		<br></br><br/><br/>
            		{
                  jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].tags?
              		<label className="popupTags">
              			Tags: {jugglingLibrary[popupTrickKey].tags.join(', ')} 
              		</label> : null
                }
                  <br></br>
                {
                  jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].related.length>0 ?
                  <label className="popupTags">
                    Related: {jugglingLibrary[popupTrickKey].related.join(', ')} 
                  </label> : null
                }
          </div> : null
		return(
			<div>
				{popup}
			</div>
            )
        }
	}

export default Popup