import React, { Component } from 'react';
import './App.css';
import TimeArea from './TimeArea'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionMinutes: 25, 
      breakMinutes: 5,
      breakClasses: {
        input: 'inputVisible',
        display: 'displayHidden'
      },
      sessionClasses: {
        input: 'inputVisible',
        display: 'displayHidden'
      },
      btnClasses: 'startBtn'
    };
  }

  render() {
    this.handleClick = this.handleClick.bind(this);

    let html = 
      <div className="container">
        <TimeArea // Session
          setMinutes={this.setSessionMinutes} 
          ctx={this} 
          minutes={this.state.sessionMinutes} 
          title='Session'
          inputClasses={this.state.sessionClasses.input}
          displayClasses={this.state.sessionClasses.display}  
        />
        <TimeArea // Break
          setMinutes={this.setBreakMinutes} 
          ctx={this} 
          minutes={this.state.breakMinutes} 
          title='Break'
          inputClasses={this.state.breakClasses.input}
          displayClasses={this.state.breakClasses.display}
        />
        <div 
          className={this.state.btn.classes}
          onClick={this.handleClick}
          >
            Start
        </div> 
      </div>
      ;
    return html;
  }

  handleClick(event){
    // Update classes for display and input
    this.setState((prevState, props) => ({
      sessionMinutes: prevState.sessionMinutes,
      breakMinutes: prevState.breakMinutes,
      breakClasses: {
        input: 'inputHidden',
        display: 'displayVisible'
      },
      sessionClasses: {
        input: 'inputHidden',
        display: 'displayVisible'
      },
      startBtn: ''
    }));
  }


  setSessionMinutes(minutes) {
    this.setState((prevState, props) => ({
      sessionMinutes: minutes,
      breakMinutes: prevState.breakMinutes,
      breakClasses: prevState.breakClasses,
      sessionClasses: prevState.sessionClasses
    }));
  }
  setBreakMinutes(minutes) {
    this.setState((prevState, props) => ({
      sessionMinutes: prevState.sessionMinutes,
      breakMinutes: minutes,
      breakClasses: prevState.breakClasses,
      sessionClasses: prevState.sessionClasses
    }));
  }
}
  


export default App;
