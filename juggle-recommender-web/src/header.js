import React, {Component} from 'react';
import authStore from "./stores/authStore"
import hamburger from "./images/menu_icon.svg"
import "./header.css"
import uiStore from "./stores/uiStore"
class Header extends Component {
	state={
		expandMenu : false
	}
	toggleExpandMenu=()=>{
		this.setState({expandMenu : !this.state.expandMenu})
	}
	clickMenuItem=(paneFlag)=>{
		this.setState({expandMenu : !this.state.expandMenu})
		console.log(paneFlag)
		if(paneFlag == "addPattern"){
			uiStore.toggleAddingTrick()
		}else{
			this.props.openSlidingPane(paneFlag)
		}
	}
    render(){
    	const expandMenu = this.state.expandMenu ? 
						<div className="expandedMenu">
					        <button className="dropDownButton"  onClick={() => this.clickMenuItem('isInstructionsPaneOpen')}>About</button>
					        <button className="dropDownButton"  onClick={() => this.clickMenuItem('isLoginPaneOpen')}>Login</button>
					      	<button className="dropDownButton"  onClick={() => this.clickMenuItem('addPattern')}>Add Pattern</button>
					    </div> : null
        return (   
        		<div>
	                <div className="header">
						<div >
							<span className="title">Juggledex</span><span className="version"> v1.31 Beta</span>
					    </div>
					    <img className="hamburger" onClick={this.toggleExpandMenu} src={hamburger}/>
					    
					    <div className="fullHeader">
					    	<button className="headerButton" onClick={() => this.props.openSlidingPane('isInstructionsPaneOpen')}>About</button>
						     {authStore.user ? 
						        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
						        <button className="headerButton" onClick={() => this.props.openSlidingPane('isLoginPaneOpen')}>Login</button>
						   	}
					    </div>
					</div>
					{expandMenu}
				</div>
            )
    }

}
export default Header
