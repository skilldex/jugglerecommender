import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
class TrickList extends Component {
 state = {
 	selectedTricks : [],
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
 	if(prevState.expandedSections !== this.state.expandedSections || 
 		prevProps.selectedList !== this.props.selectedList
 	){
 		this.updateRootTricks()
 	}
 }
 updateRootTricks=()=>{
 	let rootTricks = []
 	let selectedIsShown = true
 	console.log('updating root')
 	if(this.props.selectedList === "myTricks" && !this.props.myTricks.includes(this.state.selectedTricks[0])){
 		this.props.selectTricks([])
 		this.setState({selectedTricks : []})
 		selectedIsShown = false
 	}
 	if (this.state.selectedTricks.length > 0 && selectedIsShown){
		rootTricks.push(
			this.state.selectedTricks[0]
		)
 	}else{
	 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
			if(this.props.selectedList === "allTricks" || 
				this.props.selectedList === "myTricks" && this.props.myTricks.includes(trickKey)
			){
				const trick = jugglingLibrary[trickKey]
				let shouldPushTrick = false
				if (trick.num === 3 && this.state.expandedSections[3]){
					shouldPushTrick = true
				}
				if (trick.num === 4 && this.state.expandedSections[4]){
					shouldPushTrick = true
				}
				if (trick.num === 5 && this.state.expandedSections[5]){
					shouldPushTrick = true
				}
				if (shouldPushTrick){
					rootTricks.push(
						trickKey
					)
				}
			}
		})
 	}
 	this.props.updateRootTricks(rootTricks)
 }

 addToMyList = (trickKey)=>{
 	this.props.addToMyList(trickKey)
 	this.updateRootTricks()
 }

 removeFromMyList = (trickKey)=>{
 	this.props.removeFromMyList(trickKey)
 	this.updateRootTricks()
 }

 toggleExpandedSection=(section)=>{
 	console.log("Expanded " ,this.state.expandedSections, section)
 	const expandedSections = {...this.state.expandedSections} 
 	expandedSections[section] = !expandedSections[section]
 	this.setState({expandedSections})
 }
 selectTrick = (trickKey)=>{
 	const selectedTricks = {}
 	let toSetStateTo
 	selectedTricks[trickKey] = jugglingLibrary[trickKey]
 	console.log("selecting trick")
	if (this.state.selectedTricks[0] === trickKey && this.state.selectedTricks.length === 1){
		toSetStateTo = []
		this.props.selectTricks([])
 	}else{ 		
 		toSetStateTo = [trickKey]
 		this.props.selectTricks([trickKey])
 	}
    this.setState({selectedTricks : toSetStateTo}, function () {
        this.updateRootTricks()
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
		var AddToOrRemoveFrom = 'Add to'
		//console.log('this.props.selectedTricks',this.props.selectedTricks)
		//console.log('trick.name',trick.name)
		if(this.props.selectedTricks == trick.name){
			//console.log('this.props.selectedTricks === trick.name')
			cardClass = 'selectedListCard'
		}
		if(this.props.myTricks.includes(trickKey)){
			AddToOrRemoveFrom = 'Remove from'
		}
		if(this.props.selectedList === "allTricks" || 
			this.props.selectedList === "myTricks" && this.props.myTricks.includes(trickKey)
		){
			tricks[trick.num.toString()].push(
				<div onClick={()=>{this.selectTrick(trickKey)}} className={cardClass} key={trickKey + "div"}>
					{trick.url ?
					 <a href={trick.url}>{trick.name}</a> : 
					 <span>{trick.name}</span>}
					{this.props.myTricks.includes(trickKey) ?
  					 <button className="removeFromMyListButton" onClick={(e)=>{this.removeFromMyList(trickKey);e.stopPropagation()}}>Remove from My List</button> :
					 <button className="addToMyListButton" onClick={(e)=>{this.addToMyList(trickKey);e.stopPropagation()}}>Add to My List</button>}				
				</div>
			)
		}
	})

	return (	
		<div className="listDiv">
			<div>
				<span onClick={()=>{this.toggleExpandedSection("3")}}>{this.state.expandedSections["3"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">3 Ball</h3>
				{this.state.expandedSections["3"] ?
					<div className="listSection"> 
					{tricks["3"]}
					</div> : null
				}
				
			</div>
			<div>
				<span onClick={()=>{this.toggleExpandedSection("4")}}>{this.state.expandedSections["4"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">4 Ball</h3>
				{this.state.expandedSections["4"] ?
					<div className="listSection"> 
					{tricks["4"]}
					</div> : null
				}
			</div>
			<div>	
				<span onClick={()=>{this.toggleExpandedSection("5")}}>{this.state.expandedSections["5"] ? "^" : ">"}</span>
				<h3 className="sectionHeader">5 Ball</h3>
				{this.state.expandedSections["5"] ?
					<div className="listSection"> 
					{tricks["5"]}
					</div> : null
				}
			</div>
		</div>
	)

  }

}

export default TrickList