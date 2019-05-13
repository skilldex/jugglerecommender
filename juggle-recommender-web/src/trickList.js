import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import { observer } from "mobx-react"

@observer
class TrickList extends Component {
 state = {
 	selectedTricks : [],
 	rootTricksLength : 0,
 	searchInput : "",
 	searchTrick : "",
 	expandedSections : {
 		"3" : true,
 		"4" : false,
 		"5" : false,

 	}
 }
shouldComponentUpdate(nextProps,nextState){
	if(nextState.searchInput !== this.state.searchInput 
	){
		return false
	}else{
		return true
	}
}
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
	store.updateRootTricks()
 }
 componentDidUpdate(prevProps,prevState){
 	if(prevState.expandedSections !== this.state.expandedSections){
 		store.updateRootTricks()
 	}
 }

 toggleExpandedSection=(section)=>{
 	console.log("Expanded " ,this.state.expandedSections, section)
 	const expandedSections = {...this.state.expandedSections} 
 	expandedSections[section] = !expandedSections[section]
 	this.setState({expandedSections})
 }

searchInputChange=(e)=>{
	this.setState({
		searchInput: e.target.value
	})
	console.log("search", e.target.value)
	if(e.target.value === ""){
		console.log("search trick changing")
		this.setState({searchTrick: ""}, function () {
            this.setState({searchTrick: ""}, function () {
    	});
    });
	}
}
 searchTrick=()=>{
    this.setState({searchTrick: this.state.searchInput}, function () {
            this.setState({searchTrick: this.state.searchInput}, function () {
    	});
    });
}
 
 render() {
 	let tricks = {
 		"3" : [],
 		"4" : [],
 		"5" : [],
 		"6" : [],
 		"7" : [],
 		
 	}
 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
		const trick = jugglingLibrary[trickKey]
		var cardClass='listCard'
		if(trick.name.toLowerCase().includes(this.state.searchTrick.toLowerCase())){
			if(store.selectedTricks == trick.name.replace(" ","")){
				cardClass = 'selectedListCard'
			}
			if(store.selectedList === "allTricks" || 
				store.selectedList === "myTricks" && store.myTricks.includes(trickKey)
			){
				tricks[trick.num.toString()].push(
					<div onClick={()=>{store.selectTricks([trickKey])}} className={cardClass} key={trickKey + "div"}>
						{trick.url ?
						 <a href={trick.url}>{trick.name}</a> : 
						 <span>{trick.name}</span>}
						{store.myTricks.includes(trickKey) ?
	  					 <button className="removeFromMyTricksButton" onClick={(e)=>{store.removeFromMyTricks(trickKey);e.stopPropagation()}}>Remove from My List</button> :
						 <button className="addToMyTricksButton" onClick={(e)=>{store.addToMyTricks(trickKey);e.stopPropagation()}}>Add to My List</button>}				
					</div>
				)
			}
		}
	})

	return (	
		<div className="listDiv">
		 	<div>
	 			<label>Find trick </label><input onChange={this.searchInputChange}/>
	 			<button type="submit" onClick={this.searchTrick}>Search</button>
	 		</div>
			<div>
				<span onClick={()=>{this.toggleExpandedSection("3")}}>{this.state.expandedSections["3"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">3 Ball</h3>
				{this.state.expandedSections["3"] ?
					<div className={tricks["3"].length > 19 ? "listSection" : ""}> 
					{tricks["3"]}
					</div> : null
				}
				
			</div>
			<div>
				<span onClick={()=>{this.toggleExpandedSection("4")}}>{this.state.expandedSections["4"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">4 Ball</h3>
				{this.state.expandedSections["4"] ?
					<div className={tricks["4"].length > 19 ? "listSection" : ""}> 
					{tricks["4"]}
					</div> : null
				}
			</div>
			<div>	
				<span onClick={()=>{this.toggleExpandedSection("5")}}>{this.state.expandedSections["5"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">5 Ball</h3>
				{this.state.expandedSections["5"] ?
					<div className={tricks["5"].length > 19 ? "listSection" : ""}> 
					{tricks["5"]}
					</div> : null
				}
			</div>
		</div>
	)

  }

}

export default TrickList