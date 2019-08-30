import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./homeScreen.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import Demo from './demo'
import history from './history';
import downArrow from './images/down-arrow.svg'
import bitcoinIcon from './images/bitcoin.png'

@observer
						//<div className = 'statsLabel'>Users </div>{store.userCount}
						//<div className = 'statsLabel'>Patterns</div>{store.patternCount}
						//<div className = 'statsLabel'>Catches</div>{store.totalCatchCount}
class HomeScreen extends Component {
	state ={
		
	}
	componentDidMount(){
		store.getTrickOfTheDay()
	}
	clickPatternList=()=>{
		utilities.openPage('tricklist',true)
		utilities.sendGA('home screen','pattern list')	
	}
	openDetail=()=>{
		utilities.openPage('detail/'+store.randomLeaderboardTrick.key, true)
		utilities.sendGA('home screen','trickOfDay detail')
		store.increaseViewsCounter()
	}		
	render (){
    const backButton = <img id="backButton" 
                            src={downArrow} 
                            className="backButtonHome rotatedNegative90" 
                            alt="backIcon" 
                            onClick={()=>{ uiStore.handleBackButtonClick()}}
                        />
    let donationSection = <div className="donationSection">
							<label><b>Donations:</b></label>
							<div>
								<img className="bitcoinIcon"
									src={bitcoinIcon}/>
								<span>Bitcoin:</span>
			                    <a className ="donationLink"
			                    	href="bitcoin:1842rusLXbYZqraHyoJsHtaSsTxYqQuBtd">
			                    		1842rusLXbYZqraHyoJsHtaSsTxYqQuBtd
			                    </a>
							</div>
						</div>	
		return(
				<div className = "homeOuterDiv">					
					<div className ='homeScreenHeaderOuterDiv'>
						<h2 className='homeWelcomeHeader'>Welcome To Juggledex</h2>
						<label className='homeWelcomeHeaderPatternCount'>
							{store.patternCount} patterns and counting
						</label>
				    </div>
				    {store.randomLeaderboardTrick && Object.keys(store.library).length > 0 ? 
							<div className = 'homeScreenTrickDiv'>
								<h3 className = 'homeScreenHeader' style={{marginBottom: "10px"}}>Pattern of The Day</h3>
			        
					           	<div className = "homeTrickName" onClick = {this.openDetail}>
						           	{store.randomLeaderboardTrick.key} 
						        </div>
				            	<Demo 
					            	trickKey={store.randomLeaderboardTrick.key}
		                         	demoLocation="home"
		  						/>

					        </div>
						: null
					}
					<button className = "patternListButton"
							onClick={this.clickPatternList}>
						Pattern List
					</button>
					{donationSection}			    
				</div>
			)
	}
}
export default HomeScreen

