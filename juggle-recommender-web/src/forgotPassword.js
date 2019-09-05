import React, {Component} from 'react';
import authStore from "./stores/authStore"
import "./App.css"

class ForgotPassword extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : "",
        email : "",
    }
    
    getPassword=()=>{        
        let emailIsInvalid = true
        authStore.forgotPassword(this.state.email).then((response)=>{
            if(response.message){
                this.setState({
                    error : response.message
                })
            }else{
                emailIsInvalid = false
                alert("An email with instructions to reset your password has been sent.")
            }
        }) 
        if(emailIsInvalid){
            alert("No user found with that email address.")
        }
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
