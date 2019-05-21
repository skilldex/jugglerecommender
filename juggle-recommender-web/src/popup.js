import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import { observer } from "mobx-react"
import legendImg from './greenToRedFade.jpg'
import sortIcon from './sortIcon.png'
@observer
class Popup extends Component {
	render() {
		const graphDiv = document.getElementById("graphDiv")
 		const addToMyTricksButton = store.popupTrick && store.myTricks.includes(store.popupTrick.id) ? 
              		  <button className="addAndRemoveMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.removeFromMyTricks(store.popupTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButton" style={{"margin-bottom" : "10px"}} onClick={()=>{store.addToMyTricks(store.popupTrick.id)}}>&#9734;</button>
		const selectTrickButton = store.popupTrick && store.selectedTricks.includes(store.popupTrick.id) ? 
 		              <button style={{"backgroundColor" : "darkgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Unselect</button> :
 		              <button style={{"backgroundColor" : "lightgray", "margin-bottom" : "10px"}} onClick={()=>{store.selectTricks([store.popupTrick.id])}}>Select</button> 
		const popup = store.popupTrick && store.popupTrick.id ? 
			    <div style={{
					left : Math.min(graphDiv.clientWidth-260,store.popupTrick.x),
					top : Math.min(graphDiv.clientHeight-460,store.popupTrick.y)
				}} className="popupDiv">
              		<h3>{jugglingLibrary[store.popupTrick.id].name}</h3> 
              		<label>Difficulty: {jugglingLibrary[store.popupTrick.id].difficulty} / 10</label><br></br><br></br>
              			{addToMyTricksButton}
              			{selectTrickButton}
              			{jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? 
              				<a className="popupLink"
              				   href={jugglingLibrary[store.popupTrick.id].url} 
              				   target="_blank">See explanation</a> : null}
              			{jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].url? 
              		<img className="popupGif" 
              			 src={jugglingLibrary[store.popupTrick.id].gifUrl}/> : null}
              		<br></br>
              			{jugglingLibrary[store.popupTrick.id] && jugglingLibrary[store.popupTrick.id].tags?
              		<label className="popupTags">
              			TAGS: {jugglingLibrary[store.popupTrick.id].tags.join(', ')} 
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