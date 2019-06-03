import React, {Component} from 'react';
import authStore from "./authStore"
import store from './store'
import "./App.css"
import "./auth.css";
import firebase from 'firebase' 

class Auth extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : ""
    }


    signIn=()=>{        
        this.loginUser(this.state.username, this.state.password).then((response)=>{
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        }) 
    }
    loginUser(username, pass) {
        console.log("logging user", username, pass)
        return new Promise(resolve => {
            firebase.auth().signInWithEmailAndPassword(username, pass).then(data => {
                authStore.setUser({"username": username})
                resolve("success")
                store.setIsLoginPaneOpen(false)
            }).catch(error=>{
                resolve(error)
            });
        });
    }
    createAccount=()=>{
        this.registerUser(this.state.username,this.state.password).then((response)=>{
            console.log("user registered")
            if(response.message){
                this.setState({
                    error : response.message
                })
            }else{
                const myTricksRef = firebase.database().ref('myTricks/')
                let newData = myTricksRef.push();
                newData.set({"username": this.state.username, "myTricks" : []});
                this.signIn()
            }
        })
    }
    registerUser(user, pass) {        
        return new Promise(resolve => {
            firebase.auth().createUserWithEmailAndPassword(user, pass).then(data =>{
                resolve("user created")
            }).catch(function (error) {
                resolve(error)
            });
        })
    }
    userInputChange=(e)=>{
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
                            <label>email</label><br/><input style={inputStyle} onChange={this.userInputChange}/>
                            <br/>
                            <label>password</label><br/><input type="password" style={inputStyle} onChange={this.passwordInputChange}/>
                            <br/>
                            <div style={{color : "red"}}>{this.state.error}</div>
                            <br/>
                            <button className="authButton" onClick={this.createAccount}>Create Account</button>
                            <button className="authButton"  onClick={this.signIn}>Sign In</button>
                        </div>
                    }
                </div>
            )
    }

}
export default Auth
