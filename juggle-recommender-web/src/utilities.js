import store from './stores/store'
import uiStore from './stores/uiStore'
import authStore from './stores/authStore'
import ReactGA from 'react-ga';
import history from './history';
import filterStore from './stores/filterStore'
let idleTimer

function resetIdleTimer(){
  clearTimeout(idleTimer)
  idleTimer = setTimeout(()=>{
    window.location.reload()
  },7200000)
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
  isEmptyOrSpaces=(str)=>{
    let strEmpty = false
    if (str === null){
      strEmpty = true
    }else if(!str.toString().replace(/\s/g, '').length){
      strEmpty = true
    }
    return strEmpty
  }

  isNotOnlyDigits=(str)=>{
      str = str.toString()
      return str.match(/^[0-9]+$/) === null;
  }
  isNotOnlyDigitsOrDecimal=(str)=>{
      str = str.toString()
      var isNumber = /^\d*\.?\d+$/.test(str)
      return !isNumber;
  }

  formatListCatches(catches){    
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
      return (parseInt(catches/1000,10)+"K")
    }
  }
  

  isValidTime=(str)=>{
    let isValid = false
    str = str.toString()
    if (str.match(/^[0-9]+$/) === null){
      if (str.match(/^.+:\d+$/) ||
          str === ''){
        isValid = true
      }
    }else{
      isValid = true
    }

    return isValid
  }

  formatSeconds=(str)=>{
    str = str.toString()
    let toReturn
    if (str.includes(":")){
      toReturn = (parseInt(str.split(":")[0],10)*60)+(parseInt(str.split(":")[1],10))
    }else{
      toReturn = parseInt(str,10)
    }
    return toReturn
  }
  convertSecondsToColonNotation=(seconds)=>{
    seconds = parseInt(seconds,10)
    let toReturn
    let colonMin = Math.floor(seconds/60)
    let colonSec = seconds%60
    toReturn = colonMin.toString() + ":" + colonSec.toString()
    return toReturn
  }
  sendGA(cat, act, lab){
    //console.log('sendGA ',cat+' ', act+' ', lab)
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

  objectToArray=(object)=>{
      return Object.keys(object).map((key)=>{
          object[key]["key"] = key
          return object[key]
      }) 
  }
  hammingDistance(a, b) {
    let minDistance = null
    for(let i = 0; i <= b.length; i += 1){
      if(b.length - i - a.length  < 0){
        continue
      }
      const bSub = b.slice(i,i+a.length)
      let distance = 0;

      for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== bSub[i]) {
          distance += 1;
        }
      }
      if(minDistance == null || distance < minDistance){
        minDistance = distance
      }
    }
    return minDistance;
  }
  seperateSearchSubtraction(searchTrick){
    const searchArray = searchTrick.split(" ")
    const subtractions = []
    const searches = []
    searchArray.forEach((item, i) => {
      if (item.startsWith("-")){
        subtractions.push(item.replace(/-/g,''))
      }else{
        searches.push(item)
      }
    })
    return [searches.join(' '), subtractions]
  }

  compareStrings=(string1,string2)=>{
    string1 = this.removeSpecialCharacters(string1) 
    string2 = this.removeSpecialCharacters(string2)
    const stringDistance = this.hammingDistance(string1.toLowerCase(),string2.toLowerCase())
    if(stringDistance !== null && 
      (stringDistance === 0 ||
      stringDistance/string1.length <= .25 )){//Math.min(string1.length/3,3)){
      return stringDistance 
    }else{
      return null
    }
  }
  removeSpecialCharacters(string){
    return string.replace(/[ +'-]/g,"")
  }
  getDateLastWorkedOnFilter(workedOnTime){
    const date = new Date()
    let period = 'Day'
    let value = '1'
    const dayLength = 86400000
    const timeSince = date.getTime() - workedOnTime
    if (timeSince > dayLength &&
        timeSince < dayLength * 7){
      value = (Math.ceil(timeSince / dayLength)).toString()
    }else if(timeSince > dayLength * 7 &&
            timeSince < dayLength * 30){
      period = 'Week'
      value = (Math.ceil(timeSince / (dayLength*7))).toString()
    }else if(timeSince > dayLength * 30){
      period = 'Month'
      value = (Math.ceil(timeSince / (dayLength*30))).toString()
    }
    let plural = ''
    if (parseInt(value,10)>1){
      plural = 's'
    }
    return (value + ' ' + period + plural)
  }
  sortObjectByAttribute(data, attr) {
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
    if (attr === "relevance"){
      return arr
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
  sortRootTricks() {
    let attr = filterStore.sortType
    if (filterStore.sortType === "alphabetical"){
      attr = 'name'
    }
    let tempLibrary = store.library
    if(attr === 'timeSubmitted'){
      for (let tempLibraryTrick in tempLibrary){
        if (!tempLibrary[tempLibraryTrick].timeSubmitted){
          tempLibrary[tempLibraryTrick].timeSubmitted = 0
        }
      }
    }else if (attr === 'lastUpdated'){
      for (let tempLibraryTrick in tempLibrary){
        if (store.myTricks[tempLibraryTrick] && store.myTricks[tempLibraryTrick].lastUpdated){
          tempLibrary[tempLibraryTrick].lastUpdated = 999999999999 - store.myTricks[tempLibraryTrick].lastUpdated
        }else{
          tempLibrary[tempLibraryTrick].lastUpdated = 0
        }
      }
    }else if (attr === 'catches'){
      for (let tempLibraryTrick in tempLibrary){
        if (store.myTricks[tempLibraryTrick] && store.myTricks[tempLibraryTrick].catches){
          tempLibrary[tempLibraryTrick].catches = store.myTricks[tempLibraryTrick].catches
        }else{
          tempLibrary[tempLibraryTrick].catches = 0
        }
      }
    }
    var arr = [];
    for (var index in [...uiStore.rootTricks]) {
      const trick = uiStore.rootTricks[index]
      var obj = {};
          obj['trick'] = trick;
      if (attr !== "relevance"){
        if (tempLibrary[trick] && tempLibrary[trick][attr] !== null) {
          if (attr === "random"){
            obj.tempSortName = Math.floor((Math.random() * 1000000));
          }else{
            obj.tempSortName = tempLibrary[trick][attr];
          }
          arr.push(obj);
        }
      }else{
        obj.tempSortName = uiStore.rootTrickRelevance[trick]
        arr.push(obj);
      }
    }
    const finalTricks = arr.sort(function(a, b) {      
      if(attr === "relevance"){
        if(filterStore.sortDirection === 'ascending'){
           return a.tempSortName > b.tempSortName ? 1 : ( 
            a.tempSortName < b.tempSortName ? -1 : 
            a.trick.length > b.trick.length ? 1 : 
            a.trick.length < b.trick.length ? -1 : 0 
           );               
        }
      }else{
        var at, bt
        if(attr === "name"){
          at = a.tempSortName
          bt = b.tempSortName
        }else{
          at = parseFloat(a.tempSortName)*10;
          bt = parseFloat(b.tempSortName)*10;
        }
        return at > bt ? 1 : ( at < bt ? -1 : 0 ); 
      }      
    }); 
    const tempRootTricks = []
    Object.keys(finalTricks).forEach((index, i) => {
      tempRootTricks.push(finalTricks[index].trick)
    })
    if(attr === 'lastUpdated' ||
      attr === 'difficulty' ||
      attr === 'name' ||
      attr === 'relevance'){
      if(filterStore.sortDirection === 'descending'){
        tempRootTricks.reverse()
      }      
    }else if(filterStore.sortDirection === 'ascending'){
      tempRootTricks.reverse()
    }
    uiStore.setRootTricks(tempRootTricks)   
  }

  isValidVideoURL(videoURL){
    let isValid = false
    if (videoURL.includes("instagram.com") || 
        videoURL.includes("youtu")){
      isValid = true                               
    }
    return isValid
  }
  
  autoGrow(element){
      element.style.height = "5px"
      element.style.height = element.scrollHeight+"px"
  }
  openPage(page, shouldPush){
    if(page === 'addpattern'){
      uiStore.setShowExpandedMenu(false)
    }else{
      uiStore.clearUI()
      if (!store.isMobile){
        document.getElementById("searchTextInput").focus()
      }
    }
    if(page === 'logout'){
      shouldPush = false
    }
    if(shouldPush){        
        if(page.includes('detail/')){//if page is 'detail'/trickkey
          history.push('/' + page, {detail : page.split('/')[1]})  
        }else{
          history.push('/' + page)
        }       
    }
    if(page === "addpattern"){     
      if(!uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }else if(page === "logout"){
      authStore.signOut()
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }      
    }else if(page === "home"){
      uiStore.setShowHomeScreen(true)
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }     
    }else if(page === "tricklist"){
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
      uiStore.setFilterURL()
    }else if(page === "stats"){
      uiStore.setShowStatsScreen(true)
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }else if(page === "profile"){
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
    console.log(trick)
    const numBalls = trick.num
    const myTrick  = store.myTricks[trickKey] ? store.myTricks[trickKey] : null
    const numHands = 2 
    if(myTrick && myTrick.catches > 0){
       x = myTrick.catches/(numBalls*numHands)
    }else if(myTrick && !myTrick.catches && (myTrick.ninja === "true" || myTrick.baby === "true")){
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