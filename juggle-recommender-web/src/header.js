import React, {Component} from 'react';
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import hamburger from "./images/menu_icon.svg"
import "./header.css"
import uiStore from "./stores/uiStore"
import ReactGA from 'react-ga';
import store from "./stores/store"
@observer
class Header extends Component {
	state={
	}

	clickMenuItem=(paneFlag)=>{
		uiStore.toggleExpandedMenu()
		if(!store.isLocalHost){
			ReactGA.event({
				  category: 'header',
				  action: paneFlag,
			});
		}
		
		if(paneFlag == "addPattern"){
			uiStore.clearUI()
			uiStore.toggleAddingTrick()
		}else if(paneFlag == "logout"){
			authStore.signOut()
			uiStore.clearUI()
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
			
		}else if(paneFlag == "home"){
			uiStore.clearUI()
			uiStore.setShowHomeScreen(true)
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
			
		}else if(paneFlag == "list"){
			uiStore.clearUI()
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
		}else if(paneFlag == "stats"){
			uiStore.clearUI()
			uiStore.setShowStatsScreen(true)
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
		}else{
			this.props.openSlidingPane(paneFlag)
			uiStore.setShowExpandedMenu(false)
		}
	}
	mouseEnterExpandedMenu=()=>{
      uiStore.setMouseInExpandedMenu(true)
    }

    mouseLeaveExpandedMenu=()=>{
      uiStore.setMouseInExpandedMenu(false)
    }
    render(){
    	const expandMenu = uiStore.showExpandedMenu ? 
						<div className="expandedMenu"
						     onMouseEnter = {()=>this.mouseEnterExpandedMenu()}
				             onMouseLeave = {()=>this.mouseLeaveExpandedMenu()}
						>
							<button className="dropDownButton" onClick={()=> this.clickMenuItem('home')}>Home</button>
							<button className="dropDownButton" onClick={()=> this.clickMenuItem('list')}>Pattern List</button>
					        {authStore.user ?
						        <button className="dropDownButton" onClick={()=> this.clickMenuItem('logout')}>Logout</button>:
						        <button className="dropDownButton" onClick={() => this.clickMenuItem('isLoginPaneOpen')}>Login</button>
						   	}
						   	<button className="dropDownButton"  onClick={() => this.clickMenuItem('stats')}>Stats</button>
					      	<button className="dropDownButton"  onClick={() => this.clickMenuItem('addPattern')}>Add Pattern</button>
					        <button className="dropDownButton"  onClick={() => this.clickMenuItem('isInstructionsPaneOpen')}>About</button>
					    </div> : null
        return (   
        		<div>
	                <div className="header">
						<div >
							<span className="title">Juggledex</span><span className="version">v1.6</span>
					    </div>
					    <img className="hamburger" onClick={() => uiStore.toggleExpandedMenu()} src={hamburger}/>
					    
					    <div className="fullHeader">
						    {authStore.user ? 
						        <button className="headerButton" onClick={()=> this.clickMenuItem('logout')}>Logout</button>:
						        <button className="headerButton" onClick={() => this.clickMenuItem('isLoginPaneOpen')}>Login</button>
						   	}
					    	<button className="headerButton" onClick={() => this.clickMenuItem('isInstructionsPaneOpen')}>About</button>
					    	<button className="headerButton"  onClick={() => this.clickMenuItem('stats')}>Stats</button>
					    	<button className="headerButton"  onClick={() => this.clickMenuItem('addPattern')}>Add Pattern</button>
							<button className="headerButton" onClick={()=> this.clickMenuItem('list')}>Pattern List</button>
							<button className="headerButton" onClick={()=> this.clickMenuItem('home')}>Home</button>
					    </div>
					</div>
					{expandMenu}
				</div>
            )
    }

}
export default Header
