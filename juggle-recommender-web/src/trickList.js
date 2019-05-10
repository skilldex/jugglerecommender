import React,{Component} from 'react'
import jugglingLibrary from './jugglingLibrary.js'
class TrickList extends Component {
 state = {
 	expandedSections : {
 		"3" : true,
 		"4" : false,
 		"5" : false,

 	}
 }
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
	this.updateRootTricks()
 }
 componentDidUpdate(prevProps,prevState){
 	console.log("comp up ",prevProps, prevState, this.props, this.state)
 	if(prevState.expandedSections !== this.state.expandedSections || 
 		prevProps.selectedList !== this.props.selectedList
 	){
 		console.log("update root tricks")
 		this.updateRootTricks()
 	}
 }
 updateRootTricks=()=>{
 	let rootTricks = []
 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
		if(this.props.selectedList == "allTricks" || 
			this.props.selectedList == "myTricks" && this.props.myTricks.includes(trickKey)
		){
			rootTricks.push(
				trickKey
			)
		}
	})
	console.log("updateding root", rootTricks)
 	this.props.updateRootTricks(rootTricks)
 }
 addOrRemoveMyList(trickKey,AddToOrRemoveFrom){
 	 	if (AddToOrRemoveFrom === 'Add to'){
 		this.addToMyList(trickKey)
 	}else if (AddToOrRemoveFrom === 'Remove from'){
 		this.removeFromMyList(trickKey)
 	}
 }

 addToMyList = (trickKey)=>{
 	this.props.addToMyList(trickKey)
 }

 removeFromMyList = (trickKey)=>{
 	this.props.removeFromMyList(trickKey)
 }

 toggleExpandedSection=(section)=>{
 	console.log("Expanded " ,this.state.expandedSections, section)
 	const expandedSections = {...this.state.expandedSections} 
 	expandedSections[section] = !expandedSections[section]
 	this.setState({expandedSections})
 }
 selectTrick = (trickKey)=>{
 	const selectedTricks = {}
 	selectedTricks[trickKey] = jugglingLibrary[trickKey]
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
		var AddToOrRemoveFrom = 'Add to'
		if(Object.keys(this.props.selectedTricks)[0] == trick.name){
			cardClass = 'selectedListCard'
		}
		if(this.props.myTricks.includes(trickKey)){
			AddToOrRemoveFrom = 'Remove from'
		}
		if(this.props.selectedList == "allTricks" || 
			this.props.selectedList == "myTricks" && this.props.myTricks.includes(trickKey)
		){
			tricks[trick.num.toString()].push(
				<div onClick={()=>{this.selectTrick(trickKey)}} className={cardClass} key={trickKey + "div"}>
					{trick.url ?
					 <a href={trick.url}>{trick.name}</a> : 
					 <span>{trick.name}</span>}
					<button className="addToMyListButton" onClick={(e)=>{this.addOrRemoveMyList(trickKey,AddToOrRemoveFrom);e.stopPropagation()}}>{AddToOrRemoveFrom} My List</button>
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