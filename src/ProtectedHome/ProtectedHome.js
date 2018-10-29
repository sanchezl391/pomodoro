import React, { Component } from 'react';
import './ProtectedHome.css';
import Button from '../Button/Button'
import Timer from '../Timer/Timer'
import TimerMenu from '../TimerMenu/TimerMenu'
import '../ContainerStyles.css'

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

  componentDidMount() {
    this.getLogs();
    // this.pushEventListener();
    // Check for service worker
    if('serviceWorker' in navigator) 
      this.send().catch(err => console.error('Error: ' + err));
  }
  
  // pushEventListener() {
  //   window.self.addEventListener("push", event => {
  //     const data = event.data.json()
  //     const { title } = data

  //     const body = {
  //       body: data.body,
  //       icon: data.icon
  //     }

  //     event.waitUntil(window.self.registration.showNotification(title, body))
  //   })
  // }

  // Register SW,register push, send push
  async send() {
    console.log('registering service worker');
    // registering service worker
    const register = await navigator.serviceWorker.register('./worker.js', {
      scope: '/' // url for where the service worker should work
    });

    // service worker registered
    // register push
    console.log('registering push');
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey: this.urlBase64ToUint8Array(process.env.publicVapidKey)
    });

    console.log('sending push notification');
    // send push notification
    await fetch('https://task-focus.herokuapp.com/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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

  toggleState() {
    let stateActive = !this.state.stateActive;
    // check if there is a valid time to start the timer
    if(stateActive && this.state.session.seconds) {// timer will start
      this.timer = setInterval(() => this.decrementOneSecondFromSession(), 1000);
      this.setState((prevState, props)=> ({
        break:prevState.break,
        session:prevState.session,
        stateActive:stateActive,
        timerMenu: { errorInSession: false },
        completedMinutes: prevState.completedMinutes
      }));
    }
    else { // timer is paused or trying to start an emty timer 
      clearInterval(this.timer);
      let breakSecondsSet = typeof this.state.session.seconds === 'number';
      let sessionSecondsSet = typeof this.state.break.seconds === 'number';
      if(!breakSecondsSet || !sessionSecondsSet)
        this.setState((prevState, props) => ({
          break:prevState.break,
          session:prevState.session,
          stateActive: prevState.stateActive,
          stateSession: prevState.stateSession,
          timerMenu: { errorInSession: true },
          completedMinutes: prevState.completedMinutes
        }));
      else  
        this.setState((prevState, props) => ({
          break:prevState.break,
          session:prevState.session,
          stateActive: !prevState.stateActive,
          stateSession: true,
          timerMenu: { errorInSession: false },
          completedMinutes: prevState.completedMinutes
        }));
    }
  }

  decrementOneSecondFromBreak() {
    let newSeconds = this.state.break.seconds - 1;
    let self = this;
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
      newSeconds = 0;
      this.getLogs();
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
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
      stateSession: stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
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
      stateSession: prevState.stateSession,
      timerMenu: prevState.timerMenu,
      completedMinutes: prevState.completedMinutes
    }));
  }
}
  
export default ProtectedHome;