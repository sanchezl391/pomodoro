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
          display: 'displayHidden'
        }
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
          title='Session'
          inputClasses={this.state.session.sessionClasses.input}
          displayClasses={this.state.session.sessionClasses.display}  
        />
        <TimeArea // Break
          setMinutes={this.setFinalBreakMinutes} 
          ctx={this}
          seconds={this.state.break.seconds} 
          title='Break'
          inputClasses={this.state.break.breakClasses.input}
          displayClasses={this.state.break.breakClasses.display}
        />
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
    let showStartBtn = !(this.state.btnClasses === "btn startBtn");

    // Update classes for display and input
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: 5, 
        seconds: prevState.break.seconds,
        breakClasses: {
          input: (showStartBtn) ? 'inputVisible' : 'inputHidden',
          display: (showStartBtn) ? 'displayHidden' : 'displayVisible'
        }
      },
      session: {
        finalSessionMinutes: prevState.session.finalSessionMinutes,
        seconds: prevState.session.seconds,
        sessionClasses: {
          input: (showStartBtn) ? 'inputVisible' :'inputHidden',
          display: (showStartBtn) ? 'displayHidden' : 'displayVisible'
        }
      },
      btnClasses: (showStartBtn) ? "btn startBtn": "btn cancelBtn"
    }));
    
    if(!showStartBtn) // timer will start
      this.timer = setInterval(() => this.decrementOneSecondFromSession(), 1000);
    else 
      clearInterval(this.timer);
  }

  decrementOneSecondFromBreak() {
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: prevState.break.finalBreakMinutes, 
        seconds: prevState.break.seconds--,
        breakClasses: prevState.break.breakClasses
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
        breakClasses: prevState.break.breakClasses
      },
      session: prevState.session,
      btnClasses: prevState.btnClasses
    }));
  }
}
  
export default App;
