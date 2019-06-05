import React, {Component} from 'react';
import uiStore from "./uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"

@observer
class AddTrickForm extends Component {
	
	render (){
		const form = <div className="form">
						<label>Trick name</label><input/><br/>
						<label>Number of balls</label><input/><br/>
						<label>Difficulty</label><input/><br/>
						<label>Contributor</label><input/><br/>
						<label>Video URL</label><input/><br/>
						<label>Siteswap</label><input/><br/>
						<label>Prereqs</label><input/><br/>
						<label>Tags</label><input/><br/>
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