import React, { Component } from 'react';
import './App.css';
import Button from './Button/Button'
import Timer from './Timer/Timer'
import TimerMenu from './TimerMenu/TimerMenu'
import './ContainerStyles.css'

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
      stateActive: false,
      stateSession: true
    };

    this.setMessage = this.setMessage.bind(this);
  }

  // componentDidMount() {
  //   // Request logs for day
  //   let self = this;

  //    fetch('https://ancient-caverns-61221.herokuapp.com/',{
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json; charset=utf-8"
  //     }      
  //     })
  //     .then(
  //       function(response) {
  //         if (response.status !== 200) {
  //           console.log('Looks like there was a problem. Status Code: ' +
  //             response.status);
  //           return;
  //         }

  //         response.json().then(function(data) {
  //           if(data.hasOwnProperty("mssg")){
  //             return
  //           }
            
  //           let minutesArr = [];
  //           data.forEach(function(minuteLog, index){ 
  //             minutesArr[index] = <li key={index}> { minuteLog.minutes } </li>;
  //           });
  
  //           self.setState((prevState, props) => ({
  //             break: prevState.break,
  //             session: prevState.session,
  //             btnClasses: prevState.btnClasses
  //           }));
  //         });
  //       }
  //     )
  //     .catch(function(err) {
  //       console.log('Fetch Error :-S', err);
  //     });
  // }

  render() {
    let html = 
      <div className="container">
        <TimerMenu 
          ctx={this}
          finalSessionMinutes={this.state.session.finalSessionMinutes} 
          finalBreakMinutes={this.state.break.finalBreakMinutes}
          setFinalBreakMinutes={this.setFinalBreakMinutes}
          setFinalSessionMinutes={this.setFinalSessionMinutes}
          setMessage={this.setMessage}
        />
        <div className="timeAreaContainer">
          <Timer 
            breakSecondsLeft={this.state.break.seconds}
            sessionSecondsLeft={this.state.session.seconds}
            stateActive={this.state.stateActive}
            stateSession={this.state.stateSession}
          />
          <Button 
            stateActive={this.state.stateActive}
            stateSession={this.state.stateSession}
            toggleState={this.toggleState}
            ctx={this}
          />
        </div>
      </div>
    ;
    return html;
  }

  toggleState() {
    let stateActive = !this.state.stateActive;
    

    if(stateActive) // timer will start
      this.timer = setInterval(() => this.decrementOneSecondFromSession(), 1000);
    else { // timer is paused
      clearInterval(this.timer);
    }

    this.setState((prevState, props)=> ({
      break:prevState.break,
      session:prevState.session,
      stateActive:stateActive
    }));
  }

  decrementOneSecondFromBreak() {
    // console.log('Session: ' + this.state.session.seconds);
    // console.log('Break: ' + this.state.break.seconds);
    let newSeconds = this.state.break.seconds - 1;
    // let self = this;
    if(this.state.break.seconds === 0){ // Completed a session successfully

      // fetch('https://ancient-caverns-61221.herokuapp.com/', {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json; charset=utf-8"
      //   },
      //   body: JSON.stringify({ minutes: self.state.session.finalSessionMinutes })
      // })
      // .then( function(response) {
      //   if (response.status !== 200) {
      //     console.log('Looks like there was a problem. Status Code: ' +
      //       response.status);
      //     return;
      //   }
      // })
      // .catch(function(err) {
      //   console.log('Fetch Error :-S', err);
      // });
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
      stateActive: prevState.stateActive,
      stateSession: prevState.stateSession
    }));
  }

  decrementOneSecondFromSession() {
    let newSeconds = this.state.session.seconds - 1;
    let stateSession = this.state.stateSession;
    if(this.state.session.seconds === 0){
      clearInterval(this.timer);
      newSeconds = 0;
      stateSession = false;
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
      stateActive: prevState.stateActive,
      stateSession: stateSession
    }));
  }

  setMessage(message) {
    console.log('mssg in app.js: ' + message);
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: prevState.break.finalBreakMinutes,
        seconds: prevState.break.seconds,
        breakClasses: prevState.break.breakClasses,
        message: message
      },
      session: prevState.session,
      stateActive: prevState.stateActive,
      stateSession: prevState.stateSession
    }));
  }


  setFinalSessionMinutes(minutes) {
    // console.log('session minutes: ' + minutes);
    this.setState((prevState, props) => ({
      break: prevState.break,
      session: {
        finalSessionMinutes: minutes,
        seconds: minutes * 60,
        sessionClasses: prevState.session.sessionClasses
      },
      stateActive: prevState.stateActive,
      stateSession: prevState.stateSession
    }));
  }
  setFinalBreakMinutes(minutes) {
    // console.log('break minutes: ' + minutes);
    this.setState((prevState, props) => ({
      break: {
        finalBreakMinutes: minutes,
        seconds: minutes * 60,
        breakClasses: prevState.break.breakClasses,
        message: prevState.break.message
      },
      session: prevState.session,
      stateActive: prevState.stateActive,
      stateSession: prevState.stateSession
    }));
  }
}
  
export default App;
