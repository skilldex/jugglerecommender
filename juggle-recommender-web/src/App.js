import React, {Component} from 'react';
import { observer } from "mobx-react"
import './App.css';
import TrickGraph from './trickGraph.js'
import TrickList from './trickList.js'
import Popup from './popup.js'
import store from './stores/store'
import uiStore from './stores/uiStore'
import graphStore from './stores/graphStore'
import authStore from './stores/authStore.js'
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import firebase from 'firebase' 
import AddTrickForm from './addTrickForm'
import Login from "./login"
import CreateAccount from "./createAccount"
import MainTagsBar from "./mainTagsBar"
import PopupDemo from './popupDemo'
import Filter from './filter.js'
import filterStore from './stores/filterStore'

let firebaseConfig = {}
if(window.location.host.includes("localhost") || window.location.host.match(/(\.\d+){3}/)){
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
const ESCAPE_KEY = 27;

firebase.initializeApp(firebaseConfig);

@observer
class App extends Component {
 	state = {
 		filters : [],
 		selectedList : "allTricks",
 		edges : [],
 		nodes : [],
 		isInstructionsPaneOpen: false,
 		isCreateAccountPaneOpen: false
	}
	_handleKeyDown = (event) => {
	    switch( event.keyCode ) {
	        case ESCAPE_KEY:
	            if (uiStore.addingTrick){
	            	uiStore.toggleAddingTrick()
	            }
	            break;
	        default: 
	            break;
	    }
	}
	componentDidMount(){
		document.addEventListener("keydown", this._handleKeyDown);
		store.getSavedTricks()	
		Modal.setAppElement(this.el);
		firebase.auth().onAuthStateChanged(function(user) {
          if (user && !authStore.user) {
            console.log("user auth changed", user)
            authStore.setUsername(user.email)
          } 
        });
		if(window.location.host.includes("localhost")){
			//store.initializeLibrary()
		}
		if(window.location.host.includes("localhost")){
			//store.initializeTags()
		}
		store.getLibraryFromDatabase()
		store.getTagsFromDatabase()
		
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
 	openSlidingPane=(paneName)=>{
 		if (paneName === 'isLoginPaneOpen'){
	 		store.setIsLoginPaneOpen(true)
	 	}else if(paneName === 'isInstructionsPaneOpen'){
	 		window.history.pushState("list", "list page", "localhost:3000/list")
	 		this.setState({ 'isInstructionsPaneOpen': true })
	 	}else if(paneName === 'isCreateAccountPaneOpen'){
	 		this.setState({ 'isCreateAccountPaneOpen': true })
	 	}
 	}
 	handleStart=()=>{
 		console.log('startHandled')
 	}

 	render(){
	    window.onclick = function(event) {
	        if (uiStore.popupTrick && !uiStore.mouseInPopupDiv && !uiStore.popupTimer) {
	            uiStore.setPopupTrick(null)
	        }
	        if (uiStore.showSortDiv && !uiStore.mouseInSortDiv && !uiStore.sortTimer){
	            uiStore.setShowSortDiv(false)
	        }
	        if (uiStore.showFilterDiv && !uiStore.mouseInFilterDiv && !uiStore.filterTimer){
	            uiStore.setShowFilterDiv(false)
	        }
	        if (event.target.localName==="canvas" && store.isMobile){
	        	uiStore.setListExpanded(false)
	        }
	    }
     
 		const instructions = <SlidingPane
				                className='some-custom-class'
				                overlayClassName='some-custom-overlay-class'
				                isOpen={ this.state.isInstructionsPaneOpen }
				                title='About'
				                onRequestClose={ () => {
				                    this.setState({ isInstructionsPaneOpen: false });}}>
				                <div className="instructions">
				                	<h2>About Skilldex</h2>
										<span className="info">
											• Find new trick to learn<br/>
											• Track catches for tricks you know<br/>
											• Share new tricks with the Skilldex community
										</span>
									<br/>
				                	<h2>Instructions</h2>
									<span className="info">
										• Tricks and their relationships are represented by a graph<br/>
										• An arrow connecting two tricks shows that the first trick is prerequisite for the second<br/>
										• ★ Star tricks you know to add to "Starred" tricks.<br/>
										• Find new tricks to learn next that are related to tricks you starred.
									</span>
									<br/>
									<span className="info">Seeded from <a target="_" href="http://www.libraryofjuggling.com">libraryofjuggling.com</a></span>
									<br/>
									<h2>Contact</h2>
									<div className="info" >
										<a style={{"color":"blue"}}>www.instagram.com/skilldex.app/</a><br/>
										<a style={{"color":"blue"}}>skilldex.feedback@gmail.com</a>
									</div>
								</div><br/>
				            </SlidingPane> 

		const login = 	<SlidingPane
			                className='some-custom-class'
			                overlayClassName='some-custom-overlay-class'
			                isOpen={ store.isLoginPaneOpen }
			                title='Login'
			                onRequestClose={ 
			                	() => {store.setIsLoginPaneOpen(false)}
			                }>
			                <div className="instructions">
			                	<Login/><br/>
							</div><br/>
			            </SlidingPane>

		const createAccount = <SlidingPane
			                className='some-custom-class'
			                overlayClassName='some-custom-overlay-class'
			                isOpen={ store.isCreateAccountPaneOpen }
			                title='Create Account'
			                onRequestClose={ 
			                	() => {store.toggleCreateAccountPane()}
			                }>
			                <div className="instructions">
			                	<CreateAccount/><br/>
							</div><br/>
			            </SlidingPane>
		const header = <div className="header">
							<div>
								<span className="title">Juggledex</span><span className="version"> v1.31 Beta</span>
						    </div>
						    <div>
						    	<button className="headerButton" onClick={() => this.openSlidingPane('isInstructionsPaneOpen')}>About</button>
							     {authStore.user ? 
							        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
							        <button className="headerButton" onClick={() => this.openSlidingPane('isLoginPaneOpen')}>Login</button>
							   	}
						    </div>
						</div>
		let popup = uiStore.editingPopupTrick ? null : 
						uiStore.popupFullScreen ? <PopupDemo 
													trickKey={uiStore.popupTrick.id}
													demoLocation="popup"
												  /> : <Popup/>
		return (
			<div
				touchMove={(e)=>{e.preventDefault()}} 
				className="main" 
				ref={ref => this.el = ref}>	            
	            {instructions}
	            {login}
	            {createAccount}
				{header}
				<MainTagsBar/>
				{!this.state.isInstructionsPaneOpen && !store.isLoginPaneOpen  && !store.isCreateAccountPaneOpen?
					<TrickList 
						myTricks={store.myTricks} 
						selectedList={uiStore.selectedList}
						selectedTrick={uiStore.selectedTrick}
					/> : null
				}
				{uiStore.showFilterDiv?<Filter/>: null}
				{popup}
				{uiStore.addingTrick ? <AddTrickForm/> : null}
			</div>
		);
	}
}
export default App;
