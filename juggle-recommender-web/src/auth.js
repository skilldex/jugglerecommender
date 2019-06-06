import React, {Component} from 'react';
import authStore from "./authStore"
import store from './store'
import "./App.css"
import "./auth.css";
import firebase from 'firebase' 

class Auth extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : "",
        email : "",
        username : "",
        password : ""
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
        const usersRef = firebase.database().ref('users/').orderByChild('username').equalTo(username)
        let user
        return new Promise(resolve => {
            usersRef.on("value", resp =>{
                user = store.snapshotToArray(resp)[0]
                firebase.auth().signInWithEmailAndPassword(user.email, pass).then(data => {
                    authStore.setUser({"email": user.email,"username" : user.username})
                    store.setIsLoginPaneOpen(false)
                    resolve("success")
                }).catch(error=>{
                    resolve(error)
                });
            }) 
        });
    }
    createAccount=()=>{
        this.registerUser(this.state.email,this.state.password).then((response)=>{
            console.log("user registered")
            if(response.message){
                this.setState({
                    error : response.message
                })
            }else{
                const myTricksRef = firebase.database().ref('myTricks/')
                let newData = myTricksRef.push();
                newData.set({"username": this.state.username, "myTricks" : []});
                const usersRef = firebase.database().ref('users/')
                let newUser= usersRef.push();
                newUser.set({"username": this.state.username, "email" : this.state.email});
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
    emailInputChange=(e)=>{
        this.setState({email : e.target.value})
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
                            <label>userasdfasdfasd handle</label><br/><input style={inputStyle} onChange={this.usernameInputChange}/>
                            <br/>
                            <label>email</label><br/><input style={inputStyle} onChange={this.emailInputChange}/>
                            <br/>
                            <label>passwasdfrd</label><br/><input type="password" style={inputStyle} onChange={this.passwordInputChange}/>
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
