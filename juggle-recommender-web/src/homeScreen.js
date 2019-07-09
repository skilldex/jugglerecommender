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
		if (!store.randomLeaderboardTrick.trick) {store.chooseRandomLeaderboardTrick()}
		return(
				<div className = "outerDiv">
					<div><b>Jugglers Registered:</b> {store.userCount}</div>
					<div><b>Patterns Submitted:</b> {store.patternCount}</div>
					<div><b>Catches Counted:</b> {store.totalCatchCount}</div>
					<div onClick={()=>uiStore.toggleShowHomeScreen()}>GO TO LIST</div>
					<div className ='homeScreenTrickOuterDiv'>
						<h3 className = 'homeScreenTrickMainLabel'>Featured Patterns</h3>
						<div className = 'homeScreenTrickDiv'>
				            <h3 className = 'homeScreenTrickSubLabel'>Random Challenge Pattern</h3>
				           	<div>Current Leader: {store.randomLeaderboardTrick.user} ({store.randomLeaderboardTrick.catches} catches)</div>
				            <TrickList 
				              tricksToList = {[store.randomLeaderboardTrick.trick]}
				              selectedTrick={uiStore.selectedTrick}
				            />
				        </div>
						<div className = 'homeScreenTrickDiv'>
				            <h3 className = 'homeScreenTrickSubLabel'>Newest Pattern</h3>
				            <TrickList 
				              tricksToList = {[store.getMostRecentlySubmittedTrick()]}
				              selectedTrick={uiStore.selectedTrick}
				            />
				        </div>
				    </div>

				</div>
			)
	}
}
export default HomeScreen

