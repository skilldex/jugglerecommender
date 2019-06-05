import React, {Component} from 'react';
import uiStore from "./uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"

@observer
class AddTrickForm extends Component {
	
	render (){
		const form = <div className="form">
						<label className="listExpandCollapseButton">X</label><br/><br/>
						<label>Trick name</label><br/><input/><br/>
						<label>Number of balls</label><br/><input/><br/>
						<label>Difficulty</label><br/><input/><br/>
						<label>Contributor</label><br/><input/><br/>
						<label>Video URL</label><br/><input/><br/>
						<label>Siteswap</label><br/><input/><br/>
						<label>Prereqs</label><br/><input/><br/>
						<label>Tags</label><br/><input/><br/>
					</div>
		console.log("form", form)
		return(
				<div>
					{uiStore.addingTrick ? form : null}
				</div>
			)
	}
}
export default AddTrickForm