import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import filterStore from "./stores/filterStore"
import "./profile.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import shareIcon from './images/shareIcon.png'
import Demo from './demo'
import ReactGA from 'react-ga';
import history from './history';
import downArrow from './images/down-arrow.svg'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'


@observer
class Profile extends Component {
	state={
		contributedTrickCount: 0,
		withCatches: 0,
		withStar: 0,
		withBaby: 0,
		withNinja: 0,
		totalCatches: 0,
	}
	componentDidMount(){
		let contributorCount = 0
		Object.keys(store.library).forEach((trick) => {
			if (store.library[trick].contributor && 
				store.library[trick].contributor === authStore.user.username){
				contributorCount += 1
			}
		})
		this.setState({contributedTrickCount: contributorCount})
		let totalCatches = 0
		let withCatches = 0
		let withStar = 0
		let withBaby = 0
		let withNinja = 0
		Object.keys(store.myTricks).forEach((trick) => {
			if (store.myTricks[trick]){
				if (store.myTricks[trick].catches && 
					store.myTricks[trick].catches > 0){
					withCatches += 1
					totalCatches += parseInt(store.myTricks[trick].catches,10)
				}
				if (store.myTricks[trick].starred && 
					store.myTricks[trick].starred === 'true'){
					withStar += 1
				}
				if (store.myTricks[trick].baby && 
					store.myTricks[trick].baby === 'true'){
					withBaby += 1
				}
				if (store.myTricks[trick].ninja && 
					store.myTricks[trick].ninja === 'true'){
					withNinja += 1
				}
			}
		})
		this.setState({withCatches})
		this.setState({withStar})
		this.setState({withBaby})
		this.setState({withNinja})
		this.setState({totalCatches})
 
	}
    copyContributorURL=()=>{
      const textField = document.createElement('textarea')
      const url = window.location.origin + "/?contributor=" + authStore.user.username +",&"
      textField.innerText = url
      document.body.appendChild(textField)
      var range = document.createRange();  
      range.selectNode(textField);  
      window.getSelection().addRange(range);  
      textField.select()
      document.execCommand('copy')
      textField.remove()

      alert("Link for your contributed tricks copied to clipboard\n" + url)
    }

    handleStatsLabelClicked =(label)=>{
		history.push('/tricklist')
		uiStore.clearUI()
		filterStore.resetAllFilters()
		if (label === 'contributed'){
			filterStore.setContributors([{id: authStore.user.username,text: authStore.user.username,}]);
		}else if (label === 'catches'){
			filterStore.setMinCatches(1)
		}else if (label === 'starflair'){

		}
		else if (label === 'babyflair'){

		}
		else if (label === 'ninjaflair'){

		}
		uiStore.resetSelectedTrick()
		uiStore.updateRootTricks()
    }

	render (){

        const shareButton = authStore.user ? <img 
			                 className="shareFilterButton"
			                 src={shareIcon}
			                 onClick={this.copyContributorURL}
			                 alt=""
			                 title="share your contributed tricks"
			            /> : null
		return(
			<div className = "profileOuterDiv">
	        		<div className="backButtonSurroundingDivProfile">
			            <img id="backButton" 
			            	 src={downArrow} 
			            	 className="backButtonProfile rotatedNegative90" 
			            	 alt="backIcon" 
		             		 onClick={()=>{ uiStore.handleBackButtonClick()}}/>
		             	<label className="backButtonProfileLabel" 
		             		   onClick={()=>{ uiStore.handleBackButtonClick()}}>Back
		             	</label>
		             	{shareButton}
		            </div>
				<h3 style={{marginBottom: "10px"}}>Profile</h3>
					<h3>Your Stats</h3>		
					<div className = "individualProfileStatsDiv">
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('contributed')}>
							Contributed
						</label>  
						<div className = "profileStatsValues">
							{this.state.contributedTrickCount} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<img id="starButton" 
                              src={starIcon} 
                              className="iconProfile"
                              alt="starIcon" 
                              onClick={()=>this.handleStatsLabelClicked('star')}
                        />  
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('star')}>
							Starred
						</label>
						<div className = "profileStatsValues">
							{this.state.withStar} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<img id="babyButton" 
                              src={babyIcon} 
                              className="iconProfile"
                              alt="babyIcon" 
                              onClick={()=>this.handleStatsLabelClicked('baby')}
                        />					
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('baby')}>
							Beginner
						</label>  
						<div className = "profileStatsValues">
							{this.state.withBaby} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<img id="ninjaButton" 
                              src={ninjaIcon} 
                              className="iconProfile"
                              alt="ninjaIcon" 
                              onClick={()=>this.handleStatsLabelClicked('ninja')}
                        />					
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('ninja')}>
							Expert
						</label>  
						<div className = "profileStatsValues">
							{this.state.withNinja} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('catches')}>
							With Catches
						</label>  
						<div className = "profileStatsValues">
							{this.state.withCatches} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<label className= "profileStatsLabelButton"
								onClick = {()=>this.handleStatsLabelClicked('catches')}>
							Total Catches
						</label>  
						<div className = "profileStatsValues">
							{this.state.totalCatches} 
						</div>
					</div>
			</div>
		)
	}
}
export default Profile

