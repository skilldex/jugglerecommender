import React, {Component} from 'react';
import uiStore from "./stores/uiStore"
import "./homeScreen.css"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import authStore from "./stores/authStore"
import store from "./stores/store"
import { WithContext as ReactTags } from 'react-tag-input';
import utilities from './utilities'
import AutoComplete from './autoComplete'
import TrickList from './trickList.js'
import Demo from './demo'
import ReactGA from 'react-ga';

@observer
class Stats extends Component {

	render (){
		return(
			<div className = "homeOuterDiv">
				<h3 style={{marginBottom: "10px"}}>Stats</h3>
			</div>
		)
	}
}
export default Stats

