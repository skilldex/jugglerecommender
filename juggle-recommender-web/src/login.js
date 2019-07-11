import React, {Component} from 'react';
import authStore from "./stores/authStore"
import store from './stores/store'
import "./App.css"
import "./auth.css"; 

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
            }else{
                alert("Signed in as " + this.state.username)
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
        return (   
                <div className="auth">                    
                    {authStore.user ? 
                        <div>
                            <label>Signed in as {authStore.user.username}</label><br/>
                            <button className="authButton"  onClick={authStore.signOut}>Sign Out</button>
                        </div> : 
                        <div>
                            <label>user handle</label><br/><input className="inputStyle" onChange={this.usernameInputChange}/><br/>
                            <br/>
                            <label>password</label><br/><input type="password" className="inputStyle" onChange={this.passwordInputChange}/>
                            <br/>
                            <div style={{color : "red"}}>{this.state.error}</div>
                            <br/>
                            <button className="authButton"  onClick={this.signIn}>Sign In</button><br/>
                            Don't have an account yet? <button className="textLink" onClick={store.toggleCreateAccountPane}>Create Account</button><br/><br/>
                            Forgot Password? <button className="textLink" onClick={store.toggleForgotPasswordPane}>Reset Password</button>
                        </div>
                    }
                </div>
            )
    }

}
export default Login
