import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./homeScreen.css"
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'

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
					<div>Name: {store.randomLeaderboardTrick.trick}</div>
					<div>User: {store.randomLeaderboardTrick.user}</div>	
					<div>Catches: {store.randomLeaderboardTrick.catches}</div>
					<div onClick={()=>uiStore.toggleShowHomeScreen()}>GO TO LIST</div>
				</div>
			)
	}
}
export default HomeScreen

