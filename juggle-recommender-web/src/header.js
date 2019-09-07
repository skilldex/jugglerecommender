import React, {Component} from 'react';
import { observer } from "mobx-react"
import authStore from "./stores/authStore"
import hamburger from "./images/menu_icon.svg"
import "./header.css"
import uiStore from "./stores/uiStore"
import utilities from './utilities'
import MainTagsBar from "./mainTagsBar"
@observer
class Header extends Component {
	state={
	}

	clickMenuItem=(paneFlag)=>{
		if (uiStore.selectedTrick){
			const previoslySelected = document.getElementById(uiStore.selectedTrick+"listCard");
			previoslySelected.classList.toggle("expand");
			uiStore.selectTrick(null)
		}
		if(uiStore.showExpandedMenu){		
			uiStore.toggleExpandedMenu()
		}
		utilities.sendGA('header',paneFlag)	
		if(paneFlag === "addpattern" ||
			paneFlag === "logout" ||
			paneFlag === "home" ||
			paneFlag === "tricklist" ||
			paneFlag === "stats" ||
			paneFlag === "profile")
		{
			if (paneFlag === "addpattern" &&
				!authStore.user){
					window.alert("You must be signed in to add a trick");
				}else{
					utilities.openPage(paneFlag, true)
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
    titleClicked=()=>{
		utilities.openPage('home',true)
		utilities.sendGA('title','clicked')	
    }
    render(){
    	const expandMenu = uiStore.showExpandedMenu ? 
						<div className="expandedMenu"
						     onMouseEnter = {()=>this.mouseEnterExpandedMenu()}
				             onMouseLeave = {()=>this.mouseLeaveExpandedMenu()}
						>
							<button className="dropDownButton" 
									onClick={()=> this.clickMenuItem('home')}>
										Home
							</button>
							<button className="dropDownButton" 
									onClick={()=> this.clickMenuItem('tricklist')}>
										Pattern List
							</button>
					        {authStore.user ?
						        <button className="dropDownButton" 
						        		onClick={()=> this.clickMenuItem('logout')}>
						        			Logout
						        </button>
						        :
						        <button className="dropDownButton" 
						        		onClick={() => this.clickMenuItem('isLoginPaneOpen')}>
						        			Login
						        </button>
						   	}
						   	<button className="dropDownButton" 
						   			onClick={() => this.clickMenuItem('stats')}>
						   				Stats
						   	</button>
						   	{authStore.user ? 
						   		<button className="dropDownButton"  
						   				onClick={() => this.clickMenuItem('profile')}>
						   					Profile
						   		</button>
						   		:null
					      	}
					      	<button className="dropDownButton"  
					      			onClick={() => this.clickMenuItem('addpattern')}>
					      				Add Pattern
					      	</button>
					        <button className="dropDownButton" 
					        		onClick={() => this.clickMenuItem('isInstructionsPaneOpen')}>
					        			About
					        </button>
					    </div> 
					    : null
        return (   
        		<div>
	                <div className="header">
						<div >
							<label className="title" 
									onClick={() => this.titleClicked()}>
										Juggledex
							</label>
							<span className="version">v2.34</span>
					    </div>
					    <img className="hamburger" 
					    	alt='' 
					    	onClick={() => uiStore.toggleExpandedMenu()} 
					    	src={hamburger}
					    />
					    
					    <div className="fullHeader">
						    {authStore.user ? 
						        <button className="headerButton" onClick={()=> this.clickMenuItem('logout')}>Logout</button>:
						        <button className="headerButton" onClick={() => this.clickMenuItem('isLoginPaneOpen')}>Login</button>
						   	}
					    	<button className="headerButton" onClick={() => this.clickMenuItem('isInstructionsPaneOpen')}>About</button>
					    	<button className="headerButton"  onClick={() => this.clickMenuItem('stats')}>Stats</button>
					    	{authStore.user ? 
					    		<button className="headerButton"  onClick={() => this.clickMenuItem('profile')}>Profile</button>:null
					    	}
					    	<button className="headerButton"  onClick={() => this.clickMenuItem('addpattern')}>Add Pattern</button>
							<button className="headerButton" onClick={()=> this.clickMenuItem('tricklist')}>Pattern List</button>
							<button className="headerButton" onClick={()=> this.clickMenuItem('home')}>Home</button>
					    </div>
					</div>
					{expandMenu}
					<MainTagsBar/>
				</div>
            )
    }

}
export default Header
