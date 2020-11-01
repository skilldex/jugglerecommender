import React,{Component} from 'react'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import store from './stores/store'
import uiStore from './stores/uiStore'
import {DebounceInput} from 'react-debounce-input';
import filterStore from './stores/filterStore'


@observer
class Filter extends Component {
 	state = {

  	}

									         
									          
	onDifficultyRangeChange=(range)=>{
		filterStore.setDifficultyRange(range)
		uiStore.updateRootTricks()
	}



	render() {
	 	const ColoredLine = ()=>(
			   <hr
			        style={{
			            color: 'lightgray',
			            backgroundColor: 'lightgray',
			            height: 1
			        }}
			   />				
		 )


		// const hasTutorialSection = 	 
		// 					<div>
		// 						<div>
		// 							<h3 className="filterHeader">Has a tutorial</h3>
		// 						</div>
		// 						<button className={filterStore.hasTutorialSelected?
		// 							'filterHasTutorial filterHasTutorialSelected':'filterHasTutorial'}
		// 						key='hasTutorialButton' 
		// 						onClick={()=>{filterStore.toggleHasTutorialSelected()}}></button>
		// 					</div>

		return (
			<div className="outerFilterDiv">
	        	<div className="filterDiv">
	        		<div className="headerButtons">
			            <img id="backButton" 
			            	 src={downArrow} 
			            	 className="backButtonFilter rotatedNegative90" 
			            	 alt="backIcon" 
		             		 onClick={()=>{uiStore.toggleFilterDiv()}}/>
		             	<label className="backButtonLabel" 
		             		   onClick={()=>{uiStore.toggleFilterDiv()}}>Back
		             	</label>
		            </div>
					<ColoredLine/>
					<label className="filterSubmitButton" 
		             	   onClick={()=>{uiStore.toggleFilterDiv()}}>Submit
		            </label>
				</div>
			</div>
		)
	  }
	}

export default Filter



















