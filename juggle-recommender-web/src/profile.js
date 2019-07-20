import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import filterStore from "./stores/filterStore"
import "./profile.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import shareIcon from './images/shareIcon.png'
import Demo from './demo'
import ReactGA from 'react-ga';


@observer
class Profile extends Component {
	state={
		
	}
	componentDidMount(){

		console.log('profile mounted')
		 
	}
    copyContributorURL=()=>{
      const textField = document.createElement('textarea')
      const url = window.location.origin + "/?contributor=" + authStore.user.username +",&"
      textField.innerText = url
      document.body.appendChild(textField)
      var range = document.createRange();  
      range.selectNode(textField);  
      window.getSelection().addRange(range);  
      textField.select()
      document.execCommand('copy')
      textField.remove()

      alert("Link for your contributed tricks copied to clipboard\n" + url)
    }


	render (){
        const shareButton = authStore.user ? <img 
                         className="shareButton"
                         src={shareIcon}
                         onClick={this.copyContributorURL}
                         alt=""
                         title="share your contributed tricks"
                    /> : null
		return(
			<div className = "profileOuterDiv">
				{shareButton}
				<h3 style={{marginBottom: "10px"}}>Profile</h3>		

			</div>
		)
	}
}
export default Profile

