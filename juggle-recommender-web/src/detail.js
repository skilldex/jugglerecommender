import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
import uiStore from './stores/uiStore'
import { observer } from "mobx-react"
import editIcon from './images/editIcon.png'
import deleteTrickIcon from './images/deleteTrickIcon.svg'
import editCardIcon from './images/cardEditIcon.png'
import catchesIcon from './images/catchesIcon.svg'
import babyIcon from './images/babyIcon.svg'
import ninjaIcon from './images/ninjaIcon.svg'
import starIcon from './images/starIcon.svg'
import Demo from './demo'
import authStore from "./stores/authStore"
import TrickList from './trickList.js'
import SmallTrickList from './smallTrickList'
import './App.css';
import './detail.css';
import downArrow from './images/down-arrow.svg'
import shareIcon from './images/shareIcon.png'
import playlistIcon from './images/playlistIcon.png'
import Comments from "./comments"
import utilities from "./utilities"
@observer
class Detail extends Component {
  state = {
    catches : null,
    changingInput : false,
    showExtraGif : false,
    firstComment : "",
  }
  componentDidUpdate(prevProps, prevState){
    if (prevProps.trick && this.props.trick.id !== prevProps.trick.id){
      this.setState({firstComment : ""})
      let textarea = document.getElementById('mainCommentTextArea');  
      if(textarea){
        textarea.setAttribute('style','');
      }
    }
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
      uiStore.toggleCatchEdit(this.state.catches, this.props.trick.id)
      //set focus back to outer div
      //this.outerDiv.focus()   
    }
  }
  handleEditCatchButtonClick=()=>{
    let catches = "0"
    if (store.myTricks[this.props.trick.id] &&
        store.myTricks[this.props.trick.id]['catches']){
      catches = store.myTricks[this.props.trick.id].catches
    }
    this.setState({catches:catches})
    uiStore.toggleCatchEdit(this.state.catches,this.props.trick.id)
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
      utilities.sendGA('detail','share')
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
        uiStore.toggleCatchEdit(this.state.catches, this.props.trick.id)
      }
  }

  postFirstComment=()=>{
      let commentPost = {
        comment: this.state.firstComment,
        date: Date(),
        parentPost: true,
        user:authStore.user.username,
        previousKeys : "",
        trickId : this.props.trick.id

      };
      store.createComment(commentPost).then(data => {
          this.setState({firstComment : ""})
          const contributor = store.library[this.props.trick.id].contributor
          if(authStore.user.username !== contributor && contributor){
            authStore.getEmailByUsername(contributor).then((email)=>{
              if(email){
                authStore.sendEmail({
                  "emailSubject": "Someone Commented on Your Pattern",
                  "emailText" : authStore.user.username + " commented on your pattern, " + 
                      this.props.trick.id + " click to see the thread: www.skilldex.org/detail/" +
                      this.props.trick.id.replace(/ /g,"%20").replace(/{/g,'%7B').replace(/}/g,'%7D') , 
                  "to" : email
                }) 
              }
            })
          }
         
        }, 
        error => {
      });

    //reset textArea height
    let textarea = document.getElementById('mainCommentTextArea');  
    textarea.setAttribute('style','');
    textarea.value = "";

    if (!uiStore.showCommentsSection){
      uiStore.toggleShowCommentsSection()
    }
    //this timer is because it takes a moment for the comment section to expand,
    //  and we want it's size after it expands
    this.detailTimer = setTimeout(()=>{
      const commentsContainer = document.getElementById('commentsContainer')
      const commentsContainerBottomPosition = commentsContainer.offsetTop+
                                              commentsContainer.offsetHeight
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
      if (document.documentElement.scrollTop + viewHeight < commentsContainerBottomPosition){
        window.scrollTo(0, commentsContainerBottomPosition - viewHeight+100)
      }
    }, 100)      
  }
 checkVisible(position) {
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(document.documentElement.scrollTop + viewHeight < position);
}

  trickPropertyClicked=(propertyType, property)=>{
    filterStore.resetAllFilters()
    if (propertyType === 'contributor'){
      filterStore.setTags('contributor',[property]);
    }else if (propertyType === 'ballNum'){
      filterStore.setNumBalls([property])      
    }else if (propertyType === 'tag'){
      filterStore.setTags('tags',[property]);      
    }else if (propertyType === 'siteswap'){
      filterStore.setSearchText("ss:"+property);
    }else if (propertyType === 'workedOn'){
      const value = property.split(' ')[0]
      const period = property.split(' ')[1].replace('s','')
      console.log('ca',value,period)
      filterStore.setWorkedOnPeriod(period)
      filterStore.setWorkedOnValue(value)
    }

    utilities.sendGA('details','tricklist via property')
    utilities.openPage('tricklist',true)
  }
  getKeysFromRelatedObject=(related)=>{
    const keysAndRelevance = Object.keys(related).map((key)=>{
      const numUpvoters = related[key].upvoters ? related[key].upvoters.length : 0
      const numDownvoters = related[key].downvoters ? related[key].downvoters.length : 0
      const relevance = numUpvoters - numDownvoters
      return [key,relevance]
    })
    let sortedKeysAndRelevance = keysAndRelevance.sort(function(a,b) {
        return a[1]-b[1]
    }).reverse()
    return sortedKeysAndRelevance.map((key)=>{
      return key[0]
    })
  }
  suggestRelationCancelClicked=()=>{
    uiStore.closeAllSuggestionLists()
  }
  suggestRelationClicked=(relation)=>{
    if(authStore.user){
      uiStore.closeAllSuggestionLists()
      uiStore.toggleSuggestingRelation(relation)
      uiStore.setSuggestedRelation(relation,null)
      setTimeout(()=>{
        if (relation === 'prereq'){
          if (this.suggestPrereqInput){
            this.suggestPrereqInput.focus()
          }
        }else if(relation === 'related'){
          if (this.suggestRelatedInput){
            this.suggestRelatedInput.focus()
          }
        }else if(relation === 'dependent'){
          if (this.suggestDependentInput){
            this.suggestDependentInput.focus()
          }
        }
      }, 100)
    }else{
      alert("Please login to make a suggestion")
    }
  }

  getSuggestedRelationSubmitDisabledMessage=(relation)=>{
    let suggestedRelationSubmitDisabledMessage = null
    let suggestedRelation = ''
    let relationProperty = ''

    if (relation === 'prereq'){
      suggestedRelation = uiStore.suggestedPrereq
      relationProperty = 'prereqs'
    }else if (relation === 'dependent'){
      suggestedRelation = uiStore.suggestedPostreq
      relationProperty = 'dependents'
    }else if (relation === 'related'){
      suggestedRelation = uiStore.suggestedRelated
      relationProperty = 'related'
    }

    if (!suggestedRelation){
      suggestedRelationSubmitDisabledMessage = 'Choose a '+relation+'.'
    }else{
      suggestedRelation = suggestedRelation.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-')
      if (!(suggestedRelation in store.library)){
        suggestedRelationSubmitDisabledMessage = 'Not in database.'
      }
      if (store.library[this.props.trick.id][relationProperty] && 
          suggestedRelation in store.library[this.props.trick.id][relationProperty]){
        suggestedRelationSubmitDisabledMessage = 'Already a '+relation+'.'
      }
      if (suggestedRelation === this.props.trick.id){
        suggestedRelationSubmitDisabledMessage = "Can't suggest it for itself."
      }   

    }
    return suggestedRelationSubmitDisabledMessage
  }

	render() {   
    const detailTrickKey = this.props.trick ? this.props.trick.id : ""
    const detailTrick = store.library[detailTrickKey]

    if (detailTrickKey && !detailTrick){
        alert("Sorry, this pattern has been deleted or renamed.")
        uiStore.setDetailTrick(null)
        uiStore.handleBackButtonClick()
        return null
    }
    const catchesSection = 
      <div>
        <label className="detailLabel">Your Catches </label>
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
             title="edit your catches"
        />
      </div>

    let dateLastWorkedOn = null
    let dateLastWorkedOnFilter = null
    if (store.myTricks[detailTrickKey] && 
        store.myTricks[detailTrickKey].lastUpdated){
        var date = new Date(store.myTricks[detailTrickKey].lastUpdated);
        dateLastWorkedOn = date.toLocaleDateString()
        dateLastWorkedOnFilter = utilities.getDateLastWorkedOnFilter(store.myTricks[detailTrickKey].lastUpdated)+" ago"
    }
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
    if (this.props.trick && 
        store.myTricks[this.props.trick.id]){
      if (store.myTricks[this.props.trick.id]['starred'] &&
          store.myTricks[this.props.trick.id]['starred'] === 'true'){
        hasStarFlair = true;
      }if (store.myTricks[this.props.trick.id]['baby'] &&
          store.myTricks[this.props.trick.id]['baby'] === 'true'){
          hasBabyFlair = true;
      }if (store.myTricks[this.props.trick.id]['ninja'] &&
          store.myTricks[this.props.trick.id]['ninja'] === 'true'){
          hasNinjaFlair = true;
      }
    } 
 		const starTrickButton = <img id="starButton"
                                  title="Star flair: Special list"
                                  src={starIcon} 
                                  className={hasStarFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="starIcon" 
                                  onClick={()=>{store.toggleFlair(this.props.trick.id, 'starred')}}
                              />
    const babyFlairButton = <img id="babyButton" 
                                  title="Baby flair: You're learning"
                                  src={babyIcon} 
                                  className={hasBabyFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="babyIcon" 
                                  onClick={()=>{store.toggleFlair(this.props.trick.id, 'baby')}}
                              />
    const ninjaFlairButton = <img id="ninjaButton"
                                  title="Ninja flair: You're experienced" 
                                  src={ninjaIcon} 
                                  className={hasNinjaFlair?"flairIcon selectedFlair":"flairIcon" } 
                                  alt="ninjaIcon" 
                                  onClick={()=>{store.toggleFlair(this.props.trick.id, 'ninja')}}
                              />
    const catchesFlairIcon = <img className= {store.myTricks[detailTrickKey] && 
                                              parseInt(store.myTricks[detailTrickKey].catches,10)>0?
                                            "catchesIconDetailLarge selectedFlair" :  "catchesIconDetailLarge"}
                                  alt="" 
                                  src ={catchesIcon}
                                  title="Catches flair: You've logged catches"
                            />
    const deleteTrickButton = 
      detailTrick && authStore.user && 
      (detailTrick.contributor === authStore.user.username || 
      store.editMods.includes(authStore.user.username)) ?
        <img id="deleteTrickButton" 
              src={deleteTrickIcon} 
              className="deleteTrickIcon" syntax options greyed out
              alt="deleteTrick" 
             onClick={()=>{store.deleteTrick()}}
             title="delete this pattern"
        /> : null      
    const editTrickButton  = 
      detailTrick && authStore.user && 
      (detailTrick.contributor === authStore.user.username || 
      store.editMods.includes(authStore.user.username)) ? 
        <img id="editCardButton" 
             src={editCardIcon} 
             className="editCardIcon" 
             alt="toggleCardEdit" 
             title="edit this pattern"
             onClick={()=>{uiStore.editDetailTrick()}}
        /> : null
    const shareButton = <img 
                           className="shareFilterDetailButton"
                           src={shareIcon}
                           onClick={()=>this.copyDetailUrl()}
                           alt=""
                           title="share this pattern"
                        />

    const playlistButton = <img 
                           className="playlistDetailButton"
                           src={playlistIcon}
                           onClick={()=>{uiStore.setShowAddPlaylistDiv(true)}}
                           alt=""
                           title="add this pattern to a playlist"
                        />

    const tags =  detailTrick && detailTrick.tags ? detailTrick.tags.sort().map((tag,i)=>{
                      return <div>
                              <label className= "clickableProperty"
                                     onClick = {()=>this.trickPropertyClicked('tag', tag)}>
                                {tag}
                              </label>
                               {i < detailTrick.tags.length-1 ?<span className="detailTag">,</span>:null}
                             </div>
                  }) : null

    const propType = detailTrick.tags && detailTrick.tags.includes("clubs") ? "Clubs" : "Balls"

    let tutorialSite
    if (detailTrick && detailTrick.url && detailTrick.url.includes('.')){
      if (detailTrick.url.includes('www')){
        tutorialSite = detailTrick.url.split('.')[1]
      }else{
        tutorialSite = detailTrick.url.split('.')[0]
      }
      if (tutorialSite.includes('.')){
        tutorialSite = tutorialSite.split('.')[0]
      }
      if (tutorialSite.includes('http')){
        tutorialSite = tutorialSite.split('//')[1]
      }
      if (tutorialSite.toLowerCase() === 'youtu'){
        tutorialSite = 'Youtube'
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
                                  trickKey = {this.props.trick.id}
                                  demoLocation="detailExtraGif"
                                />:null
                              }
                            </div>:null
    const infoSection = this.props.trick && detailTrickKey ?
                          <div className="detailInfoDiv">
                          <div className="viewsDiv">
                            <label className="detailLabel">Views </label>
                            {detailTrick.views ? Math.round(detailTrick.views) : 0}
                          </div>
                          <div className="usersWorkingOnDiv">
                            <label className="detailLabel">Users Practicing </label>
                            {detailTrick.usersWorkingOn ? detailTrick.usersWorkingOn : 0}
                          </div>
                            {catchesSection}
                          <div className="flairDiv">
                            <label className="detailLabel">Your Flair </label>
                            {starTrickButton}
                            {babyFlairButton}
                            {ninjaFlairButton}
                            {catchesFlairIcon}
                          </div>
                          {detailTrick.siteswap ? 
                            <div>
                              <label className="detailLabel">Siteswap </label>
                              <label>
                              {detailTrick.siteswap}
                              </label><br/>
                            </div> : null
                          }
                          {detailTrick && detailTrick.url ?
                            <div>
                              <label className="detailLabel">Tutorial </label>
                              <a target="_" href={detailTrick.url}>{tutorialSite}</a>
                            </div>
                            : null
                          } 
                            <label className="detailLabel">Contributor </label>
                            {
                              detailTrick.contributor ? 
                              <label className= "clickableProperty"
                                     onClick = {()=>this.trickPropertyClicked('contributor', detailTrick.contributor)}>
                                {detailTrick.contributor}
                              </label> : 
                              <a target="_" href='http://libraryOfJuggling.com'>Library Of Juggling</a>
                            }<br/>
                            {uiStore.showMoreInformation?
                              <div className="moreInfoDiv">                   
                                <label className="detailLabel">Difficulty </label>{detailTrick.difficulty} / 10<br/>
                                <label className="detailLabel"># of {propType} </label>
                                <label className= "clickableProperty"
                                     onClick = {()=>this.trickPropertyClicked('ballNum', detailTrick.num)}>
                                {detailTrick.num}
                                </label><br/>
                                {dateLastWorkedOn ? 
                                  <div>
                                    <label className="detailLabel">Last Worked On </label>
                                    <label className="unclickableProperty">
                                      {dateLastWorkedOn}
                                    </label>
                                    <label className= "clickableProperty"
                                            onClick = {()=>this.trickPropertyClicked('workedOn', dateLastWorkedOnFilter)}>
                                      ({dateLastWorkedOnFilter})
                                    </label><br/>
                                  </div> : null
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
          
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Prereqs</h3>
            {detailTrick.prereqs ?
            <TrickList 
              tricksToList = {
                this.getKeysFromRelatedObject(detailTrick.prereqs)
              }
              listType = "prereqs"
            /> : null}
            {uiStore.suggestingPrereq? null :
              <label  className = "suggestionButtonsNormal"
                      onClick={()=>this.suggestRelationClicked('prereq')}> 
                      +Suggest a prereq pattern 
              </label>
            }
            {uiStore.suggestingPrereq?   
              <div>
                <SmallTrickList 
                  listType = {'prereqDetails'}
                  listOfTricks = {uiStore.suggestedPrereq}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('prereq') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated("prereqs",detailTrickKey,
                          uiStore.suggestedPrereq.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('prereq') != null}>
                    Add prereq
                  </button>
                  <button className="suggestionButtons"
                          onClick={()=>this.suggestRelationCancelClicked()}>
                      Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('prereq')}
                </label>
              </div> : null
            }
          </div>
          
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Related</h3>
            {detailTrick.related ?
            <TrickList 
              tricksToList = {
                this.getKeysFromRelatedObject(detailTrick.related)
              }
              listType = "related"
            /> : null}
            {uiStore.suggestingRelated? null :
              <label  className = "suggestionButtonsNormal"
                      onClick={()=>this.suggestRelationClicked('related')}> 
                      +Suggest a related pattern 
              </label>
            }
            {uiStore.suggestingRelated?   
              <div>
                <SmallTrickList 
                  listType = {'relatedDetails'}
                  listOfTricks = {uiStore.suggestedRelated}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('related') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated("related",detailTrickKey,
                          uiStore.suggestedRelated.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('related') != null}>
                      Add related
                  </button>
                  <button className="suggestionButtons"  
                          onClick={()=>this.suggestRelationCancelClicked()}>
                      Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('related')}
                </label>
              </div> : null
            }
          </div>
          
          <div className = 'relationshipList'>
            <h3 className = 'relationshipLabel'>Postreqs</h3>
            {detailTrick.dependents ?
            <TrickList 
              tricksToList = {
                this.getKeysFromRelatedObject(detailTrick.dependents)
              }
              listType = "postreqs"
            /> : null}
            {uiStore.suggestingPostreq? null :
              <label  className = "suggestionButtonsNormal"
                      onClick={()=>this.suggestRelationClicked('dependent')}> 
                      +Suggest a postreq pattern 
              </label>
            }
            {uiStore.suggestingPostreq?   
              <div>
                <SmallTrickList 
                  listType = {'postreqDetails'}
                  listOfTricks = {uiStore.suggestedPostreq}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('dependent') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated("dependents",detailTrickKey,
                          uiStore.suggestedPostreq.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('dependent') != null}>
                      Add dependent
                  </button>
                  <button className="suggestionButtons"
                          onClick={()=>this.suggestRelationCancelClicked()}>
                    Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('dependent')}
                </label>
              </div> : null
            }
          </div>
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
                {playlistButton}
              </div>
              <h3 className="detailHeader">{detailTrick.name}</h3>  
              <Demo 
                trickKey = {this.props.trick.id}
                demoLocation="detail"
              />
              {extraGifSection}
              {infoSection}
              <div  id="commentsContainer"
                    className="commentsContainer">
                <h3>Discussion</h3>
                { authStore.user ? 
                    <div className="firstCommentContainer">
                      <span className="firstCommentIcon">{authStore.user.username}</span>
                      <textarea 
                        id="mainCommentTextArea"
                        onKeyUp={(e)=>utilities.autoGrow(e.target)}
                        value={this.state.firstComment} 
                        onChange={(e)=>{
                          this.setState({firstComment : e.target.value})
                        }} 
                        className="firstComment" 
                        placeholder="Write a comment..." 
                        onBlur={(e)=>{e.target.placeholder = 'Write a comment...' }}
                        onFocus={(e)=>{e.target.placeholder = '' }}
                      ></textarea>
                      <button className="submitButton" 
                              onClick={this.postFirstComment}>Submit</button>
                    </div> :             
                    <div>Log in to join the discussion.</div>
                }
                {
                  store.currentComments.length > 0 ?
                  <div className="showCommentsLabelDiv">
                    <label 
                      className="showCommentsButton" 
                      onClick={()=>{uiStore.toggleShowCommentsSection()}}
                    >
                      {uiStore.showCommentsSection ? "Hide Comments":"Show Comments"}
                    </label>
                  </div> : 
                  authStore.user ?
                  <div className="noCommentsDiv">No comments yet...</div> :
                  null
                }
                {uiStore.showCommentsSection?
                  <Comments comments={store.currentComments}></Comments>
                  :null
                }
              </div>
              {relationshipLists}
              <br/>               
            </div> 
          )
    }
  }
/*

                              */
export default Detail