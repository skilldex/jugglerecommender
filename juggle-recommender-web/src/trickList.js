import React,{Component} from 'react'
import jugglingLibrary from './jugglingLibrary.js'
class TrickList extends Component {
 state = {

 }
 componentDidMount(){
 	const checkedTricks =  JSON.parse(localStorage.getItem("checkedTricks"))
	if(checkedTricks){
		this.setState({checkedTricks})
	}
 }
 addToMyList = (trickKey)=>{
 	console.log(trickKey)
 }
 render() {
 	let otherTricks = []
 	let boxTricks = []
 	let columnTricks = []
 	Object.keys(jugglingLibrary).forEach((trickKey, i) => {

		const trick = jugglingLibrary[trickKey]
		console.log(trick.url)
			otherTricks.push(
				<div className="listCard" key={trickKey + "div"}>
					{trick.url ? <a href={trick.url}>{trick.name}</a> : <span>{trick.name}</span>}
					<button className="addToMyListButton" onClick={()=>{this.addToMyList(trickKey)}}>Add to My List</button>
				</div>
			)
	})
	return (	
		<div className="listDiv">
			<h3>Other</h3>
			{otherTricks}
		</div>
	)

  }

}

export default TrickList