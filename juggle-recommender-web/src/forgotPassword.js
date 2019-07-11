import React, {Component} from 'react';
import authStore from "./stores/authStore"
import store from './stores/store'
import "./App.css"
import firebase from 'firebase' 

class ForgotPassword extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : "",
        email : "",
    }


    getPassword=()=>{        
        console.log('forgot password',this.state.email)
        authStore.forgotPassword(this.state.email).then((response)=>{
            console.log(response)
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        }) 
    }

    emailInputChange=(e)=>{
        this.setState({email : e.target.value})
    }

    render(){
        return (   
                <div className="auth">                    
                    <label>email</label><br/><input type="email" className="inputStyle" onChange={this.emailInputChange}/><br/>
                    <button className="authButton" onClick={this.getPassword}>Submit</button>
                    <div style={{color : "red"}}>{this.state.error}</div><br/>
                </div>
                )
            }

}
export default ForgotPassword
