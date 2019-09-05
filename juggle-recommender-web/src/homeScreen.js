import React, {Component} from 'react';
import "./homeScreen.css"
import { observer } from "mobx-react"
//import { toJS } from "mobx"
import store from "./stores/store"
import utilities from './utilities'
import Demo from './demo'
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
    const donationSection = <div className="donationSection">
							<label><b>Donations:</b></label>
							<div>
								<img className="bitcoinIcon"
									alt=''
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
						{store.patternCount ?
							<label className='homeWelcomeHeaderPatternCount'>
								{store.patternCount} patterns and counting
							</label> 
							: null
						}
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

