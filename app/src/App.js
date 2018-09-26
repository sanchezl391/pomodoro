import React, { Component } from 'react';
import './App.css';
import TimeArea from './TimeArea'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      break: {
        finalBreakMinutes: 5, 
        seconds: 0,
        breakClasses: {
          input: 'inputVisible',
          display: 'displayHidden',
          textarea: 'textAreaVisible',
          message: 'messageHidden'
        },
        message: 'a message will go here'
      },
      session: {
        finalSessionMinutes: 25,
        seconds: 0,
        sessionClasses: {
          input: 'inputVisible',
          display: 'displayHidden'
        }
      },
      btnClasses: 'btn startBtn'
    };

    this.setMessage = this.setMessage.bind(this);
  }

  render() {
    this.handleClick = this.handleClick.bind(this);
    let btnTxt = (this.state.btnClasses === 'btn startBtn') ? 'Start': 'Cancel';

    let html = 
      <div className="container">
        <TimeArea // Session
          setMinutes={this.setFinalSessionMinutes} 
          ctx={this} 
          seconds={this.state.session.seconds} 
          title='Session (minutes)'
          inputClasses={this.state.session.sessionClasses.input}
          displayClasses={this.state.session.sessionClasses.display}  
        />
        <div className="breakRow">
          <TimeArea // Break
            setMinutes={this.setFinalBreakMinutes} 
            ctx={this}
            seconds={this.state.break.seconds} 
            title='Break (minutes)'
            inputClasses={this.state.break.breakClasses.input}
            displayClasses={this.state.break.breakClasses.display}
          />
          <textarea 
            className={this.state.break.breakClasses.textarea}
            onChange={this.setMessage}
            name="" 
            id="" ></textarea>
          <div className={this.state.break.breakClasses.message}>
            {this.state.break.message}
          </div>
        </div>
        <div 
          className={this.state.btnClasses}
          onClick={this.handleClick}
        >
          {btnTxt}
        </div> 
      </div>
      ;
    return html;
  }

  handleClick(event){
    this.toggleState();
  }

  toggleState() {
    let showStartBtn = !(this.state.btnClasses === "btn startBtn");
    let seconds = this.state.session.seconds;

    if(!showStartBtn ) // timer will start
      this.timer = setInterval(() => this.decrementOneSecondFromSession(), 1000);
    else { 
      clearInterval(this.timer);
      seconds = 0;
    }

    // Update classes for display and input
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: 5, 
        seconds: prevState.break.seconds,
        breakClasses: {
          input: (showStartBtn) ? 'inputVisible' : 'inputHidden',
          display: (showStartBtn) ? 'displayHidden' : 'displayVisible',
          textarea: (showStartBtn) ? 'textAreaVisible' : 'textAreaHidden',
          message: (showStartBtn) ? 'messageHidden' : 'messageVisible'
        },
        message: prevState.break.message

      },
      session: {
        finalSessionMinutes: prevState.session.finalSessionMinutes,
        seconds: seconds,
        sessionClasses: {
          input: (showStartBtn) ? 'inputVisible' :'inputHidden',
          display: (showStartBtn) ? 'displayHidden' : 'displayVisible'
        }
      },
      btnClasses: (showStartBtn) ? "btn startBtn": "btn cancelBtn"
    }));
  }

  decrementOneSecondFromBreak() {
    let newSeconds = this.state.break.seconds - 1;
    if(this.state.break.seconds === 0){
      clearInterval(this.timer);
      newSeconds = 0;
      this.toggleState();
    }

    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: prevState.break.finalBreakMinutes, 
        seconds: newSeconds,
        breakClasses: prevState.break.breakClasses,
        message: prevState.break.message
      },
      session: prevState.session,
      btnClasses: prevState.btnClasses
    }));
  }

  decrementOneSecondFromSession() {
    let newSeconds = this.state.session.seconds - 1;
    if(this.state.session.seconds === 0){
      clearInterval(this.timer);
      newSeconds = 0;
      // Start Break Timer
      this.timer = setInterval(() => this.decrementOneSecondFromBreak(), 1000);
    }
    this.setState((prevState, props) => ({
      break: prevState.break,
      session: {
        finalBreakMinutes: prevState.session.finalBreakMinutes, 
        seconds: newSeconds,
        sessionClasses: prevState.session.sessionClasses
      },
      btnClasses: prevState.btnClasses
    }));
    console.log(this.state.session.seconds);
  }

  setMessage(event) {
    let message = event.target.value;
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: prevState.break.finalBreakMinutes,
        seconds: prevState.break.seconds,
        breakClasses: prevState.break.breakClasses,
        message: message
      },
      session: prevState.session,
      btnClasses: prevState.btnClasses
    }));
  }

  setFinalSessionMinutes(minutes) {
    this.setState((prevState, props) => ({
      break: prevState.break,
      session: {
        finalSessionMinutes: minutes,
        seconds: minutes * 60,
        sessionClasses: prevState.session.sessionClasses
      },
      btnClasses: prevState.btnClasses
    }));
  }
  setFinalBreakMinutes(minutes) {
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: minutes,
        seconds: minutes * 60,
        breakClasses: prevState.break.breakClasses,
        message: prevState.break.message
      },
      session: prevState.session,
      btnClasses: prevState.btnClasses
    }));
  }
}
  
export default App;
