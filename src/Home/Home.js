import React, { Component } from 'react';
import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../textFonts.css'
import bcrypt from 'bcryptjs';
import ProtectedHome from '../ProtectedHome/ProtectedHome';

/**
 * This component is the register/login page
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state= {
      signInState: true,
      authenticated: false,
      username: '',
      successMessage: ' '
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  render() {
    let { signInState, authenticated } = this.state;
    let signInBtnClasses = (signInState) ? 'signInBtn active' : 'signInBtn';
    let signUpBtnClasses = (!signInState) ? 'signUpBtn active' : 'signUpBtn';
    let submitBtnText = (signInState) ? 'LOGIN' : 'REGISTER';

    if ( authenticated )
      return <ProtectedHome 
            logoutUser={this.logoutUser}
            ctx={this} 
            username={ this.state.username }/>;
    else
      return <div className="homeContainer">
        <div className="centeredContainer">
          <div className="ubuntu subheader actionContainers">
            <p 
              className={signInBtnClasses}
              onClick={ () => this.handleSignInModeClicked() }
              >SIGN IN
            </p>
            <p 
              className={signUpBtnClasses}
              onClick={ () => this.handleSignUpModeClicked() }
              >SIGN UP
            </p>
          </div>
          <div className='regularText ubuntu successMessage'>{this.state.successMessage}</div>
          <div className="inputContainer">
            <form 
              onSubmit={this.handleSubmit} 
              id="login-form">
              <div className="username">
                <p className='regularText'><FontAwesomeIcon icon='user-alt'/></p>
                <input 
                  className='regularText ubuntu' 
                  type="text" 
                  minLength={1} 
                  placeholder='Username'
                  required="required"
                  name='username'/>
              </div>
              <div className="password">
                <p className='regularText'><FontAwesomeIcon icon='lock'/></p>
                <input 
                  className='regularText ubuntu' 
                  type="password" 
                  minLength={1} 
                  placeholder='Password'
                  required="required"
                  name='password'/>
              </div>
              <button className='regularText ubuntu' type="submit">{submitBtnText}</button>
            </form>
          </div>
        </div>
      </div>;
  }

  /**
   * Handles clicking on the the sign up button, which prepares the program to register a user
   */
  handleSignUpModeClicked() {
    this.setState((prevState, props) => ({
      signInState: false, 
      authenticated:prevState.authenticated, 
      username: prevState.username,
      successMessage: prevState.successMessage
    }))
  }

  /**
   * Handles clicking on the the sign in button, which prepares the program to login a user
   */
  handleSignInModeClicked() {
    this.setState((prevState, props) => ({
      signInState: true, 
      authenticated:prevState.authenticated, 
      username: prevState.username,
      successMessage: prevState.successMessage
    }))
  }

  /**
   * handles wether to login or register a user when submitting the form
   * @param e the event object 
   */
  handleSubmit (e) {
    e.preventDefault();
    let { signInState } = this.state;
    if(signInState)
      this.loginUser(e);
    else  
      this.registerUser(e);
  }

  /**
   * Registers a user 
   * @param e the event object
   */
  registerUser (e) {
    let inputData = e.target; // access with inputData.username.value
    // Hashing the pw
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(inputData.password.value, salt, function(err, hash){
        if(err) {
          console.log(err);
        } 
        else {
          fetch('https://task-focus-api.herokuapp.com/register/',{
            method: 'POST',
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }, 
            body: JSON.stringify({
              username: inputData.username.value,
              password: hash
            })    
          }).then( function(response) {
              return response.json();
            })
            .then(function (data) {
              if(data.success)
                this.setState((prevState, props) => ({
                  authenticated: true,
                  signInState: prevState.signInState,
                  username: inputData.username.value,
                  successMessage: prevState.successMessage
                }));
              else  
                this.setState((prevState, props) => ({
                  authenticated: false,
                  signInState: prevState.signInState,
                  username: prevState.username,
                  successMessage: 'Username already exists'
                }));
            }.bind(this))
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        }
      }.bind(this))       
    }.bind(this)); 
  }

  /**
   * Sets authenticated to false, which moves component back to this component
   */
  logoutUser() {
    this.setState((prevState, props) => ({
      authenticated: false,
      signInState: prevState.signInState,
      username: prevState.username,
      successMessage: ''
    }));
  }

  /**
   * Logins a user
   * @param e the event object
   */
  loginUser (e) {
    let inputData = e.target; // access with inputData.username.value
    let pw = inputData.password.value;

    fetch('https://task-focus-api.herokuapp.com/login/',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }, 
      body: JSON.stringify({
        username: inputData.username.value,
        password: pw
      })    
    }).then( function(response) { 
        if(response.status === 401) // Wrong Username or Password
          this.setState((prevState, props) => ({
            authenticated: false,
            signInState: prevState.signInState,
            username: prevState.username,
            successMessage: 'Incorrect username or password'
          }));
        else // Correct Username and password
          this.setState((prevState, props) => ({
            authenticated: true,
            signInState: prevState.signInState,
            username: inputData.username.value
          }));
      }.bind(this))
      .catch(function(err) {
        console.log(err);
      });
  }

}

export default Home;