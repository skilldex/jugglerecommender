import React, {Component} from 'react';
import firebase from 'firebase' 
import store from "./store"
import authStore from "./authStore"
import "./App.css"
import "./auth.css";
 // Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyA_3_UUnQ0iII4jblL4Nf6OLALpH1AbaKQ",
authDomain: "skilldex-dev-6c0ff.firebaseapp.com",
databaseURL: "https://skilldex-dev-6c0ff.firebaseio.com",
projectId: "skilldex-dev-6c0ff",
storageBucket: "skilldex-dev-6c0ff.appspot.com",
messagingSenderId: "224766397892",
appId: "1:224766397892:web:80beef32563065c3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

class Auth extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : ""
    }
    componentDidMount() {
        
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("user auth changed", user)
            authStore.setUser({username : user.email})
          } 
        });

        
    }

    SignOut() {
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                window.sessionStorage.clear()
                resolve("signed out")
            });
        })
    }
    signIn=()=>{        
        this.LoginUser(this.state.username, this.state.password).then((response)=>{
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        }) 
    }
    LoginUser(username, pass) {
        console.log("logging user", username, pass)
        return new Promise(resolve => {
            firebase.auth().signInWithEmailAndPassword(username, pass).then(data => {
                authStore.setUser({"username": username})
                resolve("success")
            }).catch(error=>{
                resolve(error)
            });
        });
    }
    createAccount=()=>{
        this.RegisterUser(this.state.username,this.state.password).then((response)=>{
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
    RegisterUser(user, pass) {        
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
                    {
                        authStore.user ? 
                            <div>Signed in as {authStore.user.username}</div> : 
                            <div>
                                <input style={inputStyle} onChange={this.userInputChange}/><label>email</label>
                                <br/>
                                <input type="password" style={inputStyle} onChange={this.passwordInputChange}/><label>password</label>
                                <br/>
                                <div style={{color : "red"}}>{this.state.error}</div>
                                <button className="authButton" onClick={this.createAccount}>Create Account</button>
                                <button className="authButton"  onClick={this.signIn}>Sign In</button>
                            </div>
                    }
                </div>
            )
    }

}
export default Auth
