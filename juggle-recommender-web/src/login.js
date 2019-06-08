import React, {Component} from 'react';
import authStore from "./authStore"
import store from './store'
import "./App.css"
import "./auth.css";
import firebase from 'firebase' 

class Login extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : "",
        username : "",
        password : "",
    }


    signIn=()=>{        
        authStore.loginUser(this.state.username, this.state.password).then((response)=>{
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        }) 
    }

    usernameInputChange=(e)=>{
        this.setState({username : e.target.value})
    }
    passwordInputChange=(e)=>{
        this.setState({password : e.target.value})
    }
    render(){
        const inputStyle = {width: "180px", "marginRight" : "10px"}

        return (   
                <div className="auth">                    
                    {authStore.user ? 
                        <div>
                            <label>Signed in as {authStore.user.username}</label><br/>
                            <button className="authButton"  onClick={authStore.signOut}>Sign Out</button>
                        </div> : 
                        <div>
                            <label>user handle</label><br/><input style={inputStyle} onChange={this.usernameInputChange}/><br/>
                            <br/>
                            <label>password</label><br/><input type="password" style={inputStyle} onChange={this.passwordInputChange}/>
                            <br/>
                            <div style={{color : "red"}}>{this.state.error}</div>
                            <br/>
                            <button className="authButton"  onClick={this.signIn}>Sign In</button><br/>
                            Don't have an account yet? <button className="textLink" onClick={store.toggleCreateAccountPane}>Create Account</button>
                        </div>
                    }
                </div>
            )
    }

}
export default Login
