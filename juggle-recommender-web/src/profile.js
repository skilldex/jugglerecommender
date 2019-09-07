import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import filterStore from "./stores/filterStore"
import "./profile.css"
import { observer } from "mobx-react"
//import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import utilities from './utilities'
import shareIcon from './images/shareIcon.png'
import downArrow from './images/down-arrow.svg'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'
import catchesIcon from './images/catchesIcon.svg'


@observer
class Profile extends Component {
	state={
		contributedTrickCount: 0,
		contributedViewCount: 0,
		contributedCatchesCount: 0,
		contributedWorkersCount: 0,
		withCatches: 0,
		withStar: 0,
		withBaby: 0,
		withNinja: 0,
		totalCatches: 0,
	}
	componentDidMount(){
		let contributorCount = 0
		let viewCount = 0
		let workerCount = 0
		let catchesCount = 0
		Object.keys(store.library).forEach((trick) => {
			if (store.library[trick].contributor && 
				store.library[trick].contributor === authStore.user.username){
				contributorCount += 1
				if (store.library[trick].views)
					viewCount += store.library[trick].views
				if (store.library[trick].usersWithCatches){
					catchesCount += store.library[trick].usersWithCatches
				}
				if (store.library[trick].usersWorkingOn){
					workerCount += store.library[trick].usersWorkingOn
				}

				let contributorHasCatches = false
				if (store.myTricks[trick] && 
					store.myTricks[trick]['catches'] &&
					parseInt(store.myTricks[trick]['catches'], 10)>0){
						catchesCount = catchesCount - 1
						workerCount = workerCount - 1
						contributorHasCatches = true
				}
				if (!contributorHasCatches){
					let contributorHasFlair = false
					if (store.myTricks[trick] && 
						store.myTricks[trick]['baby'] &&
						store.myTricks[trick]['baby'] === 'true'){
							contributorHasFlair = true
					}	
					if (store.myTricks[trick] && 
						store.myTricks[trick]['ninja'] &&
						store.myTricks[trick]['ninja'] === 'true'){
							contributorHasFlair = true
					}	
					if (contributorHasFlair){
						workerCount = workerCount - 1
					}				
				}
			}
		})
		this.setState({contributedTrickCount: contributorCount})
		this.setState({contributedViewCount: viewCount})
		this.setState({contributedCatchesCount: catchesCount})
		this.setState({contributedWorkersCount: workerCount})

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
      utilities.sendGA('profile','share')	
      const textField = document.createElement('textarea')
      const url = window.location.origin + "/contributor/" + authStore.user.username
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
		filterStore.resetAllFilters()
		if (label === 'contributed'){
			filterStore.setContributors([authStore.user.username]);
		}else if (label === 'catches'){
			filterStore.setFlair(['catches'])
		}else if (label === 'star'){
			filterStore.setFlair(['starred'])
		}
		else if (label === 'baby'){
			filterStore.setFlair(['baby'])
		}
		else if (label === 'ninja'){
			filterStore.setFlair(['ninja'])
		}
		utilities.sendGA('profile', 'tricklist via statsLabel')
		utilities.openPage('tricklist',true)
    }

	render (){

        const shareButton = authStore.user ? <img 
			                 className="shareProfileButton"
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
					<div className = "signedInAsSection">
						<b> Signed in as </b>
						<span> {authStore.user.username}</span>
						<span> ({authStore.user.email})</span>
					</div>
					<h3 className="profileHeader">Your Pattern Stats</h3>		
					<div className = "individualProfileStatsDiv">
						<img  id="starButton" 
							  title="Star flair: Special list"
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
						<img  id="babyButton" 
							  title="Baby flair: You're learning"
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
						<img  id="ninjaButton" 
							  title="Ninja flair: You're experienced" 
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
						<img  id="cathcesButton" 
							  title="Catches flair: You've logged catches"
                              src={catchesIcon} 
                              className="iconProfile"
                              alt="catchesIcon" 
                              onClick={()=>this.handleStatsLabelClicked('catches')}
                        />	
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
					<h3 className="profileHeader">Your Contribution Stats</h3>	
					<div className = "individualProfileStatsDiv">
						<label className= {this.state.contributedTrickCount > 0?
											"profileStatsLabelButton" : "profileStatsLabelButtonGreyed"}
								onClick = {()=>this.handleStatsLabelClicked('contributed')}>
							Contributed
						</label>  
						<div className = "profileStatsValues">
							{this.state.contributedTrickCount} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<label className= {this.state.contributedTrickCount > 0?
											"profileStatsLabelButton" : "profileStatsLabelButtonGreyed"}
								onClick = {()=>this.handleStatsLabelClicked('contributed')}>
							Views
						</label>  
						<div className = "profileStatsValues">
							{this.state.contributedViewCount} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<label className= {this.state.contributedTrickCount > 0?
											"profileStatsLabelButton" : "profileStatsLabelButtonGreyed"}
								onClick = {()=>this.handleStatsLabelClicked('contributed')}>
							Other Users w. Catches
						</label>  
						<div className = "profileStatsValues">
							{this.state.contributedCatchesCount} 
						</div>
					</div>
					<div className = "individualProfileStatsDiv">
						<label className= {this.state.contributedTrickCount > 0?
											"profileStatsLabelButton" : "profileStatsLabelButtonGreyed"}
								onClick = {()=>this.handleStatsLabelClicked('contributed')}>
							Users Practicing Your Tricks
						</label>  
						<div className = "profileStatsValues">
							{this.state.contributedWorkersCount} 
						</div>
					</div>
					<br/><br/>
			</div>
		)
	}
}
export default Profile

