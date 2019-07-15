import React,{Component} from 'react'
import { observer } from "mobx-react"
import filterStore from './stores/filterStore'
import store from './stores/store'
import uiStore from './stores/uiStore'
import sortIconSelected from './images/sortIconSelected.png'
import sortIconUnselected from './images/sortIconUnselected.png'
import filterIcon from './images/filterIcon.svg'
import searchIcon from './images/searchIcon.png'
import shareIcon from './images/shareIcon.png'
import starIcon from './images/starIcon.svg'
import authStore from "./stores/authStore"
import './mainTagsBar.css';

@observer
class MainTagsBar extends Component {
    state={
         
    }
    copyContributorURL=()=>{
      const textField = document.createElement('textarea')
      const url = window.location.origin + "/?contributor=" + authStore.user.username +",&"
      textField.innerText = url
      document.body.appendChild(textField)
      var range = document.createRange();  
      range.selectNode(textField);  
      window.getSelection().addRange(range);  
      textField.select()
      document.execCommand('copy')
      textField.remove()

      alert("Link for your contributed tricks copied to clipboard\n" + url)
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
    sortOptionClicked=(type)=>{
      filterStore.setSortType(type)
    }
    sortDirectionClicked=(direction)=>{
      filterStore.setSortDirection(direction)
    }

    mouseEnterSortDiv=()=>{
      uiStore.setShowSortDiv(true)
      uiStore.setMouseInSortDiv(true)
    }

    mouseLeaveSortDiv=()=>{
      uiStore.setShowSortDiv(false)
      uiStore.setMouseInSortDiv(false)
    }

    render() {
      let filterButtonClass = uiStore.showFilterDiv?
                    "selectedfilterButton" : "unselectedfilterButton" 
                filterButtonClass = "filterButton "+ filterButtonClass 
      let filterTags = []
      if(filterStore.numBalls){   
        filterStore.numBalls.forEach((numBall,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.numBalls[i]} Balls</span>
                  <label className="mainTagsX"onClick={()=>this.numButtonClicked(filterStore.numBalls[i])}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.contributors){   
        filterStore.contributors.forEach((contributor,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"
                        onClick={()=>{uiStore.toggleFilterDiv()}}>By '{filterStore.contributors[i].text}'</span>
                  <label className="mainTagsX"onClick={()=>filterStore.removeContributor(i)}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.difficultyRange[0] !==1 || filterStore.difficultyRange[1] !==10 ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}> Difficulty {filterStore.difficultyRange[0]}-{filterStore.difficultyRange[1]}</span>
                <label className="mainTagsX"onClick={()=>filterStore.resetDifficultyRange()}> x </label>
              </div>      
        )
      }
      if(filterStore.minCatches !==0 || filterStore.maxCatches <store.highestCatches ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}>
                        {filterStore.minCatches}-{filterStore.maxCatches} Catches </span>
                <label className="mainTagsX"onClick={()=>filterStore.resetCatches()}> x </label>
              </div>      
        )
      }
      if(filterStore.tags){   
        filterStore.tags.forEach((tag,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"
                        onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.tags[i].text}</span>
                  <label className="mainTagsX"onClick={()=>filterStore.handleDelete(i)}> x </label>
                </div>      
          )
        })
      }
      if(!filterStore.demoType===[]){   
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}>Demo: {filterStore.demoType}</span>
                <label className="mainTagsX"onClick={()=>filterStore.handleDemoTypeDelete()}> x </label>
              </div>      
        )
      }
        let myTricksButtonClass = uiStore.selectedList === "myTricks" ? 
                      "selectedListButton" :"unselectedListButton" 
            myTricksButtonClass = myTricksButtonClass + " listButton"
        const myTricksButton =  <img className={myTricksButtonClass}
                                     src={starIcon}
                                     onClick={()=>{uiStore.toggleSelectedList()}}
                                     alt=""
                                />
        const shareButton = authStore.user ? <img 
                                 className="shareButton"
                                 src={shareIcon}
                                 onClick={this.copyContributorURL}
                                 alt=""
                                 title="share your contributed tricks"
                            /> : null
        const sort = <img src={uiStore.showSortDiv? sortIconSelected:sortIconUnselected} 
                          className="filterButton"  
                          alt="showSortMenu" 
                          onClick={()=>uiStore.toggleSortDiv()}
                      />
        const filter = <img 
                         className={filterButtonClass} 
                         src={filterIcon} 
                         alt="showFilterMenu" 
                         onClick={()=>{uiStore.setShowFilterDiv(true)}}
                       />
        const sortDropdown = uiStore.showSortDiv ? 
          <div onMouseEnter = {()=>this.mouseEnterSortDiv()}
               onMouseLeave = {()=>this.mouseLeaveSortDiv()}
               title="sort" 
               alt="showSortMenu" 
               id="myDropdown" 
               className="sortDropdown"
          >
              <button alt="sortDropdownButtonDif"
                      className={filterStore.sortType === 'random' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('random')}>Random</button>
              <button alt="sortDropdownButtonDif"
                      className={filterStore.sortType === 'difficulty' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('difficulty')}>Pattern Difficulty</button>
              <button alt="sortDropdownButtonAlph"
                      className={filterStore.sortType === 'alphabetical' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('alphabetical')}>Alphabetically</button>
              <button alt="sortDropdownButtonTimeSubmitted"
                      className={filterStore.sortType === 'timeSubmitted' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('timeSubmitted')}>Date Submitted</button>
              <button alt="sortDropdownButtonCatches"
                      className={filterStore.sortType === 'catches' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('catches')}>Number of Catches</button>           
              <button alt="sortDropdownButtonLastUpdated"
                      className={filterStore.sortType === 'lastUpdated' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('lastUpdated')}>Catches Last Updated</button>
              <hr className="divdingLine"/>
              <button alt="sortDropdownButtonCatches"
                      className={filterStore.sortDirection === 'ascending' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortDirectionClicked('ascending')}>Ascending</button>            
              <button alt="sortDropdownButtonLastUpdated"
                      className={filterStore.sortDirection === 'descending' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortDirectionClicked('descending')}>Descending</button>
            </div> : null                        

      return (
        <div className="searchAndFilterSection">
          <div className="inputSection">
            <img 
              className="searchIcon" 
              src={searchIcon} 
              alt="searchIcon" 
              onClick={()=>{this.searchInput.focus()}}
            />
            <input 
              className="searchInput" 
              value={uiStore.searchInput}
              onChange={uiStore.searchInputChange}
              ref={ref => this.searchInput = ref}
            />
            {shareButton}
            {myTricksButton}
            {sort}
            {sortDropdown}
            {filter}
            <span className="mainTagsHeader">Pattern Count: {Object.keys(uiStore.rootTricks).length}</span>
          </div>
          <div className="tagSection"> 
            {filterTags}
          </div>
        </div>
      )
    }
}

export default MainTagsBar