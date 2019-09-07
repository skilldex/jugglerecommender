import React,{Component} from 'react'
import { observer } from "mobx-react"
import filterStore from './stores/filterStore'
import store from './stores/store'
import uiStore from './stores/uiStore'
import sortIconSelected from './images/sortIconSelected.png'
import sortIconUnselected from './images/sortIconUnselected.png'
import filterIcon from './images/filterIcon.svg'
import searchIcon from './images/searchIcon.png'
import randomTrickIcon from './images/randomTrickIcon.svg'
import './mainTagsBar.css';
import utilities from './utilities'
import {DebounceInput} from 'react-debounce-input';

@observer
class MainTagsBar extends Component {
    state={
         rotateClass : "rotatingRandomTrickBox"
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
      uiStore.setFilterURL()
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
      uiStore.setFilterURL()
    }
    handleWorkedOnXClicked=()=>{
      filterStore.setWorkedOnPeriod(null)
      uiStore.setFilterURL()
    }
    sortOptionClicked=(type)=>{
      filterStore.setSortType(type)
      utilities.sendGA('mainTagsBar','sort by '+type)
      this.showPatternList()
      uiStore.setShowSortDiv(false)
    }
    sortDirectionClicked=(direction)=>{
      utilities.sendGA('mainTagsBar','sort direction '+direction)
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
      utilities.openPage('tricklist',true)
    }

    selectRandomTrick=()=>{
      var keys = uiStore.rootTricks
      const randomTrickKey = keys[ keys.length * Math.random() << 0];
      const randomNumber = Math.random()
      const score = utilities.calculateRandomTrickScore(randomTrickKey)

      if (randomNumber < score){
          utilities.openPage('detail/'+randomTrickKey,true)
          store.increaseViewsCounter()
      }else{
          this.selectRandomTrick()
      }

    }

    handleRandomTrickClick=()=>{
      utilities.sendGA('mainTagsBar','random trick')
      const date = new Date()
      if (date.getTime() - store.timeOfPreviousRandomTrickClick < 20000 ){
        utilities.sendGA('mainTagsBar','random trick RECLICK')
      }
      uiStore.clearUI()
      this.setState({
        rotateClass : this.state.rotateClass === "rotatingRandomTrickBox" ? "rotatedRandomTrickBox" : "rotatingRandomTrickBox" 
      })
      this.selectRandomTrick()
      store.setTimeOfPreviousRandomTrickClick()
    }
    handleSearchIconClicked=()=>{
      utilities.sendGA('mainTagsBar','search icon')
      document.getElementById("searchTextInput").focus()
      this.showPatternList()
      uiStore.setFilterURL()
    }

    handleResultsLabelClicked=()=>{
      utilities.sendGA('mainTagsBar','results label')
      this.showPatternList()
      uiStore.setFilterURL()
    }


    render() {
      let filterButtonClass = uiStore.showFilterDiv?
                    "selectedfilterButton" : "unselectedfilterButton" 
                filterButtonClass = "filterButton "+ filterButtonClass 
      let filterTags = []
      if(filterStore.numBalls){   
        filterStore.numBalls.forEach((numBall,i)=>{
          filterTags.push(
                <div className="tagDiv" key={numBall}>
                  <span className="mainTagsName"onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.numBalls[i]} Balls</span>
                  <label className="mainTagsX"onClick={()=>this.numButtonClicked(filterStore.numBalls[i])}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.flair){   
        filterStore.flair.forEach((flair,i)=>{
          filterTags.push(
                <div className="tagDiv" key={flair}>
                  <span className="mainTagsName"onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.flair[i].replace('red','')} Flair</span>
                  <label className="mainTagsX"onClick={()=>this.flairClicked(filterStore.flair[i])}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.contributors){   
        filterStore.contributors.forEach((contributor,i)=>{
          filterTags.push(
                <div className="tagDiv" key={contributor}>
                  <span className="mainTagsName"
                        onClick={()=>{uiStore.toggleFilterDiv()}}>By '{filterStore.contributors[i]}'</span>
                  <label className="mainTagsX"onClick={()=>filterStore.removeTag('contributor',contributor)}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.difficultyRange[0] !==1 || filterStore.difficultyRange[1] !==10 ){
        filterTags.push(
              <div className="tagDiv" key="difficultyRangeFilterTag">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}> Difficulty {filterStore.difficultyRange[0]}-{filterStore.difficultyRange[1]}</span>
                <label className="mainTagsX"onClick={()=>filterStore.resetDifficultyRange()}> x </label>
              </div>      
        )
      }
      if(filterStore.minCatches !==0 || filterStore.maxCatches <store.highestCatches ){
        filterTags.push(
              <div className="tagDiv" key={"catchesFilterTag"}>
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
                <div className="tagDiv" key={tag}>
                  <span className="mainTagsName"
                        onClick={()=>{uiStore.toggleFilterDiv()}}> {filterStore.tags[i]}</span>
                  <label className="mainTagsX"onClick={()=>filterStore.removeTag('tags',tag)}> x </label>
                </div>      
          )
        })
      }
      if(filterStore.workedOnPeriod !== null){
        let plural = parseInt(filterStore.workedOnValue,10)>1
        filterTags.push(
              <div className="tagDiv" key="workedOnTag">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}>
                      {filterStore.workedOnValue} {filterStore.workedOnPeriod}{plural?'s':''}
                </span>
                <label className="mainTagsX"onClick={()=>this.handleWorkedOnXClicked()}> x </label>
              </div>      
        )
      }
      if(filterStore.demoType.length > 0 && filterStore.demoType[0]){   
        filterTags.push(
              <div className="tagDiv" key="demoTypeFilterTag">
                <span className="mainTagsName"
                      onClick={()=>{uiStore.toggleFilterDiv()}}>Demo: {filterStore.demoType[0]}</span>
                <label className="mainTagsX"onClick={()=>filterStore.removeTag('demoType',filterStore.demoType[0])}> x </label>
              </div>      
        )
      }
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
                        className={"randomTrickIcon " + this.state.rotateClass}
                        src={randomTrickIcon} 
                        alt="randomTrickIcon" 
                        onClick={()=>{this.handleRandomTrickClick()}}
                      />
                    </div>
        const sortDropdown = uiStore.showSortDiv ? 
          <div onMouseEnter = {()=>this.mouseEnterSortDiv()}
               onMouseLeave = {()=>this.mouseLeaveSortDiv()}
               title="sort" 
               alt="showSortMenu" 
               id="myDropdown" 
               className="sortDropdown"
          >
              <button alt="sortDropdownButtonDif"
                      className={filterStore.sortType === 'relevance' ?
                      "sortDropdownButton  sortDropdownButtonSelected" :
                      "sortDropdownButton "}
                      onClick={(e)=>this.sortOptionClicked('relevance')}>Search Relevance</button>
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
                      onClick={(e)=>this.sortOptionClicked('lastUpdated')}>Date Worked On</button>
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
      if (store.isLoginPaneOpen){console.log("isOpen")}
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
              <form autoComplete = "off"
                    onSubmit={e => { e.preventDefault(); }}>
                <DebounceInput
                  id = "searchTextInput" 
                  type = "search"
                  name = "patternSearch"
                  autoComplete="new-password"
                  className="searchInput" 
                  minLength={1}
                  debounceTimeout={store.isMobile ? 750 : 300}
                  value= {searchTextToShow}
                  onChange={uiStore.searchInputChange}
                  ref={ref => this.searchInput = ref}
                />
              </form>
              {sort}
              {sortDropdown}
              {filter}
              <span className="mainTagsResults"
                    onClick={()=>{this.handleResultsLabelClicked()}}>
                    Results: {uiStore.rootTricks.length}
              </span>

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