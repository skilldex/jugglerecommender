import React,{Component} from 'react'
import filterStore from './stores/filterStore'
import store from './stores/store'
import filterIcon from './images/filterIcon.png'
import './mainTagsBar.css';
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
      if(filterStore.numBalls){   
        filterStore.numBalls.forEach((numBall,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"> {filterStore.numBalls[i]} Balls</span>
                  <label className="mainTagsX"onClick={()=>this.numButtonClicked(filterStore.numBalls[i])}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.difficultyRange[0] !=1 && filterStore.difficultyRange[0] !=10 ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName"> Difficulty 
                        {filterStore.difficultyRange[0]}-{filterStore.difficultyRange[1]}</span>
                <label className="mainTagsX"onClick={()=>filterStore.resetDifficultyRange()}> x </label>
              </div>      
        )
      }
      if(filterStore.minCatches !=0 || filterStore.maxCatches <store.highestCatches ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName">
                        {filterStore.minCatches}-{filterStore.maxCatches}
                         Catches </span>
                <label className="mainTagsX"onClick={()=>filterStore.resetCatches()}> x </label>
              </div>      
        )
      }
      if(filterStore.tags){   
        filterStore.tags.forEach((tag,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"> {filterStore.tags[i].text}</span>
                  <label className="mainTagsX"onClick={()=>filterStore.handleDelete(i)}> x </label>
                </div>      
          )
        })

      }
      
      return (
        <div className="tagSection">
          {filter}
          <span className="mainTagsHeader">{filterTags.length>0?"":"no filters selected"}</span> 
          {filterTags}
          {tagSection}
        </div>
      )
    }
}

export default MainTagsBar