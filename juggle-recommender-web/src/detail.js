import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import deleteTrickIcon from './images/deleteTrickIcon.svg'
import editCardIcon from './images/cardEditIcon.png'
import closeIcon from './images/closeIcon.jpg'
import catchesIcon from './images/catchesIcon.png'
import babyIcon from './images/babyIcon.png'
import ninjaIcon from './images/ninjaIcon2.png'
import Demo from './demo'
import authStore from "./stores/authStore"
import TrickList from './trickList.js'
import './App.css';
import './detail.css';
import history from "./history"
import downArrow from './images/down-arrow.svg'
import shareIcon from './images/shareIcon.png'
const unlisten = history.listen((location, action) => {
  // location is an object like window.location

  console.log("listening" ,location.pathname, location.state, action);
});

@observer
class Detail extends Component {
  state = {
    catches : null,
    changingInput : false,
    showExtraGif : false,
  }
  componentDidMount(){
    console.log('details mounted',uiStore.detailTrick.id)

  }
  componentDidUpdate(){
    console.log("updated ", window.location.search)
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
  handleEditCatchButtonClick=()=>{
    let catches = "0"
    if (store.myTricks[uiStore.detailTrick.id] &&
        store.myTricks[uiStore.detailTrick.id]['catches']){
      catches = store.myTricks[uiStore.detailTrick.id].catches
    }
    this.setState({catches:catches})
    uiStore.toggleCatchEdit(this.state.catches,uiStore.detailTrick.id)
    //focus after render
    setTimeout(function() {
      if (this.catchInput){
        this.catchInput.focus();
        this.catchInput.select();
      }
    }, 100);  
  }
  handleBabyButtonClick=()=>{
    console.log('babyClicked')
  }
  handleNinjaButtonClick=()=>{
    console.log('ninjaClicked')
  }
  handleBackButtonClick=()=>{
    console.log('backButtonClick')
    history.go(-1);
  }

  toggleShowMoreInformation=()=>{
    uiStore.toggleShowMoreInformation()
  }
  toggleShowExplanation=()=>{
    uiStore.toggleShowExplanation()
  }
  copyDetailUrl=()=>{
      const textField = document.createElement('textarea')
      const url = window.location.href 
      textField.innerText = url
      document.body.appendChild(textField)
      var range = document.createRange();  
      range.selectNode(textField);  
      window.getSelection().addRange(range);  
      textField.select()
      document.execCommand('copy')
      textField.remove()

      alert("Link for the details page copied to clipboard\n" + url)
    
  }
  toggleExtraGif=()=>{
    this.setState({showExtraGif: !this.state.showExtraGif})
  }

	render() {
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

    const catchesSection = 
      <div>
        <img className="catchesIconDetail" alt="" src ={catchesIcon}/>
        <label className="catchesLabel">Catches: </label>
        {uiStore.detailCatchEditable ?
          <input 
                ref={(input)=> {this.catchInput = input}}
                id = "catchInput"
                 type="number" 
                 onKeyPress = {(e)=>this.onCatchesKeyPress(e)}
                 onChange={this.onCatchesChange}
          /> :
          <span>{store.myTricks[detailTrickKey] && store.myTricks[detailTrickKey].catches? 
                store.myTricks[detailTrickKey].catches:"0"}
          </span>
        }
        <img id="editCatchButton" src={editIcon} className="editCatchIcon" alt="toggleCatchEdit" 
             onClick={()=>{ this.handleEditCatchButtonClick()}}
        />
      </div>
    const backButton = <img id="backButton" 
                            src={downArrow} 
                            className="backButton rotatedNegative90" 
                            alt="backIcon" 
                            onClick={()=>{ this.handleBackButtonClick()}}
                        />
 		const starTrickButton = uiStore.detailTrick && 
                            store.myTricks[uiStore.detailTrick.id] &&
                            store.myTricks[uiStore.detailTrick.id]['starred'] &&
                            store.myTricks[uiStore.detailTrick.id]['starred'] === 'true'  ? 
              		<button className="addAndRemoveMyTricksButtonOnDetail" onClick={()=>{store.unstarTrick(uiStore.detailTrick.id)}}>&#9733;</button> :
 		              <button className="addAndRemoveMyTricksButtonOnDetail" onClick={()=>{store.starTrick(uiStore.detailTrick.id)}}>&#9734;</button>
    const babyFlairButton = <img id="babyButton" 
                                  src={babyIcon} 
                                  className="babyIcon" 
                                  alt="babyIcon" 
                                  onClick={()=>{ this.handleBabyButtonClick()}}
                              />
    const ninjaFlairButton = <img id="ninjaButton" 
                                  src={ninjaIcon} 
                                  className="ninjaIcon" 
                                  alt="ninjaIcon" 
                                  onClick={()=>{ this.handleNinjaButtonClick()}}
                              />
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
    const shareButton = <img 
                           className="shareFilterButton"
                           src={shareIcon}
                           onClick={()=>this.copyDetailUrl()}
                           alt=""
                           title="share your contributed tricks"
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
    const extraGifSection = detailTrick.video && detailTrick.gifUrl ?
                            <div className = {detailTrick.gifUrl.includes("jugglinglab") ? 
                              "extraGifSectionLab" : "extraGifSectionLibrary"}>
                              <label onClick={()=>{this.toggleExtraGif()}}
                                      className="toggleExtraGifLabel">
                                {this.state.showExtraGif? "hide gif" : "show gif" }
                              </label>
                              {this.state.showExtraGif ? 
                                <Demo 
                                  trickKey = {uiStore.detailTrick.id}
                                  demoLocation="detailExtraGif"
                                />:null
                              }
                            </div>:null
    const infoSection = uiStore.detailTrick && detailTrickKey ?
                          <div className="detailInfoDiv">
                          <div className="flairDiv">
                            {starTrickButton}
                            {babyFlairButton}
                            {ninjaFlairButton}
                          </div>
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
              tricksToList = {detailTrick.prereqs}
              listType = "prereqs"
            /> 
          </div> : null}
          {detailTrick.related ?
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Related</h3>
            <TrickList 
              tricksToList = {detailTrick.related}
              listType = "related"
            />
          </div> : null}
          {detailTrick.dependents ?
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Postreqs</h3>
            <TrickList 
              tricksToList = {detailTrick.dependents}
              listType = "postreqs"
            />
          </div> : null}
        </div> : null
        

		return(      

      			<div className="detailDiv" id="detailDiv">
              <div className="topButtons">
                {backButton}
                {shareButton}
                {deleteTrickButton}
                {editTrickButton}
              </div>
              <h3 className="detailHeader">{detailTrick.name}</h3>  
              <Demo 
                trickKey = {uiStore.detailTrick.id}
                demoLocation="detail"
              />
              {extraGifSection}
              {infoSection}
              {relationshipLists}                
            </div> 
          )
    }
  }

export default Detail