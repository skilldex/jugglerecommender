import React, {Component} from 'react';
import { observer } from "mobx-react"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import Popup from './popup.js'
import store from './store'
import uiStore from './uiStore'
import Auth from './auth.js'
import authStore from './authStore.js'
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import firebase from 'firebase' 

 // Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyA_3_UUnQ0iII4jblL4Nf6OLALpH1AbaKQ",
authDomain: "skilldex-dev-6c0ff.firebaseapp.com",
databaseURL: "https://skilldex-dev-6c0ff.firebaseio.com",
projectId: "skilldex-dev-6c0ff",
storageBucket: "skilldex-dev-6c0ff.appspot.com",
messagingSenderId: "224766397892",
appId: "1:224766397892:web:80beef32563065c3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

@observer
class App extends Component {
 	state = {
 		filters : [],
 		selectedList : "allTricks",
 		edges : [],
 		nodes : [],
 		isPaneOpen: false,
 		isLoginPaneOpen: false,
 		swipedList : false
	}
	componentDidMount(){
		store.getSavedTricks()	
		Modal.setAppElement(this.el);
		firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("user auth changed", user)
            authStore.setUser({username : user.email})
          } 
        });
	}
 	toggleFilter =(filter)=>{
 		let newFilters = []
 		if(!this.state.filters.includes(filter)){
 			newFilters.push(filter)
 		}
 		this.state.filters.forEach((curFilter)=>{
 			if(curFilter !== filter){
 				newFilters.push(curFilter)
 			} 			
 		})
 		this.setState({
 			filters : newFilters
 		})
 	} 	
 	handleStart=()=>{
 		console.log('startHandled')
 	}
 	render(){
		return (
			<div className="App">
				<div ref={ref => this.el = ref}>		            
		            <SlidingPane
		                className='some-custom-class'
		                overlayClassName='some-custom-overlay-class'
		                isOpen={ this.state.isPaneOpen }
		                title='Instructions'
		                onRequestClose={ () => {
		                    this.setState({ isPaneOpen: false });}}>
		                <div className="instructions">
		                	<h2>Instructions</h2>
							<span className="info">
								• ★ Star tricks you know to add to "Starred" tricks.<br/>
								• Find new tricks to learn next that are related to tricks you starred ★.
							</span>
							<br/><br/>
							<span className="info">Seeded from <a href="libraryofjuggling.com">libraryofjuggling.com</a></span>
							<br/>
							<div className="info" >contact 
								<a style={{"color":"blue"}}> skilldex.feedback@gmail.com</a>
							</div>
						</div><br/>
		            </SlidingPane>
		            <SlidingPane
		                className='some-custom-class'
		                overlayClassName='some-custom-overlay-class'
		                isOpen={ this.state.isLoginPaneOpen }
		                title='Login'
		                onRequestClose={ () => {
		                    this.setState({ isLoginPaneOpen: false });}}>
		                <div className="instructions">
		                	<span className="info">
		                		Create an account to: <br/> 
		                		• Access your tricks across devices <br/> 
		                		• Add new tricks for the community to learn <br/> 
		                		• Contribute your records to community statistics <br/> 
							</span>
		                	<Auth/><br/>
						</div><br/>
		            </SlidingPane>
					<div className="header">
						<span className="title">Juggledex</span><span className="version"> v 0.7</span>
				        <button className="headerButton" onClick={() => this.setState({ isPaneOpen: true })}>Instructions</button>
				        {authStore.user ? 
				        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
				        <button className="headerButton" onClick={() => this.setState({ isLoginPaneOpen: true })}>Login</button>}
					</div>
					{!this.state.isPaneOpen && !this.state.isLoginPaneOpen ?
						<TrickList 
							myTricks={store.myTricks} 
							selectedList={uiStore.selectedList}
							selectedTricks={uiStore.selectedTricks}
						/>
						: null}
						<Popup/>
					<TrickGraph 
						nodes = {uiStore.nodes}
						edges = {uiStore.edges}/>
				</div>
			</div>
		);
	}
}
export default App;
