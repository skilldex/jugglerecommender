import React, {Component} from 'react';
import uiStore from "./uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"

@observer
class AddTrickForm extends Component {
	submitForm =()=>{
		console.log('submitForm')
	}
	render (){
		const form = 
					<form className="form" name="personal" onSubmit={this.submitForm}>
						<label>Trick name</label><br/><input/><br/>
						<label>Number of balls</label><br/><input/><br/>
						<label>Difficulty</label><br/><input/><br/>
						<label>Contributor</label><br/><input/><br/>
						<label>Video URL</label><br/><input/><br/>
						<label>Siteswap</label><br/><input/><br/>
						<label>Prereqs</label><br/><input/><br/>
						<label>Tags</label><br/><input/><br/>
						<button type='submit'>submit</button>
					</form>

		console.log("form", form)
		return(
				<div>
					{uiStore.addingTrick ? form : null}
				</div>
			)
	}
}
export default AddTrickForm

