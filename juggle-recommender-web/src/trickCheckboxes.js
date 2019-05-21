import React,{Component} from 'react'
import jugglingLibrary from './jugglingLibrary.js'
class TrickCheckboxes extends Component {
 state = {
 	checkedTricks : {},
 	expandTrick : {Box : false, Columns : false, MillsMess : false}
 }
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
 }
 checkTrick =(trickKey)=>{
 	const input =document.getElementById(trickKey)
 	if(!input){return}
 	const checkedTricks = this.state.checkedTricks
 	if(checkedTricks[trickKey] != input.checked && input.checked ){
 		checkedTricks[trickKey] = true
 	}else if (checkedTricks[trickKey] != input.checked && !input.checked){
 		delete checkedTricks[trickKey]
 	}
 	.updateCheckedTricks(checkedTricks)

 }
 renderNestedCheckboxes=(tricks)=>{
 	let nestedCheckboxes = []
	Object.keys(tricks).forEach((trickKey, i) => {
		const trick = tricks[trickKey]
		nestedCheckboxes.push(
			<div className="nestedCheckboxDiv" key={trickKey + "div"}>
				<input type="checkbox" checked={this.state.checkedTricks[trickKey]} key={trickKey} id={trickKey} onChange={()=>{this.checkTrick(trickKey)}}/><label>{trickKey}</label>
			</div>
		)
	}) 	
	return nestedCheckboxes

 }
 toggleExpandTrick = (trickKey)=>{
 	let expandTrick =  this.state.expandTrick
 	expandTrick[trickKey] = !expandTrick[trickKey]
 	this.setState({
 		expandTrick
 	})
 }
 render() {
 	let checkboxes = []
 	let expandableTricks = {}
 	expandableTricks["Box"] = {}
 	expandableTricks["Columns"] = {}
 	expandableTricks["MillsMess"] = {}
 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
 		const trick = jugglingLibrary[trickKey]
 		if(trick.parent in expandableTricks){
 			expandableTricks[trick.parent][trickKey] = trick
 		}
 	})

	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
		const trick = jugglingLibrary[trickKey]
		if(.filters.includes(trick.num) && !trick.parent){
			checkboxes.push(
			<div className="checkboxDiv" key={trickKey + "div"}>
				{trickKey in this.state.expandTrick ? 
					<span onClick={()=>{this.toggleExpandTrick(trickKey)}}>
						{this.state.expandTrick[trickKey] ? "^" : ">" }
					</span> 
					: null}
				<input type="checkbox" checked={this.state.checkedTricks[trickKey]} key={trickKey} id={trickKey} onChange={()=>{this.checkTrick(trickKey)}}/><label>{trickKey}</label>
				{trickKey in expandableTricks && this.state.expandTrick[trickKey]? this.renderNestedCheckboxes(expandableTricks[trickKey]) : null}
			</div>
			)
		
		}
	})

	return (	
		<div>
			{checkboxes}
		</div>
	)

  }

}

export default TrickCheckboxes