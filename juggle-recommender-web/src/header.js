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
		}else if(paneFlag == "logout"){
			 authStore.signOut()
		}else{
			this.props.openSlidingPane(paneFlag)
		}
	}
    render(){
    	const expandMenu = this.state.expandMenu ? 
						<div className="expandedMenu">
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
							<span className="title">Juggledex</span><span className="version"> v1.4 Beta</span>
					    </div>
					    <img className="hamburger" onClick={this.toggleExpandMenu} src={hamburger}/>
					    
					    <div className="fullHeader">
						    {authStore.user ? 
						        <button className="headerButton" onClick={authStore.signOut}>Logout</button>:
						        <button className="headerButton" onClick={() => this.props.openSlidingPane('isLoginPaneOpen')}>Login</button>

						   	}
					    	<button className="headerButton" onClick={() => this.props.openSlidingPane('isInstructionsPaneOpen')}>About</button>
					    	<button className="headerButton"  onClick={() => uiStore.toggleAddingTrick()}>Add Pattern</button>

					    </div>
					</div>
					{expandMenu}
				</div>
            )
    }

}
export default Header
