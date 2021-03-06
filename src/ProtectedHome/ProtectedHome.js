import React, { Component } from 'react';
import './ProtectedHome.css';
import Button from '../Button/Button'
import Timer from '../Timer/Timer'
import TimerMenu from '../TimerMenu/TimerMenu'
import '../ContainerStyles.css'

/**
 * this component is the core of the application. 
 * it contains the home screen once the user logs in
 */
class ProtectedHome extends Component {
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
      stateSession: true,
      timerMenu: {
        errorInSession: false
      },
      compeletedMinutes:0 
    };

    this.setMessage = this.setMessage.bind(this);
    this.logoutUser = this.props.logoutUser.bind(this.props.ctx);
  }

  /**
   * retrieves session records from the db
   */
  getLogs() {
    // Request logs for day
    fetch('https://task-focus-api.herokuapp.com/getLogs',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ 
        username: this.props.username
      })      
    })
      .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }

          response.json().then(function(data) {
            this.setState((prevState,props) => ({
              break: prevState.break,
              session: prevState.session,
              stateActive:prevState.stateActive,
              sessionActive: prevState.sessionActive,
              completedMinutes: data.minutes
            }));  
          }.bind(this));     
        }.bind(this)
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }

  /**
   * sends a notification once it is time for a break
   */
  showNotification() {
    // if browser supports service worker then show notification
    const swUrl = `${process.env.PUBLIC_URL}/worker.js`;
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        registration.pushManager.getSubscription()
          .then(function(subscription) {
            // send push notification
            fetch('https://task-focus-api.herokuapp.com/subscribe', {
              method: 'POST',
              body: JSON.stringify({
                subscription: subscription,
                message: this.state.break.message
              }),
              headers: {
              'Content-type': 'application/json; charset=utf-8'
              }
            });
          }.bind(this))
      });
  }

  componentDidMount() {
    this.getLogs();
  }

  render() {
    let html = 
      <div className="container protectedHomeContainer">
        <TimerMenu 
          ctx={this}
          finalSessionMinutes={this.state.session.finalSessionMinutes} 
          finalBreakMinutes={this.state.break.finalBreakMinutes}
          setFinalBreakMinutes={this.setFinalBreakMinutes}
          setFinalSessionMinutes={this.setFinalSessionMinutes}
          setMessage={this.setMessage}
          errorInSession={this.state.timerMenu.errorInSession}
        />
        <div className="timeAreaContainer container">
          <p 
            className='regularText logout'
            onClick={() => this.logoutUser()}>
              Logout
            </p>
          <Timer 
            breakSecondsLeft={this.state.break.seconds}
            progress={this.calculateProgress()}           
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
          <p 
            className='sessionMinutes regularText ubuntu'>
              completed {this.state.completedMinutes} minutes today 
          </p>
        </div>
      </div>
    ;
    return html;
  }

  /**
   * calculates the progress that the timer has made towards completion.
   * this is used to animate the progress ring.
   */
  calculateProgress() {
    let stateSession = this.state.stateSession;
    let finalBreakMinutes = this.state.break.finalBreakMinutes;
    let finalSessionMinutes = this.state.session.finalSessionMinutes;

    let finalSeconds = (stateSession) ? finalSessionMinutes * 60 : finalBreakMinutes * 60;
    let secondsLeft = (stateSession) ? this.state.session.seconds : this.state.break.seconds;
    let progress =  ((finalSeconds - secondsLeft) / finalSeconds) * 100;
    return progress;
  }

  /**
   * toggles between paused/resume timer states
   */
  toggleState() {
    let stateActive = !this.state.stateActive;
    console.log('state active: ' + stateActive);

    // checks for empty session
      let breakSecondsSet = typeof this.state.session.seconds === 'number';
      let sessionSecondsSet = typeof this.state.break.seconds === 'number';

      if(!breakSecondsSet || !sessionSecondsSet) {
        this.setState((prevState, props) => ({
          break:prevState.break,
          session:prevState.session,
          stateActive: prevState.stateActive,
          stateSession: prevState.stateSession,
          timerMenu: { errorInSession: true },
          completedMinutes: prevState.completedMinutes
        }));
        return;
      }
        
    // handles pausing and resuming timer
    if(stateActive) {// timer will start
      if(this.state.session.seconds) {
        console.log('starting session timer');
        this.timer = setInterval(() => this.decrementOneSecondFromSession(), 1000);
      }        
      else if(this.state.break.seconds) {
        console.log('starting break timer');
        this.timer = setInterval(() => this.decrementOneSecondFromBreak(), 1000);
      }
        
      else  
        return;
    }
    else { // timer will be paused
      console.log('timer paused');
      clearInterval(this.timer);
    }
    this.setState((prevState, props)=> ({
      break:prevState.break,
      session:prevState.session,
      stateActive:stateActive,
      timerMenu: { errorInSession: false },
      completedMinutes: prevState.completedMinutes
    }));
  }

  /**
   * called every second to decrement one second from break timer
   */
  decrementOneSecondFromBreak() {
    let newSeconds = this.state.break.seconds - 1;
    let self = this;
    let stateSession = false;
    if(this.state.break.seconds === 0){ // Completed a session successfully

      fetch('https://task-focus-api.herokuapp.com/insertLog', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ 
          username: this.props.username, 
          minutes: self.state.session.finalSessionMinutes 
        })
      })
      .then( function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
      }.bind(this))
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      clearInterval(this.timer);
      this.toggleState();
      newSeconds = 0;
      stateSession = true;
      this.getLogs();
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
      stateSession: stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }

    /**
   * called every second to decrement one second from session timer
   */
  decrementOneSecondFromSession() {
    let newSeconds = this.state.session.seconds - 1;
    let stateSession = this.state.stateSession;
    if(this.state.session.seconds === 0){
      this.showNotification();
      // Remove Session timer
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
      stateSession: stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }

  /**
   * stores the message into the state
   * @param message the message that will be used for the push notification
   */
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }

  /**
   * sets the final amount of session minutes for the timer
   * @param minutes the amount of session minutes
   */
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }

    /**
   * sets the final amount of break minutes for the timer
   * @param minutes the amount of break minutes
   */
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }
}
  
export default ProtectedHome;