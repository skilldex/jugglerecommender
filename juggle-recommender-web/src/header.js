import React, {Component} from 'react';
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import hamburger from "./images/menu_icon.svg"
import "./header.css"
import uiStore from "./stores/uiStore"
@observer
class Header extends Component {
	state={
	}

	clickMenuItem=(paneFlag)=>{
		uiStore.toggleExpandedMenu()
		if(paneFlag == "addPattern"){
			uiStore.toggleAddingTrick()
			uiStore.setShowHomeScreen(false)
			uiStore.setShowExpandedMenu(false)
		}else if(paneFlag == "logout"){
			authStore.signOut()
			uiStore.setShowHomeScreen(false)
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
			uiStore.setShowExpandedMenu(false)
		}else if(paneFlag == "home"){
			uiStore.setShowHomeScreen(true)
			uiStore.setDetailTrick(null)
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
			uiStore.setShowExpandedMenu(false)
		}else if(paneFlag == "list"){
			 uiStore.setShowHomeScreen(false)
			if(uiStore.addingTrick){
			 	uiStore.toggleAddingTrick
			}
			uiStore.setShowExpandedMenu(false)
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
						        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
						        <button className="headerButton" onClick={() => this.props.openSlidingPane('isLoginPaneOpen')}>Login</button>
						   	}
					    	<button className="headerButton" onClick={() => this.props.openSlidingPane('isInstructionsPaneOpen')}>About</button>
					    	<button className="headerButton"  onClick={() => uiStore.toggleAddingTrick()}>Add Pattern</button>
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
