import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import { observer } from "mobx-react"

@observer
class TrickList extends Component {
 state = {
 	selectedTricks : [],
 	rootTricksLength : 0,
 	showText: false
 }

 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
	store.updateRootTricks()
 }

alphabeticalSortObject(data, attr) {
	console.log('data',data)
    var arr = [];
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
        	console.log('prop',prop)
            var obj = {};
            obj[prop] = data[prop];
            obj.tempSortName = data[prop][attr].toLowerCase();
            console.log('obj',obj)
            arr.push(obj);
        }
    }
    console.log('arr',arr)
    arr.sort(function(a, b) {
        var at = a.tempSortName,
            bt = b.tempSortName;
        return at > bt ? 1 : ( at < bt ? -1 : 0 );
    });
    console.log('soreted arr',arr)
    var result = [];
    for (var i=0, l=arr.length; i<l; i++) {
        var obj = arr[i];
        delete obj.tempSortName;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var id = prop;
            }
        }
        var item = obj[id];
        result.push(item);
    }
    console.log('result',result)
    return result;
}
 
 render() {

 	let tricks = {
 		"3" : [],
 		"4" : [],
 		"5" : [],
 		"6" : [],
 		"7" : [],
 		
 	}
 	let sortedJugglingLibrary = this.alphabeticalSortObject(jugglingLibrary, 'name');
 	console.log('sortedJugglingLibrary',sortedJugglingLibrary)
 	Object.keys(sortedJugglingLibrary).forEach((trickKey, i) => {
		const trick = sortedJugglingLibrary[trickKey]
		var cardClass='listCard'

		if(trick.name.toLowerCase().includes(store.searchTrick.toLowerCase())){
			if(store.selectedTricks == trickKey){
				cardClass = 'selectedListCard'
			}
			if(store.selectedList === "allTricks" || 
				store.selectedList === "myTricks" && store.myTricks.includes(trickKey)
			){
				tricks[trick.num.toString()].push(
					<div onClick={()=>{store.selectTricks([trickKey])}} className={cardClass} key={trickKey + "div"}>
						 {store.myTricks.includes(trickKey) ? 
	  					 <button className="removeFromMyTricksButton" onClick={(e)=>{store.removeFromMyTricks(trickKey);e.stopPropagation()}}>&#9733;</button> :
						 <button className="addToMyTricksButton" onClick={(e)=>{store.addToMyTricks(trickKey);e.stopPropagation()}}>&#9734;</button>}
						 <span className="listCardName" title={trick.name}>{trick.name}</span>			
					</div>
				)
			}
		}
	})

	return (	
		<div className="listDiv">			
			<label style={{"font-size":"30px",
							"text-align" : "right", 
							"padding-right" : "15px",
							"display" : "block"}} 
					onClick={() => this.setState({ showText: !this.state.showText })}>
			{this.state.showText ? "+" : "-"}</label>
			<div className={this.state.showText ? "displayNone" : {}}>
				
			 	<div>
		 			<input onChange={store.searchInputChange}/>
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
		</div>
	)

  }

}

export default TrickList