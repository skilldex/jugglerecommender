import {action, configure} from "mobx"
import store from './stores/store'
import uiStore from './stores/uiStore'
import authStore from './stores/authStore'
import ReactGA from 'react-ga';
import history from './history';

configure({ enforceActions: "always" })
let idleTimer

function resetIdleTimer(){
  clearTimeout(idleTimer)
  idleTimer = setTimeout(()=>{
    window.location.reload()
  },3600000)
}
window.onload = resetIdleTimer;
document.onload = resetIdleTimer;
document.onmousemove = resetIdleTimer;
document.onmousedown = resetIdleTimer; // touchscreen presses
document.ontouchstart = resetIdleTimer;
document.onclick = resetIdleTimer;     // touchpad clicks
document.onscroll = resetIdleTimer;    // scrolling with arrow keys
document.onkeypress = resetIdleTimer;


class Utilities{
  @action isEmptyOrSpaces=(str)=>{
    let strEmpty = false
    if (str === null){
      strEmpty = true
    }else if(!str.toString().replace(/\s/g, '').length){
      strEmpty = true
    }
    return strEmpty
  }

  @action isNotOnlyDigits=(str)=>{
      str = str.toString()
      return str.match(/^[0-9]+$/) === null;
  }
  @action isNotOnlyDigitsOrDecimal=(str)=>{
      str = str.toString()
      var isNumber = /^\d*\.?\d+$/.test(str)
      return !isNumber;
  }

  @action formatListCatches(catches){    
    if (!catches){
      return '0'
    }
    catches = parseInt(catches,10)
    if (catches<1000){
      return catches
    }
    if (catches>999 && catches<10000){
      return ((catches/1000).toFixed(1)+"K")
    }
    if (catches>10000){
      return (parseInt(catches/1000)+"K")
    }
  }
  

  @action isValidTime=(str)=>{
    let isValid = false
    str = str.toString()
    if (str.match(/^[0-9]+$/) === null){
      if (str.match(/^.+:\d+$/)){
        isValid = true
      }
    }else{
      isValid = true
    }
    return isValid
  }

  @action formatSeconds=(str)=>{
    str = str.toString()
    let toReturn
    if (str.includes(":")){
      toReturn = (parseInt(str.split(":")[0],10)*60)+(parseInt(str.split(":")[1],10))
    }else{
      toReturn = parseInt(str,10)
    }
    if (toReturn === 0){
      toReturn = 1
    }
    return toReturn
  }
  @action sendGA(cat, act, lab){
  if(!store.isLocalHost){
      if (lab){
        ReactGA.event({
            category: cat,
            action: act,
            label: lab,
        });
      }
      else{
        ReactGA.event({
            category: cat,
            action: act,
        });
      }
    } 
  }

  @action objectToArray=(object)=>{
      return Object.keys(object).map((key)=>{
          object[key]["key"] = key
          return object[key]
      }) 
  }

  @action sortObjectByAttribute(data, attr) {
    var arr = [];
    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        var obj = {};
        obj[prop] = data[prop];
        if (attr === "random"){
          obj.tempSortName = Math.floor((Math.random() * 1000000));
        }else{
          obj.tempSortName = data[prop][attr];
        }
        arr.push(obj);
      }
    }    
    arr.sort(function(a, b) {
      var at, bt
      if(attr === "alphabetical"){
        at = a.tempSortName
        bt = b.tempSortName
      }else{
        at = parseFloat(a.tempSortName)*10;
        bt = parseFloat(b.tempSortName)*10;
      }
      return at > bt ? 1 : ( at < bt ? -1 : 0 );               
    });    
    return arr;
  }

  @action isValidVideoURL(videoURL){
    let isValid = false
    if (videoURL.includes("instagram.com") || 
        videoURL.includes("youtu")){
      isValid = true                               
    }
    return isValid
  }
  
  @action autoGrow(element){
      element.style.height = "5px"
      element.style.height = element.scrollHeight+"px"
  }
  openPage(page, shouldPush){
    if(page === 'addpattern'){
      uiStore.setShowExpandedMenu(false)
    }else{
      uiStore.clearUI()
    }
    if(page == 'logout'){
      shouldPush = false
    }
    if(shouldPush){        
        if(page.includes('detail/')){//if page is 'detail'/trickkey
          history.push('/' + page, {detail : page.split('/')[1]})  
        }else{
          history.push('/' + page)
        }       
    }
    if(page == "addpattern"){     
      if(!uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }else if(page == "logout"){
      authStore.signOut()
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }      
    }else if(page == "home"){
      uiStore.setShowHomeScreen(true)
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }     
    }else if(page == "tricklist"){
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
      uiStore.setFilterURL()
    }else if(page == "stats"){
      uiStore.setShowStatsScreen(true)
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }else if(page == "profile"){
      uiStore.setShowProfileScreen(true)
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }else if(page.includes('detail/')){
      const trickKey = page.split('/')[1]
      uiStore.setShowHomeScreen(false)
      uiStore.setShowExpandedMenu(false)
      if (uiStore.selectedTrick){
       uiStore.toggleSelectedTrick(null)
      }
      const detailTrick = {...store.library[trickKey]}
      detailTrick.id = trickKey
      uiStore.setDetailTrick(detailTrick)  
    }
    this.addModIgnoreToURL()
  }
  addModIgnoreToURL(){
    if(authStore.user &&
      authStore.mods.includes(authStore.user.username) &&
      !window.location.href.includes('/modignore')){
        if (window.history.replaceState) {
          window.history.replaceState({}, null, window.location.href + '/modignore');
        } else {//some browsers don't do pushState, so this changes url and reloads it
            window.location.href = window.location.href + '/modignore'
        }
    }    
  }

  relatedTrickScoringFunction(x){
    return 1+1/(-.05*x - 1)
  }
  currentTrickScoringFunction(x){
    return -1*(1+1/(-.15*x - 1)) + 1
  }
  calculateX(trickKey){
    let x
    const trick = store.library[trickKey]
    const numBalls = trick.num
    const myTrick  = store.myTricks[trickKey] ? store.myTricks[trickKey] : null
    const numHands = 2 
    if(myTrick && myTrick.catches > 0){
       x = myTrick.catches/(numBalls*numHands)
    }else if(myTrick && !myTrick.catches && (myTrick.ninja == "true" || myTrick.baby == "true")){
      if(myTrick.baby){
        x = numBalls*numHands
      }else{
        x = numBalls*numHands*15
      }
    }else{
      x = 0
    }
    return x
  }
  calculateRandomTrickScore(trickKey){
    const currentTrickScore = this.currentTrickScoringFunction(this.calculateX(trickKey))
    let myTricksAllTricksRatio = 1/Object.keys(store.library).length
    if(store.myTricks){
      myTricksAllTricksRatio = 
      Object.keys(store.myTricks).length/ 
      Object.keys(store.library).length
    }
    let relatedTricksScore = myTricksAllTricksRatio
    let relationshipList = ["prereqs","dependents","related"]
    const trick = store.library[trickKey]

    relationshipList.forEach((relation)=>{
      if(trick[relation]){
        Object.keys(trick[relation]).forEach((relatedTrickKey)=>{
          if (store.library[relatedTrickKey]){
            const currentScore = this.relatedTrickScoringFunction(this.calculateX(relatedTrickKey))
            relatedTricksScore += currentScore
          }
        })
      }
    })
    
    const totalScore = (Math.min(6,relatedTricksScore)/6)*currentTrickScore/(myTricksAllTricksRatio*5)
    return totalScore
  }

}
const utilites = new Utilities()

export default utilites