import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import deleteTrickIcon from './images/deleteTrickIcon.svg'
import editCardIcon from './images/cardEditIcon.png'
import closeIcon from './images/closeIcon.jpg'
import Demo from './demo'
import authStore from "./stores/authStore"
import TrickList from './trickList.js'
import './App.css';
import './detail.css';

@observer
class Detail extends Component {
  state = {
    catches : null,
    changingInput : false,
  }

	onCatchesChange=(e)=>{
	 	const re = /^[0-9\b]+$/;
	  	if (e.target.value === '' || re.test(e.target.value)) {
	       const catches = e.target.value
         this.setState({catches})
  	  }

	}
  onCatchesKeyPress=(target)=> {
    // If enter pressed
    if(target.charCode===13){  
      uiStore.toggleCatchEdit(this.state.catches, uiStore.detailTrick.id)
      //set focus back to outer div
      this.outerDiv.focus()   
    }
  }
  seeExplanation=(trickKey)=>{
    if(!uiStore.detailTimer){
        window.open(store.library[trickKey].url)
    }
  }
  addToMyTricks=()=>{
    this.setState({"catches":0})
    store.addToMyTricks(uiStore.detailTrick.id)
  }
  handleEditCatchButtonClick=()=>{
    this.setState({catches:store.myTricks[uiStore.detailTrick.id].catches})
    uiStore.toggleCatchEdit(this.state.catches,uiStore.detailTrick.id)
    //focus after render
    setTimeout(function() {
      if (this.catchInput){
        this.catchInput.focus();
        this.catchInput.select();
      }
    }, 100);  
  }
  onMouseEnter=(event)=>{
    uiStore.setMouseInDetailDiv(true)
  }

  onMouseLeave=(event)=>{
    uiStore.setMouseInDetailDiv(false)
  }
  toggleShowMoreInformation=()=>{
    uiStore.toggleShowMoreInformation()
  }
  toggleShowExplanation=()=>{
    uiStore.toggleShowExplanation()
  }

	render() {

//    document.body.style.overflow = 'hidden'
    //set focus for outer div for onblur closing
    if(this.outerDiv){this.outerDiv.focus()}
    //set focus to compensate for onblur function
    if(this.catchInput){this.catchInput.focus()}
    document.addEventListener("click", (evt) => {
      const inputElement = document.getElementById("catchInput");
      const buttonElement = document.getElementById("editCatchButton");
      let targetElement = evt.target;
      do {
        if (targetElement === inputElement || targetElement === buttonElement) {
          return;
        }
        targetElement = targetElement.parentNode;
      } while (targetElement);
      if (uiStore.detailCatchEditable){
        uiStore.toggleCatchEdit(this.state.catches, uiStore.detailTrick.id)
      }
    });
   
    const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
    const detailTrick = store.library[detailTrickKey]
    if (detailTrickKey && !detailTrick){
        alert("Sorry, this pattern has been deleted or renamed.")
        uiStore.setDetailTrick(null)
    }
    const catchesSection = store.myTricks[detailTrickKey] ?
    <div>
      <label className="detailLabel">Catches: </label>
      {uiStore.detailCatchEditable ?
        <input 
              ref={(input)=> {this.catchInput = input}}
              id = "catchInput"
               type="number" 
               onKeyPress = {(e)=>this.onCatchesKeyPress(e)}
               onChange={this.onCatchesChange}
        /> :
        <span>{store.myTricks[detailTrickKey].catches}</span>
      }
      <img id="editCatchButton" src={editIcon} className="editCatchIcon" alt="toggleCatchEdit" 
           onClick={()=>{ this.handleEditCatchButtonClick()}}
      />
    </div> : null
 		const addToMyTricksButton = uiStore.detailTrick && store.myTricks[uiStore.detailTrick.id] ? 
              		<button className="addAndRemoveMyTricksButtonOnDetail" onClick={()=>{store.removeFromMyTricks(uiStore.detailTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButtonOnDetail" onClick={this.addToMyTricks}>&#9734;</button>
    const deleteTrickButton = 
      detailTrick && authStore.user && 
      (detailTrick.contributor === authStore.user.username || 
      authStore.user.username === "tjthejuggler") ?
        <img id="deleteTrickButton" 
              src={deleteTrickIcon} 
              className="deleteTrickIcon" 
              alt="deleteTrick" 
             onClick={()=>{store.deleteTrick()}}
        /> : null      
    const editTrickButton  = 
      detailTrick && authStore.user && 
      (detailTrick.contributor === authStore.user.username || 
      authStore.user.username === "tjthejuggler") ? 
        <img id="editCardButton" src={editCardIcon} className="editCardIcon" alt="toggleCardEdit" 
             onClick={()=>{uiStore.editDetailTrick()}}
        /> : null
    const closeButton  = 
        <img id="closeButton" src={closeIcon} className="closeDetailIcon" alt="closeIcon" 
             onClick={()=>{uiStore.setDetailTrick(null)}}
        />

    const tags =  detailTrick && detailTrick.tags ? detailTrick.tags.sort().map((tag,i)=>{
                    if(i < detailTrick.tags.length-1){
                      return <span className="detailTag">{tag + ","}</span>
                    }else{
                      return <span className="detailTag">{tag}</span>
                    }
                  }) : null
    const related =  detailTrick && detailTrick.related ? detailTrick.related.sort().map((tag,i)=>{
                    if(i < detailTrick.related.length-1){
                      return <span className="detailTag">{tag + ","}</span>
                    }else{
                      return <span className="detailTag">{tag}</span>
                    }
                  }) : null
    let tutorialSite
    //TODO could be replaced with regex that gets everything between first two .s
    if (detailTrick && detailTrick.url && detailTrick.url.includes('.')){
      tutorialSite = detailTrick.url.split('.')[1]
      if (tutorialSite.includes('.')){
        tutorialSite = tutorialSite.split('.')[0]
      }
    }
    const infoSection = uiStore.detailTrick && detailTrickKey ?
                          <div className="detailInfoDiv">
                            
                            {catchesSection}
                            <label className="detailLabel">Contributor: </label>
                            {
                              detailTrick.contributor ? 
                              detailTrick.contributor : <a target="_" href='http://libraryOfJuggling.com'>Library Of Juggling</a>
                            }<br/>
                            {uiStore.showMoreInformation?
                              <div className="moreInfoDiv">                   
                                <label className="detailLabel">Difficulty: </label>{detailTrick.difficulty} / 10<br/>
                                <label className="detailLabel"># of Balls: </label>{detailTrick.num}<br/>
                                {detailTrick.siteswap ? 
                                  <div>
                                    <label className="detailLabel">Siteswap: </label>{detailTrick.siteswap}<br/>
                                  </div> : null
                                }
                                {detailTrick && detailTrick.url ?
                                  <label className="detailLabel">Tutorial: </label> : null
                                }
                                {detailTrick && detailTrick.url ?
                                  <a target="_" href={detailTrick.url}>{tutorialSite}</a> : null
                                } 
                                {detailTrick && detailTrick.explanation?
                                  <div className="explanationSection">
                                    <label className="detailLabel">Explanation:</label>
                                    <label className="showExplanation" onClick={()=>this.toggleShowExplanation()}>
                                      {uiStore.showExplanation?"hide":"show"}
                                    </label> <br/>
                                    {uiStore.showExplanation?<label className="explanation">{detailTrick.explanation}</label>:null}
                                  </div> : null
                                }
                                
                                {detailTrick && detailTrick.tags?
                                  <div>
                                    <label className="detailLabel">Tags:</label><br/>
                                    <div className="detailTags">{tags}</div>
                                  </div> : null
                                }
                                
                              </div>:null
                            }
                            <div className="moreInfoLabelDiv">
                              <label className="moreInfoLabel" onClick={()=>this.toggleShowMoreInformation()}>
                                {uiStore.showMoreInformation?"less info":"more info"}
                              </label><br/>
                            </div>
                          </div>:null

    const relationshipLists = 
        detailTrick?
        <div className ='relationshipLists'>
          {detailTrick.prereqs ?
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Prereqs</h3>
            <TrickList 
              tricksToList = {detailTrick.prereqs.sort()}
              selectedTrick={uiStore.selectedTrick}
            /> 
          </div> : null}
          {detailTrick.related ?
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Related</h3>
            <TrickList 
              tricksToList = {detailTrick.related.sort()}
              selectedTrick={uiStore.selectedTrick}
            />
          </div> : null}
          {detailTrick.dependents ?
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Postreqs</h3>
            <TrickList 
              tricksToList = {detailTrick.dependents.sort()}
              selectedTrick={uiStore.selectedTrick}
            />
          </div> : null}
        </div> : null
        

    const detailCard = uiStore.detailTrick && detailTrickKey ? 
          			    <div className="detailDiv" id="detailDiv">
                      <div className="topButtons">
                        {addToMyTricksButton}
                        {deleteTrickButton}
                        {editTrickButton}
                        {closeButton}
                      </div>
                      <h3 className="detailHeader">{detailTrick.name}</h3>  
                      <Demo 
                        trickKey = {uiStore.detailTrick.id}
                        demoLocation="detail"
                      />
                      {infoSection}
                      {relationshipLists}                
                    </div> : null
		return(      

      			<div id="detailOuterDiv"
                 onMouseEnter={this.onMouseEnter} 
                 onMouseLeave={this.onMouseLeave}
                 onBlur={this.onBlur} 
                 ref={(div)=> {this.outerDiv = div}}  
                 tabIndex="0">
              {detailCard}
      			</div>
          )
    }
  }

export default Detail