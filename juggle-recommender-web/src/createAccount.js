import React, {Component} from 'react';
import authStore from "./authStore"
import store from './store'
import "./App.css"
import firebase from 'firebase' 

class CreateAccount extends Component {
    // public ui = new firebaseui.auth.AuthUI(firebase.auth());
    state= {
        error : "",
        email : "",
        username : "",
        password : "",
    }


    signIn=()=>{        
        console.log('inCreateUsername',this.state.username)
        authStore.loginUser(this.state.username, this.state.password).then((response)=>{
            if(response.message){
                this.setState({
                    error : response.message
                })
            }
        }) 
    }

    createAccount=()=>{
        authStore.registerUser(this.state.email,this.state.password, this.state.username).then((response)=>{
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
                alert("User " + this.state.username + " created")
                store.toggleCreateAccountPane()
                this.signIn()
            }
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
        return (   
                <div className="auth">                    
                    <label>user handle</label><br/><input className="inputStyle" onChange={this.usernameInputChange}/><br/>
                    <label>email</label><br/><input className="inputStyle" onChange={this.emailInputChange}/><br/>
                    <label>password</label><br/><input type="password" className="inputStyle" onChange={this.passwordInputChange}/><br/>
                    <button className="authButton" onClick={this.createAccount}>Submit</button>
                    <div style={{color : "red"}}>{this.state.error}</div><br/>
                </div>
                )
            }

}
export default CreateAccount
