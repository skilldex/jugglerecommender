import React,{Component} from 'react'
import { observer } from "mobx-react"
import filterStore from './stores/filterStore'
import store from './stores/store'
import uiStore from './stores/uiStore'
import sortIconSelected from './images/sortIconSelected.png'
import sortIconUnselected from './images/sortIconUnselected.png'
import filterIcon from './images/filterIcon.svg'
import searchIcon from './images/searchIcon.png'

import './mainTagsBar.css';

var mouseOverSort = true
@observer
class MainTagsBar extends Component {
    state={
          showSortMenu : false,
    }
    toggleShowSort=()=>{
      if(!this.state.showSortMenu && filterStore.filterVisible){
        filterStore.toggleFilterDiv()
      }
      this.setState({showSortMenu:!this.state.showSortMenu})
      
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
      mouseOverSort = true
    }

    mouseLeaveSortDiv=()=>{
      mouseOverSort = false
    }

    render() {
      //"this" gets redefined in window.onclick so use "that"
      const that = this
      window.onclick = function(event) {
        if (event.srcElement['alt'] !== 'showSortMenu' && that.state.showSortMenu) {
          if (!mouseOverSort){
            that.toggleShowSort()
          }
        }
      }


      let filterButtonClass = filterStore.filterVisible?
                    "selectedfilterButton" : "unselectedfilterButton" 
                filterButtonClass = "filterButton "+ filterButtonClass 
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
      if(filterStore.difficultyRange[0] !==1 || filterStore.difficultyRange[1] !==10 ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName"> Difficulty {filterStore.difficultyRange[0]}-{filterStore.difficultyRange[1]}</span>
                <label className="mainTagsX"onClick={()=>filterStore.resetDifficultyRange()}> x </label>
              </div>      
        )
      }
      if(filterStore.minCatches !==0 || filterStore.maxCatches <store.highestCatches ){
        filterTags.push(
              <div className="tagDiv">
                <span className="mainTagsName">
                        {filterStore.minCatches}-{filterStore.maxCatches} Catches </span>
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
        const sort = <img src={this.state.showSortMenu? sortIconSelected:sortIconUnselected} 
                          className="filterButton"  
                          alt="showSortMenu" 
                          onClick={this.toggleShowSort}/>
                      
        const sortDropdown = this.state.showSortMenu ? 
          <div onMouseEnter = {()=>this.mouseEnterSortDiv()}
             onMouseLeave = {()=>this.mouseLeaveSortDiv()}
               title="sort" 
             alt="showSortMenu" 
             id="myDropdown" 
             className="sortDropdown">
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
        <div className="tagSection">
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
          {sort}
          {sortDropdown}
          <img 
            className={filterButtonClass} 
            src={filterIcon} alt="showFilterMenu" 
            onClick={()=>{filterStore.toggleFilterDiv()}}
          />
          <span className="mainTagsHeader">{filterTags.length>0?"":"no filters selected"}</span> 
          {filterTags}
          {tagSection}
        </div>
      )
    }
}

export default MainTagsBar