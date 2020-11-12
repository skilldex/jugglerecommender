import React,{Component} from 'react'
import { observer } from "mobx-react"
import downArrow from './images/down-arrow.svg'
import store from './stores/store'
import uiStore from './stores/uiStore'
import {DebounceInput} from 'react-debounce-input';
import addPlaylistStore from './stores/addPlaylistStore'
import './addplaylist.css';
import addToSpecificPlaylist from './images/addToSpecificPlaylist.png'


@observer
class Filter extends Component {
 	state = {
 		newPlaylistInputText : ''
  	}

									         
									          


	addCurrentPatternToPlaylist=(playlist)=>{
		console.log('add to playlist '+playlist)
	}


	render() {

 	    const addToSpecificPlaylistButton = <img 
                       className="addToSpecificPlaylistButton"
                       src={addToSpecificPlaylist}
                       onClick={()=>{uiStore.setShowAddPlaylistDiv(true)}}
                       alt=""
                       title="add this pattern to a playlist"
                    />

	 	const newPlaylistInputSection =
	 		<div>
				<input 	id ="newPlaylistInput"
						autoComplete="off"
						className="newPlaylistInput" 
						value={this.state.newPlaylistInputText} 
				/>
			</div>

		let listOfPlaylists = []
		if(addPlaylistStore.usersPlaylists.length>0){
		        addPlaylistStore.usersPlaylists.forEach((playlist)=>{
		        	listOfPlaylists.push(
		                <div className="addedRelatedTricksDiv"
		                		  key = {"addToPlaylist" + {playlist}}
		                >
		                  <span className="mainTagsName"
		                        onClick={()=>{this.addCurrentPatternToPlaylist(playlist)}}>{playlist}</span>
		                </div>  						        		
		        	)
		        });
		    }

		
		const individualPlaylistItemSection = null

		//const listOfPlaylists = null

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
	        		<div className="addPlaylistHeaderButtons">
			            <img id="backButton" 
			            	 src={downArrow} 
			            	 className="backButtonFilter rotatedNegative90" 
			            	 alt="backIcon" 
		             		 onClick={()=>{uiStore.toggleAddPlaylistsDiv()}}/>
		             	<label className="backButtonLabel" 
		             		   onClick={()=>{uiStore.toggleAddPlaylistsDiv()}}>Back
		             	</label>
		            </div>
		            <h3 className="addPlaylistHeader">Add to Playlist</h3>              
		            {newPlaylistInputSection}
		            {listOfPlaylists}
				</div>
			</div>
		)
	  }
	}

export default Filter



















