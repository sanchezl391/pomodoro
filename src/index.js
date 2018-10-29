import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'

// import registerServiceWorker from './registerServiceWorker';
import registerServiceWorker from './worker'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faTimesCircle, faCaretUp, faCaretDown, faCaretRight, faPause, faPlay, faCaretLeft,faCommentAlt, faClock, faUserAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faCaretUp, faLock, faUserAlt, faTimesCircle, faCaretDown, faCaretLeft, faPlay, faPause, faCaretRight, faClock, faCommentAlt);
ReactDOM.render(<App />, document.getElementById('root'));

if('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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
    