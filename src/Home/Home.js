import React, { Component } from 'react';
import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../textFonts.css'
import bcrypt from 'bcryptjs';
import ProtectedHome from '../ProtectedHome/ProtectedHome';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state= {
      signInState: true,
      authenticated: false,
      username: ''
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
      return <ProtectedHome username={ this.state.username }/>
    else
      return <div className="homeContainer">
        <div className="centeredContainer">
          <div className="ubuntu subheader actionContainers">
            <p 
              className={signInBtnClasses}
              onClick={
                () => 
                  this.setState({ signInState: true, authenticated: false, username: '' })}
              >SIGN IN
            </p>
            <p 
              className={signUpBtnClasses}
              onClick={() => this.setState({signInState: false, authenticated: false, username: ''})}
              >SIGN UP
            </p>
          </div>
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
                  type="text" 
                  minLength={1} 
                  placeholder='Password'
                  required="required"
                  name='password'/>
              </div>
              <button className='regularText' type="submit">{submitBtnText}</button>
            </form>
          </div>
        </div>
      </div>;
  }

  handleSubmit (e) {
    e.preventDefault();
    let { signInState } = this.state;
    if(signInState)
      this.loginUser(e);
    else  
      this.registerUser(e);
  }

  registerUser (e) {
    let inputData = e.target; // access with inputData.username.value
    // Hashing the pw
    
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(inputData.password.value, salt, function(err, hash){
        if(err) {
          console.log(err);
        } 
        else {
          fetch('http://localhost:3001/register/',{
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
                console.log('success');
              else  
                console.log('failure');
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        }
      })       
    }); 
  }

  logoutUser() {
    this.setState((prevState, props) => ({
      authenticated: false,
      signInState: prevState.signInState,
      username: prevState.username
    }));
  }

  loginUser (e) {
    let inputData = e.target; // access with inputData.username.value
    let pw = inputData.password.value;

    fetch('http://localhost:3001/login/',{
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
          console.log('There was an error logging in');
        else{ // Correct Username and password
          this.setState((prevState, props) => ({
            authenticated: true,
            signInState: prevState.signInState,
            username: inputData.username.value
          }));
        }
      }.bind(this))
      .catch(function(err) {
        console.log(err);
      });
  }

}

export default Home;