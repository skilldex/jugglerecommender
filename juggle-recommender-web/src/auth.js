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
        loggedIn : false,
        email:"",
        id:"",
        user: null,
        username : "",
        error : ""
    }
    componentDidMount() {
        if(window.sessionStorage.getItem('user')){
            this.state.email =  window.sessionStorage.getItem('email')
            this.state.user = JSON.parse(window.sessionStorage.getItem('user'))
            this.state.username = JSON.parse(window.sessionStorage.getItem('username'))
            this.state.loggedIn = true
        }
    }
    getUserByEmail=(email)=>{
        return {
            'name': 'bollocks'
        }
    }
    RefreshUser(){
        if(this.state.loggedIn){
            return new Promise(resolve => {
                this.getUserByEmail(this.state.email).then(user=>{
                    console.log("got user")
                    /*this.state.id = user["key"]
                    this.state.user = user
                    window.sessionStorage.setItem('email',user["email"]); // user is undefined if no user signed in
                    window.sessionStorage.setItem('user',JSON.stringify(user)); // user is undefined if no user signed in
                    window.sessionStorage.setItem('username',JSON.stringify(user["username"])); // user is undefined if no user signed in
                    */
                    resolve("got user be");
                })
            })
        }
    }
    ForgotPassword(email){
        
        return new Promise(resolve => {
            firebase.auth().sendPasswordResetEmail(email, this.state.actionCodeSettings).then(()=>{
                resolve("password reset email sent")
            })
        })
    }
    SignOut() {
        return new Promise(resolve => {
            firebase.auth().signOut().then(() => {
                window.sessionStorage.clear()
                this.state.loggedIn = false
                this.state.email = ""
                this.state.id = ""
                this.state.user = {}
                this.state.username = ""
                resolve("signed out")
            });
        })
    }
    signIn=()=>{
        this.LoginUser(this.state.username, this.state.password).then((response)=>{
            console.log("done logging in" , response)
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        })
    }
    LoginUser(user, pass) {
        window.sessionStorage.clear
        console.log("logging user", user, pass)
        return new Promise(resolve => {
            firebase.auth().signInWithEmailAndPassword(user, pass).then(data => {
                this.setState({
                    loggedIn: true,
                })
                authStore.setUser({"username": user})
                
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
        const inputStyle = {width: "180px", "margin-right" : "10px"}
        return (   
                <div className="auth">
                    {
                        this.state.loggedIn ? 
                            <div>Signed in as {this.state.username}</div> : 
                            <div>
                                <input style={inputStyle} onChange={this.userInputChange} value={this.username}/><label>email</label>
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
