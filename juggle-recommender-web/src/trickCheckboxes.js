import React,{Component} from 'react'
import jugglingLibrary from './jugglingLibrary.js'
class TrickCheckboxes extends Component {
 state = {
 	checkedTricks : {}
 }
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
 }
 checkTrick =(trickKey)=>{
 	console.log("checked " ,trickKey)
 	const input =document.getElementById(trickKey)
 	if(!input){return}
 	console.log("found trick")
 	const checkedTricks = this.state.checkedTricks
 	if(checkedTricks[trickKey] != input.checked ){
 		checkedTricks[trickKey] = input.checked
		this.props.updateCheckedTricks(checkedTricks)
 	}
 }
 render() {
 	let checkboxes = []
 	
	Object.keys(jugglingLibrary).forEach((trickKey, i) => {
		checkboxes.push(
			<div key={trickKey + "div"}>
				<input type="checkbox" checked={this.state.checkedTricks[trickKey]} key={trickKey} id={trickKey} onChange={()=>{this.checkTrick(trickKey)}}/><label>{trickKey}</label>
			</div>
	)})
	return (	
		<div>
			{checkboxes}
		</div>
	)

  }

}

export default TrickCheckboxes