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
 	if(prevState.expandedSections !== this.state.expandedSections || 
 		prevProps.selectedList !== this.props.selectedList
 	){
 		this.updateRootTricks()
 	}
 }
 updateRootTricks=(selectedTrickKey)=>{
 	let rootTricks = []
 	console.log('selectedTrickKey',selectedTrickKey)
 	console.log('this.props.selectedTricks[0]',this.props.selectedTricks[0])
	if (selectedTrickKey && selectedTrickKey != 'unselected'){
		//if (selectedTrickKey == this.props.selectedTricks[0]){
			console.log('pushing')
			rootTricks.push(
				selectedTrickKey
			)
		//}
	}else{
		if (selectedTrickKey != 'unselected' && this.props.selectedTricks.length==1){
			rootTricks.push(
				this.props.selectedTricks[0]
			)
		}else{
		 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
				if(this.props.selectedList == "allTricks" || 
					this.props.selectedList == "myTricks" && this.props.myTricks.includes(trickKey)
				){
					const trick = jugglingLibrary[trickKey]
					let shouldPushTrick = false
					if (trick.num == 3 && this.state.expandedSections[3]){
						shouldPushTrick = true
					}
					if (trick.num == 4 && this.state.expandedSections[4]){
						shouldPushTrick = true
					}
					if (trick.num == 5 && this.state.expandedSections[5]){
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
	 }
 	this.props.updateRootTricks(rootTricks)
 	console.log('this.props.selectedTricks[0]',this.props.selectedTricks[0])
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
 	selectedTricks[trickKey] = jugglingLibrary[trickKey]
 	this.props.selectTricks([trickKey])
 	if (this.props.selectedTricks[0] != trickKey){
 		console.log('a')

	 	this.updateRootTricks(trickKey)
	}else{
		console.log('b')
		this.updateRootTricks('unselected')
	}

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
			//console.log('this.props.selectedTricks == trick.name')
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
					{this.props.myTricks.includes(trickKey) ?
  					 <button className="addToMyListButton" onClick={(e)=>{this.removeFromMyList(trickKey);e.stopPropagation()}}>Remove from My List</button> :
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