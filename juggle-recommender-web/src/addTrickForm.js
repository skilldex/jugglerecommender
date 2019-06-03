import React, {Component} from 'react';
import uiStore from "./uiStore"
import { observer } from "mobx-react"

@observer
class AddTrickForm extends Component {
	
	render (){
		const form = <div className="form">
						<label>Trick name</label><input/>
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