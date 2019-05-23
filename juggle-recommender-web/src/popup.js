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
		const popup = uiStore.popupTrick && uiStore.popupTrick.id ? 
			    <div style={{
					left : Math.min(graphDiv.clientWidth-260,uiStore.popupTrick.x),
					top : Math.min(graphDiv.clientHeight-460,uiStore.popupTrick.y)
				}} className="popupDiv">
              		<h3>{jugglingLibrary[uiStore.popupTrick.id].name}</h3> 
              		{store.myTricks[uiStore.popupTrick.id] ? 
              		<div>
              			<label>Catches: </label>
              			{uiStore.popupCatchEditable ?
              			<input defaultValue = {store.myTricks[uiStore.popupTrick.id].catches} type="number" onChange={this.onCatchesChange}/> :
              			<span>{store.myTricks[uiStore.popupTrick.id].catches}</span>}

						<img src={editIcon} alt="toggleCatchEdit" 
					 			onClick={uiStore.toggleCatchEdit} height='15px'width='15px'/>

              		</div>: null}
              		
              		<label>Difficulty: {jugglingLibrary[uiStore.popupTrick.id].difficulty} / 10</label><br></br><br></br>
              			{addToMyTricksButton}
              			{selectTrickButton}
              			{jugglingLibrary[uiStore.popupTrick.id] && jugglingLibrary[uiStore.popupTrick.id].url? 
              				<a className="popupLink"
              				   href={jugglingLibrary[uiStore.popupTrick.id].url} 
              				   target="_blank">See explanation</a> : null}
              			{jugglingLibrary[uiStore.popupTrick.id] && jugglingLibrary[uiStore.popupTrick.id].url? 
              		<img className="popupGif" 
              			 src={jugglingLibrary[uiStore.popupTrick.id].gifUrl}/> : null}
              		<br></br>
              			{jugglingLibrary[uiStore.popupTrick.id] && jugglingLibrary[uiStore.popupTrick.id].tags?
              		<label className="popupTags">
              			TAGS: {jugglingLibrary[uiStore.popupTrick.id].tags.join(', ')} 
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