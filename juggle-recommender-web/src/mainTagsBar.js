import React,{Component} from 'react'
import filterStore from './filterStore'
import filterIcon from './filterIcon.png'
import './mainTagsBar.css';


import { observer } from "mobx-react"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import Popup from './popup.js'
import store from './store'
import uiStore from './uiStore'
import graphStore from './graphStore'
import authStore from './authStore.js'
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import firebase from 'firebase' 
import AddTrickForm from './addTrickForm'
import Login from "./login"
import CreateAccount from "./createAccount"
import mainTagsBar from "./mainTagsBar"


class MainTagsBar extends Component {
    state={

    }
    numButtonClicked=(element)=>{//TODO I just changed this to color up in state, need to keep doin that here
    let tempNumBalls = [...filterStore.numBalls]
    if (tempNumBalls.includes(element)){
      for( var i = 0; i < tempNumBalls.length; i++){ 
        if ( tempNumBalls[i] === element) {
            tempNumBalls.splice(i, 1); 
            i--;
          }
      }
    }else{
      tempNumBalls.push(element)
    }
    filterStore.setNumBalls(tempNumBalls)
  }
    render() {
    const filter = <img className="filterButton" src={filterIcon} alt="showFilterMenu" 
              onClick={()=>{filterStore.toggleFilterDiv()}}/>
    let filterTags = []
    let tagSection = null
    if(filterStore.tags){   
      filterStore.tags.forEach((tag,i)=>{
        filterTags.push(
              <div className="mainTagsDiv">
                <span className="mainTagsName">&nbsp;{filterStore.tags[i].text}</span>
                <label className="mainTagsX"onClick={()=>filterStore.handleDelete(i)}>&nbsp;x&nbsp;</label>
              </div>      
        )
      })

    }
    if(filterStore.numBalls){   
      filterStore.numBalls.forEach((numBall,i)=>{
        filterTags.push(
              <div className="mainTagsDiv">
                <span className="mainTagsName">&nbsp;{filterStore.numBalls[i]}&nbsp;Balls</span>
                <label className="mainTagsX"onClick={()=>this.numButtonClicked(filterStore.numBalls[i])}>&nbsp;x&nbsp;</label>
              </div>      
        )
      })

    }
     tagSection = <div className="tagSection">
              {filter}
              <span className="mainTagsHeader">{filterTags.length>0?"TAGS: ":"TAGS: none"}</span> 
              <div className="mainTagsButtonsDiv">
                {filterTags}
              </div>
            </div>
      
      return (
        <div className="mainTagsFullDiv">
          {tagSection}
        </div>
      )
    }
}

export default MainTagsBar