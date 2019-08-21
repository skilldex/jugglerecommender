import React,{Component} from 'react'
import { observer } from "mobx-react"
import filterStore from './stores/filterStore'
import store from './stores/store'
import uiStore from './stores/uiStore'
import sortIconSelected from './images/sortIconSelected.png'
import sortIconUnselected from './images/sortIconUnselected.png'
import filterIcon from './images/filterIcon.svg'
import searchIcon from './images/searchIcon.png'
import starIcon from './images/starIcon.svg'
import randomTrickIcon from './images/randomTrickIcon.png'
import authStore from "./stores/authStore"
import './mainTagsBar.css';
import history from './history';
import utilities from './utilities'

@observer
class MainTagsBar extends Component {
    state={
         
    }
    numButtonClicked=(element)=>{
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
    flairClicked=(element)=>{
      let tempFlair = [...filterStore.flair]
      if (tempFlair.includes(element)){
        for( var i = 0; i < tempFlair.length; i++){ 
          if ( tempFlair[i] === element) {
              tempFlair.splice(i, 1); 
              i--;
            }
        }
      }else{
        tempFlair.push(element)
      }
      filterStore.setFlair(tempFlair)
    }
    sortOptionClicked=(type)=>{
      filterStore.setSortType(type)
      utilities.sendGA('mainTagsBar','sort by'+type)
      this.showPatternList()
      uiStore.setShowSortDiv(false)
    }
    sortDirectionClicked=(direction)=>{
      utilities.sendGA('mainTagsBar','sort direction'+direction)
      filterStore.setSortDirection(direction)
      this.showPatternList()
    }

    mouseEnterSortDiv=()=>{
      uiStore.setShowSortDiv(true)
      uiStore.setMouseInSortDiv(true)
    }

    mouseLeaveSortDiv=()=>{
      uiStore.setShowSortDiv(false)
      uiStore.setMouseInSortDiv(false)
    }

    showPatternList=()=>{
      history.push('/tricklist')
      uiStore.clearUI()
      if(uiStore.addingTrick){
        uiStore.toggleAddingTrick()
      }
    }

    selectRandomTrick=()=>{
      var keys = Object.keys(store.library)
      const randomTrickKey = keys[ keys.length * Math.random() << 0];
      if (Math.random() > store.calculateRandomTrickScore(randomTrickKey)){
          console.log('randomTrickKey',randomTrickKey)
          uiStore.setDetailTrick({...store.library[randomTrickKey], id: randomTrickKey})
          history.push('/detail/'+uiStore.detailTrick.id, {detail : uiStore.detailTrick.id})
          store.increaseViewsCounter()
      }else{
          console.log('randomTrickKey failed',randomTrickKey)
          this.selectRandomTrick()
      }
    }

    handleRandomTrickClick=()=>{
      utilities.sendGA('mainTagsBar','random trick')
      console.log('random')
      this.selectRandomTrick()
    }
    handleSearchIconClicked=()=>{
      utilities.sendGA('mainTagsBar','search icon')
      this.searchInput.focus()
      this.showPatternList()
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
      if(filterStore.flair){   
        filterStore.flair.forEach((flair,i)=>{
          filterTags.push(
                <div className="tagDiv">
                  <span className="mainTagsName"onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.flair[i].replace('red','')} Flair</span>
                  <label className="mainTagsX"onClick={()=>this.flairClicked(filterStore.flair[i])}> x </label>
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
        let randomTrickIconDiv =
                    <div className="randomTrickIcon">
                      <img 
                        className="randomTrickIcon" 
                        src={randomTrickIcon} 
                        alt="randomTrickIcon" 
                        onClick={()=>{this.handleRandomTrickClick()}}
                      />
                    </div>
        randomTrickIconDiv = null
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
            let searchTextToShow = uiStore.searchInput
            if (filterStore.searchText){
              searchTextToShow = filterStore.searchText
            }
      return (
        <div className="searchAndFilterSection">
          <div>
            <div className="inputSection">
              <img 
                className="searchIcon" 
                src={searchIcon} 
                alt="searchIcon" 
                onClick={()=>{this.handleSearchIconClicked()}}
              />
              <input
                id = "searchTextInput" 
                className="searchInput" 
                value= {searchTextToShow}
                onChange={uiStore.searchInputChange}
                ref={ref => this.searchInput = ref}
              />
              {sort}
              {sortDropdown}
              {filter}
              <span className="mainTagsHeader">Results: {uiStore.rootTricks.length}</span>

            </div>
            {randomTrickIconDiv}
          </div>

          <div className="tagSection"> 
            {filterTags}
          </div>
        </div>
      )
    }
}

export default MainTagsBar