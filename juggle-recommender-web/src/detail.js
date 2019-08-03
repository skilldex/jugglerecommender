import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import deleteTrickIcon from './images/deleteTrickIcon.svg'
import editCardIcon from './images/cardEditIcon.png'
import closeIcon from './images/closeIcon.jpg'
import catchesIcon from './images/catchesIcon.svg'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'
import Demo from './demo'
import authStore from "./stores/authStore"
import TrickList from './trickList.js'
import './App.css';
import './detail.css';
import history from "./history"
import downArrow from './images/down-arrow.svg'
import shareIcon from './images/shareIcon.png'
import Comments from "./comments"
@observer
class Detail extends Component {
  state = {
    catches : null,
    changingInput : false,
    showExtraGif : false,
    firstComment : ""
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
      //this.outerDiv.focus()   
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
  handleDetailDivClick=(evt)=>{
      const inputElement = document.getElementById("catchInput");
      const buttonElement = document.getElementById("editCatchButton");
      const targetElement = evt.target;

      if (uiStore.detailCatchEditable && targetElement !== inputElement && targetElement !== buttonElement
        ){
        uiStore.toggleCatchEdit(this.state.catches, uiStore.detailTrick.id)
      }
  }
  postFirstComment=()=>{
      let commentPost = {
        comment: this.state.firstComment,
        date: Date(),
        parentPost: true,
        user:authStore.user.username,
        previousKeys : "",
        trickId : uiStore.detailTrick.id

      };
      let that = this
      store.createComment(commentPost).then(data => {
        this.setState({firstComment : ""})
      }, error => {
      });
      
  }
    autoGrow=(element)=>{
      element.style.height = "5px";
      element.style.height = (element.scrollHeight)+"px";
  }
	render() {   
    const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
    const detailTrick = store.library[detailTrickKey]
    if (detailTrickKey && !detailTrick){
        alert("Sorry, this pattern has been deleted or renamed.")
        uiStore.setDetailTrick(null)
        uiStore.handleBackButtonClick()
    }

    const catchesSection = 
      <div>
        <label className="detailLabel">Catches </label>
        <img className= {store.myTricks[detailTrickKey] && 
                          parseInt(store.myTricks[detailTrickKey].catches,10)>0?
                        "catchesIconDetailSmall selectedFlair" :  "catchesIconDetailSmall"}
              alt="" 
              src ={catchesIcon}
        />
        {uiStore.detailCatchEditable ?
          <input 
                className="catchesInput"
                ref={(input)=> {this.catchInput = input}}
                id = "catchInput"
                 type="number" 
                 onKeyPress = {(e)=>this.onCatchesKeyPress(e)}
                 onChange={this.onCatchesChange}
          /> :
          <span className="catchesInput">{store.myTricks[detailTrickKey] && store.myTricks[detailTrickKey].catches? 
                store.myTricks[detailTrickKey].catches:"0"}
          </span>
        }
        <img id="editCatchButton"
              src={editIcon} 
              className="editCatchIcon" 
              alt="toggleCatchEdit" 
             onClick={()=>{ this.handleEditCatchButtonClick()}}
        />
      </div>
    const backButton = <img id="backButton" 
                            src={downArrow} 
                            className="backButtonDetails rotatedNegative90" 
                            alt="backIcon" 
                            onClick={()=>{ uiStore.handleBackButtonClick()}}
                        />
    const backLabel = <label className="backButtonLabelDetails" 
                            onClick={()=>{uiStore.handleBackButtonClick()}}>Back
                      </label>                    
    let hasStarFlair = false
    let hasBabyFlair = false
    let hasNinjaFlair = false
    if (uiStore.detailTrick && 
        store.myTricks[uiStore.detailTrick.id]){
      if (store.myTricks[uiStore.detailTrick.id]['starred'] &&
          store.myTricks[uiStore.detailTrick.id]['starred'] === 'true'){
        hasStarFlair = true;
      }if (store.myTricks[uiStore.detailTrick.id]['baby'] &&
          store.myTricks[uiStore.detailTrick.id]['baby'] === 'true'){
          hasBabyFlair = true;
      }if (store.myTricks[uiStore.detailTrick.id]['ninja'] &&
          store.myTricks[uiStore.detailTrick.id]['ninja'] === 'true'){
          hasNinjaFlair = true;
      }
    } 
 		const starTrickButton = <img id="starButton" 
                                  src={starIcon} 
                                  className={hasStarFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="starIcon" 
                                  onClick={()=>{store.toggleFlair(uiStore.detailTrick.id, 'starred')}}
                              />
    const babyFlairButton = <img id="babyButton" 
                                  src={babyIcon} 
                                  className={hasBabyFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="babyIcon" 
                                  onClick={()=>{store.toggleFlair(uiStore.detailTrick.id, 'baby')}}
                              />
    const ninjaFlairButton = <img id="ninjaButton" 
                                  src={ninjaIcon} 
                                  className={hasNinjaFlair?"flairIcon selectedFlair":"flairIcon" } 
                                  alt="ninjaIcon" 
                                  onClick={()=>{store.toggleFlair(uiStore.detailTrick.id, 'ninja')}}
                              />
    const catchesFlairIcon = <img className= {store.myTricks[detailTrickKey] && 
                                              parseInt(store.myTricks[detailTrickKey].catches,10)>0?
                                            "catchesIconDetailLarge selectedFlair" :  "catchesIconDetailLarge"}
                                  alt="" 
                                  src ={catchesIcon}
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
                           className="shareFilterDetailButton"
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
                            <label className="detailLabel">Flair </label>
                            {starTrickButton}
                            {babyFlairButton}
                            {ninjaFlairButton}
                            {catchesFlairIcon}
                          </div>
                            {catchesSection}
                            <label className="detailLabel">Contributor </label>
                            {
                              detailTrick.contributor ? 
                              detailTrick.contributor : <a target="_" href='http://libraryOfJuggling.com'>Library Of Juggling</a>
                            }<br/>
                            {uiStore.showMoreInformation?
                              <div className="moreInfoDiv">                   
                                <label className="detailLabel">Difficulty </label>{detailTrick.difficulty} / 10<br/>
                                <label className="detailLabel"># of Balls </label>{detailTrick.num}<br/>
                                {detailTrick.siteswap ? 
                                  <div>
                                    <label className="detailLabel">Siteswap: </label>{detailTrick.siteswap}<br/>
                                  </div> : null
                                }
                                {detailTrick && detailTrick.url ?
                                  <label className="detailLabel">Tutorial </label> : null
                                }
                                {detailTrick && detailTrick.url ?
                                  <a target="_" href={detailTrick.url}>{tutorialSite}</a> : null
                                } 
                                {detailTrick && detailTrick.explanation?
                                  <div className="explanationSection">
                                    <label className="detailLabel">Explanation:</label>
                                    <label className="showExplanation" 
                                            onClick={()=>this.toggleShowExplanation()}>
                                      {uiStore.showExplanation?"hide":"show"}
                                    </label> <br/>
                                    {uiStore.showExplanation?<label className="explanation">{detailTrick.explanation}</label>:null}
                                  </div> : null
                                }
                                
                                {detailTrick && detailTrick.tags?
                                  <div>
                                    <label className="detailLabel">Tags</label><br/>
                                    <div className="detailTags">{tags}</div>
                                  </div> : null
                                }
                                
                              </div>:null
                            }
                            <div className="moreInfoLabelDiv">
                              <label className="moreInfoLabel" 
                                      onClick={()=>this.toggleShowMoreInformation()}>
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

      			<div className="detailDiv" 
                  id="detailDiv" 
                  onClick={this.handleDetailDivClick}>
              <div className="topButtons">
                {backButton}
                {backLabel}
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
              <div className="commentsContainer">
                <h3>Discussion</h3>
                { authStore.user ? 
                     <div class="firstCommentContainer">
                      <span className="firstCommentIcon">{authStore.user.username}</span>
                      <textarea 
                        onKeyUp={(e)=>this.autoGrow(e.target)}
                        value={this.state.firstComment} 
                        onChange={(e)=>{
                          this.setState({firstComment : e.target.value})
                        }} 
                        className="firstComment" 
                        type="submit" 
                        placeholder="Write a comment..." 
                        onBlur={(e)=>{e.target.placeholder = 'Write a comment...' }}
                        onFocus={(e)=>{e.target.placeholder = '' }}
                        type="text" 
                      ></textarea>
                      <button className="submitButton" onClick={this.postFirstComment}>Submit</button>
                    </div> :             
                    <div>No comments yet...</div>
                }
                <div className="showCommentsLabelDiv">
                  <label className="showCommentsButton" 
                          onClick={()=>{uiStore.toggleShowCommentsSection()}}>
                    {uiStore.showCommentsSection?"Hide Comments":"Show Comments"}
                  </label>
                </div>
                {uiStore.showCommentsSection?
                  <Comments comments={store.currentComments}></Comments>
                  :null
                }
              </div>
              {relationshipLists}                
            </div> 
          )
    }
  }
/*

                              */
export default Detail