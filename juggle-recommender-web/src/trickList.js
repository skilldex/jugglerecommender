import React,{Component} from 'react'
import jugglingLibrary from './jugglingLibrary.js'
class TrickList extends Component {
 state = {
 	expandedSections : {
 		"3" : false,
 		"4" : false,
 		"5" : false,

 	}
 }
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
 }
 addToMyList = (trickKey)=>{
 	this.props.addToMyList(trickKey)
 }
 toggleExpandedSection=(section)=>{
 	console.log(this.state.expandedSections, section)
 	const expandedSections =this.state.expandedSections 
 	expandedSections[section] = !expandedSections[section]
 	this.setState({expandedSections})
 }
 selectTrick = (trickKey)=>{
 	this.props.selectTricks([trickKey])
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
		if(Object.keys(this.props.selectedTricks)[0] == trick.name){
			cardClass = 'selectedListCard'
		}
		if(this.props.selectedList == "allTricks" || 
			this.props.selectedList == "myTricks" && this.props.myTricks.includes(trickKey)
		){
			tricks[trick.num.toString()].push(
				<div onClick={()=>{this.selectTrick(trickKey)}} className={cardClass} key={trickKey + "div"}>
					{trick.url ?
					 <a   href={trick.url}>{trick.name}</a> : 
					 <span>{trick.name}</span>}
					<button className="addToMyListButton" onClick={(e)=>{this.addToMyList(trickKey);e.stopPropagation()}}>Add to My List</button>
				</div>
			)
		}
	})

	return (	
		<div className="listDiv">
			<div>
				<span onClick={()=>{this.toggleExpandedSection("3")}}>{this.state.expandedSections["3"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">3 Ball</h3>
				{this.state.expandedSections["3"] ? tricks["3"] : null}
			</div>
			<div>
				<span onClick={()=>{this.toggleExpandedSection("4")}}>{this.state.expandedSections["4"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">4 Ball</h3>
				{this.state.expandedSections["4"] ? tricks["4"] : null}	
			</div>
			<div>	
				<span onClick={()=>{this.toggleExpandedSection("5")}}>{this.state.expandedSections["5"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">5 Ball</h3>
				{this.state.expandedSections["5"] ? tricks["5"] : null}
			</div>
		</div>
	)

  }

}

export default TrickList