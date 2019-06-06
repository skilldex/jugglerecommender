import React, {Component} from 'react';
import uiStore from "./uiStore"
import "./addTrickForm.css"
import { observer } from "mobx-react"
import authStore from "./authStore"
import store from "./store"
@observer
class AddTrickForm extends Component {
	state = {
		name : "",
		numBalls : "",
		difficulty : "",
		videoURL : "",
		siteSwap : "",
		prereqs : [],
		tags : []

	}

	handleNameChange=(e)=>{
		this.setState({
			name:e.target.value
		})
	}
	handleNumBallsChange=(e)=>{
		this.setState({
			numBalls:e.target.value
		})
	}
	handleDiffChange=(e)=>{
		this.setState({
			difficulty:e.target.value
		})
	}
	handleVideoURLChange=(e)=>{
		this.setState({
			videoURL:e.target.value
		})
	}
	handleSSChange=(e)=>{
		this.setState({
			siteSwap:e.target.value
		})
	}
	submit=()=>{		
		const trick = {
			name : this.state.name,
			num : this.state.numBalls,
			difficulty : this.state.difficulty,
			contributor : authStore.user.username, 
			video : this.state.videoURL,
			siteswap :  this.state.siteSwap,
			prereqs : ["Cascade"],
			tags : ["multiplex"]
		}
		store.addTrickToDatabase(trick)
	}
	cancel=()=>{
		
	}
	render (){
		//TODO add prereqs and tags as react tags 

		const form = 	
						<div className="form">
							<label>Trick name</label><br/><input value={this.state.name} onChange={this.handleNameChange}/><br/>
							<label>Number of balls</label><br/><input value={this.state.numBalls} onChange={this.handleNumBallsChange}/><br/>
							<label>Difficulty</label><br/><input value={this.state.difficulty} onChange={this.handleDiffChange}/><br/>
							<label>Video URL</label><br/><input value={this.state.videoURL} onChange={this.handleVideoURLChange}/><br/>
							<label>Siteswap</label><br/><input value={this.state.siteSwap} onChange={this.handleSSChange}/><br/>
							<button onClick={this.submit}>submit</button>
							<button onClick={uiStore.toggleAddingTrick}>cancel</button>
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

