import React,{Component} from 'react'
import store from './stores/store'
import filterStore from './stores/filterStore'
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
import utilities from "./utilities"
import AutoComplete from './autoComplete'
@observer
class Detail extends Component {
  state = {
    catches : null,
    changingInput : false,
    showExtraGif : false,
    firstComment : "",
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
          const contributor = store.library[uiStore.detailTrick.id].contributor
          if(authStore.user.username !== contributor && contributor){
            authStore.getEmailByUsername(contributor).then((email)=>{
              if(email){
                authStore.sendEmail({
                  "emailSubject": "Someone Commented on Your Pattern",
                  "emailText" : authStore.user.username + " commented on your pattern, " + 
                      uiStore.detailTrick.id + " click to see the thread: www.skilldex.org/detail/" +
                      uiStore.detailTrick.id.replace(/ /g,"%20"), 
                  "to" : email
                }) 
              }
            })
          }
         
        }, 
        error => {
      });
      
  }
  handleEditTrickButtonClick=()=>{
    utilities.sendGA('detail','edit pattern')
    uiStore.editDetailTrick()
  }
  trickPropertyClicked=(propertyType, property)=>{
    history.push('/tricklist')
    uiStore.clearUI()
    filterStore.resetAllFilters()
    if (propertyType === 'contributor'){
      filterStore.setContributors([{id: property,text: property,}]);
    }else if (propertyType === 'ballNum'){
      filterStore.setNumBalls([property])      
    }else if (propertyType === 'tag'){
      filterStore.setTags([{id: property,text: property,}]);      
    }else if (propertyType === 'siteswap'){
      filterStore.setSearchText("ss:"+property);
    }
    uiStore.resetSelectedTrick()
    uiStore.updateRootTricks()
  }
  getKeysFromRelatedObject=(related)=>{
    const detailTrick = store.library[uiStore.detailTrick.id]
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
  suggestRelationClicked=(relation)=>{
    uiStore.toggleSuggestingRelation(relation)
    uiStore.setSuggestedRelation(relation,null)
  }
  setSuggestedPrereq=(suggestedPrereq)=>{
    uiStore.setSuggestedRelation('prereq',suggestedPrereq)
    uiStore.setAutoCompletedSuggestedRelation('prereq',true)
  }
  onSuggestPrereqInputKeyPress=(target)=>{
    // If enter pressed
      if(target.charCode===13){  
        uiStore.setAutoCompletedSuggestedRelation('prereq',true)
      }
  }
  handleSuggestPrereqChange=(e)=>{
    uiStore.setSuggestedRelation('prereq',e.target.value)
    uiStore.setAutoCompletedSuggestedRelation('prereq',false)
  }

  setSuggestedDependent=(suggestedDependent)=>{
    uiStore.setSuggestedRelation('dependent',suggestedDependent)
    uiStore.setAutoCompletedSuggestedRelation('dependent',true)
  }
  onSuggestDependentInputKeyPress=(target)=>{
    // If enter pressed
      if(target.charCode===13){  
        uiStore.setAutoCompletedSuggestedRelation('dependent',true)
      }
  }
  handleSuggestDependentChange=(e)=>{
    uiStore.setSuggestedRelation('dependent',e.target.value)
    uiStore.setAutoCompletedSuggestedRelation('dependent',false)
  }

  setSuggestedRelated=(suggestedRelated)=>{
    uiStore.setSuggestedRelation('related',suggestedRelated)
    uiStore.setAutoCompletedSuggestedRelation('related',true)
  }
  onSuggestRelatedInputKeyPress=(target)=>{
    // If enter pressed
      if(target.charCode===13){  
        uiStore.setAutoCompletedSuggestedRelation('related',true)
      }
  }
  handleSuggestRelatedChange=(e)=>{
    uiStore.setSuggestedRelation('related',e.target.value)
    uiStore.setAutoCompletedSuggestedRelation('related',false)
  }

  getSuggestedRelationSubmitDisabledMessage=(relation)=>{
    let suggestedRelationSubmitDisabledMessage = null
    let suggestedRelation = ''
    let relationProperty = ''

    if (relation === 'prereq'){
      suggestedRelation = uiStore.suggestedPrereq
      relationProperty = 'prereqs'
    }else if (relation === 'dependent'){
      suggestedRelation = uiStore.suggestedDependent
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
      if (store.library[uiStore.detailTrick.id][relationProperty] && 
          suggestedRelation in store.library[uiStore.detailTrick.id][relationProperty]){
        suggestedRelationSubmitDisabledMessage = 'Already a '+relation+'.'
      }
      if (suggestedRelation === uiStore.detailTrick.id){
        suggestedRelationSubmitDisabledMessage = "Can't suggest it for itself."
      }   

    }
    return suggestedRelationSubmitDisabledMessage
  }

	render() {   
    const detailTrickKey = uiStore.detailTrick ? uiStore.detailTrick.id : ""
    const detailTrick = store.library[detailTrickKey]
    if (detailTrickKey && !detailTrick){
        alert("Sorry, this pattern has been deleted or renamed.")
        //uiStore.setDetailTrick(null)
        //uiStore.handleBackButtonClick()
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
             title="edit your catches"
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
                                  title="Star flair: Special list"
                                  src={starIcon} 
                                  className={hasStarFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="starIcon" 
                                  onClick={()=>{store.toggleFlair(uiStore.detailTrick.id, 'starred')}}
                              />
    const babyFlairButton = <img id="babyButton" 
                                  title="Baby flair: You're learning"
                                  src={babyIcon} 
                                  className={hasBabyFlair?"flairIcon selectedFlair":"flairIcon" }
                                  alt="babyIcon" 
                                  onClick={()=>{store.toggleFlair(uiStore.detailTrick.id, 'baby')}}
                              />
    const ninjaFlairButton = <img id="ninjaButton"
                                  title="Ninja flair: You're experienced" 
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
                                  title="Catches flair: You've logged catches"
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
             title="delete this pattern"
        /> : null      
    const editTrickButton  = 
      detailTrick && authStore.user && 
      (detailTrick.contributor === authStore.user.username || 
      authStore.user.username === "tjthejuggler") ? 
        <img id="editCardButton" 
             src={editCardIcon} 
             className="editCardIcon" 
             alt="toggleCardEdit" 
             title="edit this pattern"
             onClick={()=>{this.handleEditTrickButtonClick()}}
        /> : null
    const shareButton = <img 
                           className="shareFilterDetailButton"
                           src={shareIcon}
                           onClick={()=>this.copyDetailUrl()}
                           alt=""
                           title="share this pattern"
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
                          <div className="viewsDiv">
                            <label className="detailLabel">Views </label>
                            {detailTrick.views ? Math.round(detailTrick.views) : 0}
                          </div>
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
                              <label className= "clickableProperty"
                                     onClick = {()=>this.trickPropertyClicked('contributor', detailTrick.contributor)}>
                                {detailTrick.contributor}
                              </label> : 
                              <a target="_" href='http://libraryOfJuggling.com'>Library Of Juggling</a>
                            }<br/>
                            {uiStore.showMoreInformation?
                              <div className="moreInfoDiv">                   
                                <label className="detailLabel">Difficulty </label>{detailTrick.difficulty} / 10<br/>
                                <label className="detailLabel"># of Balls </label>
                                <label className= "clickableProperty"
                                     onClick = {()=>this.trickPropertyClicked('ballNum', detailTrick.num)}>
                                {detailTrick.num}
                                </label><br/>
                                {detailTrick.siteswap ? 
                                  <div>
                                    <label className="detailLabel">Siteswap: </label>
                                    <label className= "clickableProperty"
                                         onClick = {()=>this.trickPropertyClicked('siteswap', detailTrick.siteswap)}>
                                    {detailTrick.siteswap}
                                    </label><br/>
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
    const autoCompletePrereq = uiStore.suggestedPrereq && !uiStore.autoCompletedSuggestedPrereq ? 
      <AutoComplete 
        setAutoCompletedName={this.setSuggestedPrereq} 
        input={uiStore.suggestedPrereq}
        includeBallNums = {true}
      /> : null
    const autoCompleteDependent = uiStore.suggestedDependent && !uiStore.autoCompletedSuggestedDependent ? 
      <AutoComplete 
        setAutoCompletedName={this.setSuggestedDependent} 
        input={uiStore.suggestedDependent}
        includeBallNums = {true}
      /> : null
    const autoCompleteRelated = uiStore.suggestedRelated && !uiStore.autoCompletedSuggestedRelated ? 
      <AutoComplete 
        setAutoCompletedName={this.setSuggestedRelated} 
        input={uiStore.suggestedRelated}
        includeBallNums = {true}
      /> : null
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
                      Suggest a prereq pattern 
              </label>
            }
            {uiStore.suggestingPrereq?   
              <div>
                <input className="formInputs" 
                      onKeyPress={this.onSuggestPrereqInputKeyPress}
                      value={uiStore.suggestedPrereq} 
                      onChange={this.handleSuggestPrereqChange}
                      onBlur={this.handleOnBlurSuggestPrereqInput}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('prereq') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated
                        ("prereqs",
                          detailTrickKey,
                          uiStore.suggestedPrereq.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('prereq') != null}>
                    Add prereq
                  </button>
                  <button className="suggestionButtons"
                          onClick={()=>this.suggestRelationClicked('prereq')}>
                      Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('prereq')}
                </label>
                {autoCompletePrereq}
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
                      Suggest a related pattern 
              </label>
            }
            {uiStore.suggestingRelated?   
              <div>
                <input className="formInputs" 
                      onKeyPress={this.onSuggestRelatedInputKeyPress}
                      value={uiStore.suggestedRelated} 
                      onChange={this.handleSuggestRelatedChange}
                      onBlur={this.handleOnBlurSuggestRelatedInput}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('related') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated
                        ("related",
                          detailTrickKey,
                          uiStore.suggestedRelated.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('related') != null}>
                      Add related
                  </button>
                  <button className="suggestionButtons"  
                          onClick={()=>this.suggestRelationClicked('related')}>
                      Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('related')}
                </label>
                {autoCompleteRelated}
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
            {uiStore.suggestingDependent? null :
              <label  className = "suggestionButtonsNormal"
                      onClick={()=>this.suggestRelationClicked('dependent')}> 
                      Suggest a postreq pattern 
              </label>
            }
            {uiStore.suggestingDependent?   
              <div>
                <input className="formInputs" 
                      onKeyPress={this.onSuggestDependentInputKeyPress}
                      value={uiStore.suggestedDependent} 
                      onChange={this.handleSuggestDependentChange}
                      onBlur={this.handleOnBlurSuggestDependentInput}
                />
                <div>
                  <button className={this.getSuggestedRelationSubmitDisabledMessage('dependent') != null ? 
                                    "suggestionButtonsDisabled" : "suggestionButtons"}
                          onClick={()=>store.submitSuggestedRelated
                        ("dependents",
                          detailTrickKey,
                          uiStore.suggestedDependent.replace(/\[/g,'({').replace(/\]/g,'})').replace(/\//g,'-'))}
                          disabled={this.getSuggestedRelationSubmitDisabledMessage('dependent') != null}>
                      Add dependent
                  </button>
                  <button className="suggestionButtons"
                          onClick={()=>this.suggestRelationClicked('dependent')}>
                    Cancel
                  </button>
                </div>
                <label className = 'suggestSubmitMessage'>
                  {this.getSuggestedRelationSubmitDisabledMessage('dependent')}
                </label>
                {autoCompleteDependent}
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
                      <button className="submitButton" onClick={this.postFirstComment}>Submit</button>
                    </div> :             
                    <div>No comments yet...</div>
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