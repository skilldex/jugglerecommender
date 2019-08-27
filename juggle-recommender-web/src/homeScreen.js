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
import history from './history';
import downArrow from './images/down-arrow.svg'
import bitcoinIcon from './images/bitcoin.png'

@observer
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
	donationSection = null
		return(
				<div className = "homeOuterDiv">					
					<div className ='homeScreenTrickOuterDiv'>
						<div className = 'statsLabel'>Users </div>{store.userCount}
						<div className = 'statsLabel'>Patterns</div>{store.patternCount}
						<div className = 'statsLabel'>Catches</div>{store.totalCatchCount}
				    </div>
				    {store.randomLeaderboardTrick && Object.keys(store.library).length > 0 ? 
							<div className = 'homeScreenTrickDiv'>
					            <h3 style={{marginBottom: "10px"}}>Pattern of The Day</h3>
					            <button className="detailButton" onClick = {this.openDetail}>View Details</button>
				            	<Demo 
					            	trickKey={store.randomLeaderboardTrick.key}
		                         	demoLocation="home"
		  						/>
		  						<div className = "info">
						           	<span className='infoLabel'>Pattern</span> 
						           	{store.randomLeaderboardTrick.key} 
						        </div>
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

