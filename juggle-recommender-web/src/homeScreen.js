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
@observer
class HomeScreen extends Component {
	componentDidMount(){
		store.getTrickOfTheDay()
	}
	render (){
		return(
				<div className = "outerDiv">
					<div className ='homeScreenTrickOuterDiv'>
						<div className = 'statsLabel'>Users </div>{store.userCount}
						<div className = 'statsLabel'>Patterns</div>{store.patternCount}
						<div className = 'statsLabel'>Catches</div>{store.totalCatchCount}
				    </div>
				    {
					    store.randomLeaderboardTrick && Object.keys(store.library).length > 0 ? 
							<div className = 'homeScreenTrickDiv'>
					            <h3 style={{marginBottom: "10px"}}>Pattern of The Day</h3>
					            <button className="detailButton" onClick = {
						            	()=>{uiStore.setDetailTrick(
						            		{...store.library[store.randomLeaderboardTrick.key], id: store.randomLeaderboardTrick.key}
						            	)}
					            	}
					            >View Details</button>
				            	<Demo 
					            	trickKey={store.randomLeaderboardTrick.key}
		                         	demoLocation="detail"
		  						/>
		  						<div>
						           	<span style={{marginTop: "5px"}} className='statsLabel'>Pattern</span> 
						           	{store.randomLeaderboardTrick.key} 
						        </div>
						        <div>
						           	<span style={{marginTop: "5px"}} className='statsLabel'>Record</span> 
						           	{store.randomLeaderboardTrick.user} ({store.randomLeaderboardTrick.catches} catches) 
					           	</div>       
					        </div>
						: null
					}
					<button className = "patternListButton"
							onClick={()=>uiStore.toggleShowHomeScreen()}>
						All Patterns
					</button>				    
				</div>
			)
	}
}
export default HomeScreen

