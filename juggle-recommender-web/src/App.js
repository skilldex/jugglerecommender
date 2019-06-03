import React, {Component} from 'react';
import { observer } from "mobx-react"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import Popup from './popup.js'
import store from './store'
import uiStore from './uiStore'
import graphStore from './graphStore'
import Auth from './auth.js'
import authStore from './authStore.js'
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import firebase from 'firebase' 
import AddTrickForm from './addTrickForm'
 // Your web app's Firebase configuration
let firebaseConfig = {}
if(!window.location.host.includes("localhost")){
	firebaseConfig = {
		apiKey: "AIzaSyA_3_UUnQ0iII4jblL4Nf6OLALpH1AbaKQ",
		authDomain: "skilldex-dev-6c0ff.firebaseapp.com",
		databaseURL: "https://skilldex-dev-6c0ff.firebaseio.com",
		projectId: "skilldex-dev-6c0ff",
		storageBucket: "skilldex-dev-6c0ff.appspot.com",
		messagingSenderId: "224766397892",
		appId: "1:224766397892:web:80beef32563065c3"
	};
}else{
	firebaseConfig = {
    apiKey: "AIzaSyCmnOtb4Wk5MObmo1UPhgEV2Cv3b_6nMuY",
    authDomain: "skilldex-4ebb4.firebaseapp.com",
    databaseURL: "https://skilldex-4ebb4.firebaseio.com",
    projectId: "skilldex-4ebb4",
    storageBucket: "skilldex-4ebb4.appspot.com",
    messagingSenderId: "965128070479",
    appId: "1:965128070479:web:64af3cb91c057166"
  };
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

@observer
class App extends Component {
 	state = {
 		filters : [],
 		selectedList : "allTricks",
 		edges : [],
 		nodes : [],
 		isInstructionsPaneOpen: false
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
 	openSlidingPane=(stateRef)=>{
 		uiStore.setPopupTrickToNull()
 		if (stateRef == 'isLoginPaneOpen'){
	 		store.setIsLoginPaneOpen(true)
	 	}else if(stateRef == 'isInstructionsPaneOpen'){
	 		this.setState({ 'isInstructionsPaneOpen': true })
	 	}
 	}
 	handleStart=()=>{
 		console.log('startHandled')
 	}
 	render(){
		return (
			<div className="App">
				<div className="main" ref={ref => this.el = ref}>		            
		            <SlidingPane
		                className='some-custom-class'
		                overlayClassName='some-custom-overlay-class'
		                isOpen={ this.state.isInstructionsPaneOpen }
		                title='Instructions'
		                onRequestClose={ () => {
		                    this.setState({ isInstructionsPaneOpen: false });}}>
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
		                isOpen={ store.isLoginPaneOpen }
		                title='Login'
		                onRequestClose={ () => {
		                    store.setIsLoginPaneOpen(false)}}>
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
						<span className="title">Juggledex</span><span className="version"> v0.9</span>
				        <button className="headerButton" onClick={() => this.openSlidingPane('isInstructionsPaneOpen')}>Instructions</button>
				        {authStore.user ? 
				        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
				        <button className="headerButton" onClick={() => this.openSlidingPane('isLoginPaneOpen')}>Login</button>}
					</div>
					{!this.state.isInstructionsPaneOpen && !store.isLoginPaneOpen ?
					<TrickList 
						myTricks={store.myTricks} 
						selectedList={uiStore.selectedList}
						selectedTricks={uiStore.selectedTricks}
					/>
					: null}
					<Popup/>
					<AddTrickForm/>
					<TrickGraph 
						nodes = {graphStore.nodes}
						edges = {graphStore.edges}
					/>
				</div>
			</div>
		);
	}
}
export default App;
