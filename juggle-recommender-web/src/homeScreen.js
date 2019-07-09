import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./homeScreen.css"
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'

@observer
class HomeScreen extends Component {
	state = {

	}

	componentDidMount=()=>{

	}


	render (){
		console.log('store.randomLeaderboardTrick',store.randomLeaderboardTrick)
		if (!store.randomLeaderboardTrick.trick) {store.chooseRandomLeaderboardTrick()}
		return(
				<div className = "outerDiv">
					<div>Random trick from leaderboard:</div>
					<div>Jugglers Registered: {store.userCount}</div>
					<div>Patterns Submitted: {store.patternCount}</div>
					<div>Catches Counted: {store.totalCatchCount}</div>
					<div onClick={()=>uiStore.toggleShowHomeScreen()}>GO TO LIST</div>
					<div className ='homeScreenTrickOuterDiv'>
						<div className = 'homeScreenTrickDiv'>
				            <h3 className = 'homeScreenTrickLabel'>Random Challenge Pattern</h3>
				           	<div>Current Leader: {store.randomLeaderboardTrick.user} ({store.randomLeaderboardTrick.catches} catches)</div>
				            <TrickList 
				              tricksToList = {[store.randomLeaderboardTrick.trick]}
				              selectedTrick={uiStore.selectedTrick}
				            />
				        </div>
				    </div>

				</div>
			)
	}
}
export default HomeScreen

