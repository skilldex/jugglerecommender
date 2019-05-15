import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import { observer } from "mobx-react"

@observer
class TrickList extends Component {
 state = {
 	selectedTricks : [],
 	rootTricksLength : 0
 }

 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
	store.updateRootTricks()
 }


 
 render() {

 	let tricks = {
 		"3" : [],
 		"4" : [],
 		"5" : [],
 		"6" : [],
 		"7" : [],
 		
 	}
 	console.log('store.selectedTricks',store.selectedTricks)
 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
		const trick = jugglingLibrary[trickKey]
		var cardClass='listCard'

		if(trick.name.toLowerCase().includes(store.searchTrick.toLowerCase())){
			//console.log('store.selectedTricks',store.selectedTricks)
			//console.log('trick.name.replace(" ","")',trick.name.replace(" ",""))
			if(store.selectedTricks == trick.name.replace(" ","")){
							console.log('store.selectedTricks',store.selectedTricks)
			console.log('trick.name.replace(" ","")',trick.name.replace(" ",""))
				console.log('SELECTED')
				cardClass = 'selectedListCard'
			}
			if(store.selectedList === "allTricks" || 
				store.selectedList === "myTricks" && store.myTricks.includes(trickKey)
			){
				tricks[trick.num.toString()].push(
					<div onClick={()=>{store.selectTricks([trickKey])}} className={cardClass} key={trickKey + "div"}>
						{trick.url ?
						 <a href={trick.url} target="_blank">{trick.name}</a> : 
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
	 			<label>Find trick </label><input onChange={store.searchInputChange}/>
	 			<button type="submit" onClick={store.performSearch}>Search</button>
	 		</div>
			<div>
				<span onClick={()=>{store.toggleExpandedSection("3")}}>{store.expandedSections["3"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">3 Ball</h3>
				{store.expandedSections["3"] ?
					<div className={tricks["3"].length > 19 ? "listSection" : ""}> 
					{tricks["3"]}
					</div> : null
				}
				
			</div>
			<div>
				<span onClick={()=>{store.toggleExpandedSection("4")}}>{store.expandedSections["4"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">4 Ball</h3>
				{store.expandedSections["4"] ?
					<div className={tricks["4"].length > 19 ? "listSection" : ""}> 
					{tricks["4"]}
					</div> : null
				}
			</div>
			<div>	
				<span onClick={()=>{store.toggleExpandedSection("5")}}>{store.expandedSections["5"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">5 Ball</h3>
				{store.expandedSections["5"] ?
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