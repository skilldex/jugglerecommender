import React, {Component} from 'react';
import { observer } from "mobx-react"
import './App.css';
import TrickList from './trickList.js'
import Detail from './detail.js'
import store from './stores/store'
import uiStore from './stores/uiStore'
import authStore from './stores/authStore.js'
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import firebase from 'firebase' 
import AddTrickForm from './addTrickForm'
import HomeScreen from './homeScreen'
import Login from "./login"
import CreateAccount from "./createAccount"
import ForgotPassword from "./forgotPassword"
import Header from "./header"
import Stats from "./stats"
import Profile from "./profile"
import ReactGA from 'react-ga'
import Filter from './filter'
import { withRouter, Router } from 'react-router-dom';
import history from "./history"
import utilities from './utilities'

const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  if(location.state && location.state.detail != uiStore.detailTrick){
  	utilities.openPage('detail/'+location.state.detail,false)
  }else if(location.pathname.includes("/detail/")){
  	const trickKey = location.pathname.split("/detail/")[1].split('/modignore')[0]
  	if(trickKey){
	  	utilities.openPage('detail/'+trickKey,false)
	  }
  }
  if(uiStore.addingTrick){
	uiStore.toggleAddingTrick()
  }

  if(location.pathname.includes("/home") || 
  				location.pathname == "/" ||
  				location.pathname == "/modignore"){
  	utilities.openPage('home', false)
  }
  if(location.pathname.includes("/tricklist")){
  	utilities.openPage('tricklist', false)
  } 
  if(location.pathname.includes("/stats")){
	utilities.openPage('stats', false)
  }  
  if(location.pathname.includes("/profile")){
  	utilities.openPage('profile', false)
  } 
  if(location.pathname.includes("/addpattern")){
  	utilities.openPage('addpattern', false)
  }  

});

let firebaseConfig = {}
if(store.isLocalHost){
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
	ReactGA.initialize('UA-140392015-1');
	ReactGA.pageview(window.location.pathname + window.location.search);
	
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
//loaded with a shared URL
if (window.location.href.includes("/contributor/")){
	const contributor = window.location.href.split("/contributor/")[1]
	const newPathName = window.location.href.split("/contributor/")[0]
	window.location.href = newPathName + '/tricklist/filter/contributor=' + contributor
}
if (window.location.href.includes("/filter/")){
	uiStore.setShowHomeScreen(false)
	if(!window.location.href.includes("/tricklist/")){
		window.location.href = window.location.origin+'/tricklist/filter/'+
								window.location.href.split("/filter/")[1]
	}
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
 		isCreateAccountPaneOpen: false,
 		isForgotPasswordPaneOpen : false,
	}
	_handleKeyDown = (event) => {
	    switch( event.keyCode ) {
	        case ESCAPE_KEY:
	            if (uiStore.addingTrick){
	            	uiStore.toggleAddingTrick()
					uiStore.handleBackButtonClick()
	            }
	            break;
	        default: 
	            break;
	    }
	}
	componentDidMount(){
		const date = new Date()
		store.setStartTime(date.getTime())
		document.addEventListener("keydown", this._handleKeyDown);
		store.getSavedTricks()	
		Modal.setAppElement(this.el);
		firebase.auth().onAuthStateChanged(function(user) {
			console.log("user check" ,user)
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
		this.setPageBasedOnUrl()
		store.getTagsFromDatabase()
		store.getUserCountFromDatabase()
		store.getRegisteredUserCountFromDatabase()
		store.getTotalCatchCountFromDatabase()
		utilities.addModIgnoreToURL()

		
	}




	setPageBasedOnUrl=()=>{
		store.getLibraryFromDatabase().then(()=>{
			const locationPathname = window.location.pathname.split('/modignore')[0]
			if(locationPathname.includes("detail")){
			  	let match = locationPathname.match('/detail\/(.+)')
			  	let trickKey = 'error'
			  	if(match.length>0){
				  	trickKey = match[1].replace(/%20/g, ' ')
				}
			  	if (store.library[trickKey]){
			  		utilities.openPage('detail/'+trickKey,false)
				}else{
					alert("There is no page for that trick.")
					utilities.openPage('home',false)
				}
			}
			if(window.location.pathname.includes("home")){
				utilities.openPage('home',false)
			}
			if(window.location.pathname.includes("tricklist")){
				utilities.openPage('tricklist',false)
			} 
			if(window.location.pathname.includes("stats")){
				utilities.openPage('stats',false)
			}  
		    if(window.location.pathname.includes("profile") && authStore.user){
			    if (authStore.user){
			    	utilities.openPage('profile',true)
				}else{
					utilities.openPage('home',true)
				}
			}
		  	if(window.location.pathname.includes("addpattern")){
			    if (authStore.user){
			    	utilities.openPage('addpattern',true)
		  		}else{
		  			utilities.openPage('home',true)
				}
			}  	
		})
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
	 		this.setState({ 'isInstructionsPaneOpen': true })
	 	}else if(paneName === 'isCreateAccountPaneOpen'){
	 		this.setState({ 'isCreateAccountPaneOpen': true })
	 	}else if(paneName === 'isForgotPasswordPaneOpen'){
	 		store.toggleForgotPasswordPane()
	 	}
 	}

 	render(){
	    window.onclick = function(event) {
	        if (uiStore.showSortDiv && !uiStore.mouseInSortDiv && !uiStore.sortTimer){
	            uiStore.setShowSortDiv(false)
	        }
	        if (uiStore.showExpandedMenu && 
	        	!uiStore.mouseInExpandedMenu && !uiStore.expandedMenuTimer){
	            uiStore.setShowExpandedMenu(false)
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
										<label className="aboutInfo">
											Skilldex is an online community where you can learn, 
											share, and organize skills, as well as keep track of
											your progress. This particular version of skilldex
											is Juggledex, and is currently the only one in
											existence. Let us know if you have interest in a
											skilldex for another skill!
										</label>
									<br/>
				                	<h2>Pattern List</h2>
									<span className="aboutInfo">
										In the pattern list you are able to search, sort and filter.
										Each pattern's card has a blue arrow on the left that can be 
										used to	expand the card to see the pattern demonstrated. Clicking
										anywhere else on the card will take you to it's detail page
										where more information can be seen.
									</span>
									<br/>
				                	<h2>Details Page</h2>
									<span className="aboutInfo">
										On a pattern's detail page you have all the information
										about the pattern. In addition to information you have the
										ability to comment on it, and suggest other tricks that
										are prereqs, postreqs, or related to it, as well as cast your 
										on how relevant you think the current suggestions are.
									</span>
									<br/>
				                	<h2>Random Trick</h2>
									<span className="aboutInfo">
										The 'Random Trick' button is the pink box located in the upper right 
										corner. It takes the catches and flair that you have set for each 
										pattern into account when determining which pattern to give you. You
										limit the patterns it chooses from with the search/filter bar.
									</span>
									<br/>									
				                	<h2>Add Pattern</h2>
									<span className="aboutInfo">
										The 'Add Pattern' form can be used to contribute patterns to the community.
										Some fields are required, and others are optional. As the contributor
										of a pattern you have the ability to edit it on from inside the
										details page by clicking the edit button in the upper right corner.
										If the name of the pattern you are contributing is a valdid siteswap, 
										hen an animation of the pattern will automatically be generated by
										<a target="_" href="http://www.jugglinglab.com">jugglinglab.com</a>.
									</span>
									<br/>
				                	<h2>Special Thanks</h2>
									<span className="aboutInfo">
										We would like to thank all the wonderful jugglers who have contributed
										to the site, as well as <a target="_" href="http://www.libraryofjuggling.com">libraryofjuggling.com</a> from where the site
										was originally seeded, and <a target="_" href="http://www.jugglinglab.com">jugglinglab.com</a>
										for their animations.
									</span>
									<br/>
									<h2>Contact</h2>
									<div className="aboutInfo" >
										<a target="_" href="hwww.instagram.com/skilldex.app/">www.instagram.com/skilldex.app/</a>
										<a target="_" href="mailto:skilldex.feedback@gmail.com">skilldex.feedback@gmail.com</a>
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
		const forgotPassword = <SlidingPane
					                className='some-custom-class'
					                overlayClassName='some-custom-overlay-class'
					                isOpen={ store.isForgotPasswordPaneOpen }
					                title='Forgot Password'
					                onRequestClose={ 
					                	() => {store.toggleForgotPasswordPane()}
					                }>
					                <div className="instructions">
					                	<ForgotPassword/><br/>
									</div><br/>
					            </SlidingPane>
		const detail = uiStore.editingDetailTrick ? null : 
						uiStore.detailTrick ? <Detail trick={uiStore.detailTrick}/> : null

		return (
			<div
				className="main" 
				ref={ref => this.el = ref}>            
	            {instructions}
	            {login}
	            {createAccount}
	            {forgotPassword}
				<Header openSlidingPane={this.openSlidingPane}/>
				{!this.state.isInstructionsPaneOpen && 
					!store.isLoginPaneOpen  && 
					!store.isCreateAccountPaneOpen && 
					!uiStore.showHomeScreen &&
					!uiStore.showStatsScreen &&
					!uiStore.showProfileScreen &&
					uiStore.detailTrick == null ?
						<div className="trickListDiv">
							<TrickList 
								tricksToList = {uiStore.rootTricks}
								listType = "main"
							/>
						</div>
					 : null
				}
				{uiStore.showProfileScreen?<Profile/>: null}
				{uiStore.showStatsScreen?<Stats/>: null}
				
				{uiStore.showHomeScreen && !uiStore.detailTrick ? <HomeScreen/> : null}	
				{detail}
				
				{uiStore.showFilterDiv?<Filter/>: null}
				{uiStore.addingTrick ? <AddTrickForm/> : null}
			</div>
		);
	}
}
export default App;
