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
	onCatchesChange=(e)=>{
	 	const re = /^[0-9\b]+$/;
	  	if (e.target.value === '' || re.test(e.target.value)) {
	       const catches = e.target.value
	   	   store.setCatches(catches, uiStore.popupTrick.id)
  	  	}
	}

	render() {
		const graphDiv = document.getElementById("graphDiv")
 		const addToMyTricksButton = uiStore.popupTrick && store.myTricks[uiStore.popupTrick.id] ? 
              		  <button className="addAndRemoveMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.removeFromMyTricks(uiStore.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.addToMyTricks(uiStore.popupTrick.id)}}>&#9734;</button>
		const selectTrickButton = uiStore.popupTrick && uiStore.selectedTricks.includes(uiStore.popupTrick.id) ? 
 		              <button style={{"backgroundColor" : "darkgray", "margin-bottom" : "10px"}} onClick={()=>{uiStore.selectTricks([uiStore.popupTrick.id])}}>Unselect</button> :
 		              <button style={{"backgroundColor" : "lightgray", "margin-bottom" : "10px"}} onClick={()=>{uiStore.selectTricks([uiStore.popupTrick.id])}}>Select</button> 
		const popupTrickKey = uiStore.popupTrick ? uiStore.popupTrick.id : ""
    const popup = uiStore.popupTrick && popupTrickKey ? 
			    <div style={{
					left : Math.min(graphDiv.clientWidth-260,uiStore.popupTrick.x),
					top : Math.min(graphDiv.clientHeight-460,uiStore.popupTrick.y)
				}} className="popupDiv">
              		<h3>{store.myTricks[popupTrickKey] ? "★" : ""}{jugglingLibrary[popupTrickKey].name}</h3> 
              		{store.myTricks[popupTrickKey] ? 
              		<div>
              			<label>Catches: </label><br/>
              			{uiStore.popupCatchEditable ?
              			<input defaultValue = {store.myTricks[popupTrickKey].catches} type="number" onChange={this.onCatchesChange}/> :
              			<span>{store.myTricks[popupTrickKey].catches}</span>}

						<img src={editIcon} class="editCatchIcon" alt="toggleCatchEdit" 
					 			onClick={uiStore.toggleCatchEdit} height='15px'width='15px'/>

              		</div>: null}
              		
              		<label>Difficulty: {jugglingLibrary[popupTrickKey].difficulty} / 10</label><br/>
                  <label>Siteswap: {jugglingLibrary[popupTrickKey].siteswap}</label><br/><br/>
              			{addToMyTricksButton}
              			{selectTrickButton}
              			{jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].url? 
              				<a className="popupLink"
              				   href={jugglingLibrary[popupTrickKey].url} 
              				   target="_blank">See explanation</a> : null}
              			{jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].url? 
              		<img className="popupGif" 
              			 src={jugglingLibrary[popupTrickKey].gifUrl}/> : null}
              		<br></br>
              			{jugglingLibrary[popupTrickKey] && jugglingLibrary[popupTrickKey].tags?
              		<label className="popupTags">
              			TAGS: {jugglingLibrary[popupTrickKey].tags.join(', ')} 
              		</label> : null}
            	</div> : null
		return(
			<div>
				{popup}
			</div>
            )
        }
	}

export default Popup