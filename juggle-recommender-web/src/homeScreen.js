import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./homeScreen.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import Demo from './demo'
import ReactGA from 'react-ga';

@observer
class HomeScreen extends Component {
	componentDidMount(){
		store.getTrickOfTheDay()
	}
	clickPatternList=()=>{
		uiStore.toggleShowHomeScreen()
		if(!store.isLocalHost){
			ReactGA.event({
				  category: 'home screen',
				  action: "pattern list",
			});
		}
	}
	openDetail=()=>{
		uiStore.setDetailTrick(
			{...store.library[store.randomLeaderboardTrick.key], id: store.randomLeaderboardTrick.key}
		)
		if(!store.isLocalHost){
			ReactGA.event({
			  category: 'home screen',
			  action: "detail",
			});
		}
	}
	render (){
		return(
				<div className = "homeOuterDiv">
					<div className ='homeScreenTrickOuterDiv'>
						<div className = 'statsLabel'>Users </div>{store.userCount}
						<div className = 'statsLabel'>Patterns</div>{store.patternCount}
						<div className = 'statsLabel'>Catches</div>{store.totalCatchCount}
				    </div>
				    {
					    store.randomLeaderboardTrick && Object.keys(store.library).length > 0 ? 
							<div className = 'homeScreenTrickDiv'>
					            <h3 style={{marginBottom: "10px"}}>Pattern of The Day</h3>
					            <button className="detailButton" onClick = {this.openDetail}>View Details</button>
				            	<Demo 
					            	trickKey={store.randomLeaderboardTrick.key}
		                         	demoLocation="detail"
		  						/>
		  						<div className = "info">
						           	<span className='infoLabel'>Pattern</span> 
						           	{store.randomLeaderboardTrick.key} 
						        </div>
						        <div className = "info">
						           	<span className='infoLabel'>Record</span> 
						           	{store.randomLeaderboardTrick.user} ({store.randomLeaderboardTrick.catches} catches) 
					           	</div>       
					        </div>
						: null
					}
					<button className = "patternListButton"
							onClick={this.clickPatternList}>
						All Patterns
					</button>				    
				</div>
			)
	}
}
export default HomeScreen

