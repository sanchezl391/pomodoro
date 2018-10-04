import React, { Component } from 'react';
import './App.css';
import TimeArea from './TimeArea'

class App extends Component {v
  constructor(props) {
    super(props);

    this.state = {
      break: {
        finalBreakMinutes: 5, 
        seconds: 0,
        breakClasses: {
          input: 'inputVisible',
          display: 'displayHidden',
          textarea: 'textAreaVisible'
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
      btnClasses: 'btn startBtn',
      minuteListHtml: <ul><li> No session completed today :( </li></ul>
    };

    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount() {
    // Request logs for day
    let self = this;

     fetch('http://localhost:3001/')
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          response.json().then(function(data) {
            let minutesArr = [];
            data.forEach(function(minuteLog, index){ 
              minutesArr[index] = <li key={index}> { minuteLog.minutes } </li>;
            });
  
            self.setState((prevState, props) => ({
              break: prevState.break,
              session: prevState.session,
              btnClasses: prevState.btnClasses,
              minuteListHtml: <ul> { minutesArr } </ul>
            }));
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
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
        <TimeArea // Break
          setMinutes={this.setFinalBreakMinutes} 
          ctx={this}
          seconds={this.state.break.seconds} 
          title='Break (minutes)'
          inputClasses={this.state.break.breakClasses.input}
          displayClasses={this.state.break.breakClasses.display}
        />
        <p className="mssgTitle">
          Message shown when it is time for break. Be ready for it!
        </p>
        <textarea 
          className={this.state.break.breakClasses.textarea}
          onChange={this.setMessage}
          rows={2}
          cols={4}
          ></textarea>
        
        <div 
          className={this.state.btnClasses}
          onClick={this.handleClick}
          >
          {btnTxt}
        </div> 
        <ul>
          { this.state.minuteListHtml }
        </ul>
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
    let showDisplay = this.state.break.seconds === 0;
    if(showDisplay)
      alert(this.state.break.message);

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
          textarea: (showStartBtn) ? 'textAreaVisible' : 'textAreaHidden'
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
      btnClasses: (showStartBtn) ? "btn startBtn": "btn cancelBtn",
      minuteListHtml: prevState.minuteListHtml
    }));
  }

  decrementOneSecondFromBreak() {
    console.log(this.state.session.finalSessionMinutes);
    let newSeconds = this.state.break.seconds - 1;
    let self = this;
    if(this.state.break.seconds === 0){ // Completed a session successfully

      fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ minutes: self.state.session.finalSessionMinutes })
      })
      .then( function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
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
      btnClasses: prevState.btnClasses,
      minuteListHtml: prevState.minuteListHtml
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
        finalSessionMinutes: prevState.session.finalSessionMinutes, 
        seconds: newSeconds,
        sessionClasses: prevState.session.sessionClasses
      },
      btnClasses: prevState.btnClasses,
      minuteListHtml: prevState.minuteListHtml
    }));
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
      btnClasses: prevState.btnClasses,
      minuteListHtml: prevState.minuteListHtml
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
      btnClasses: prevState.btnClasses,
      minuteListHtml: prevState.minuteListHtml
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
      btnClasses: prevState.btnClasses,
      minuteListHtml: prevState.minuteListHtml
    }));
  }
}
  
export default App;
