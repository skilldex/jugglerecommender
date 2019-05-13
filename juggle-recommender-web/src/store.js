import { action, configure, computed, observable, toJS} from "mobx"
configure({ enforceActions: "always" })
class Store {
	@observable myTricks = []
	@action addToMyTricks=(trickKey)=>{
 		this.myTricks.push(trickKey)
 		console.log("added trick " ,trickKey)
 		localStorage.setItem('myTricks', JSON.stringify(this.myTricks))
 	}
 	@action setMyTricks=(tricks)=>{
 		this.myTricks = tricks
 	}
}

const store = new Store()

export default store