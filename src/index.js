import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock, faTimesCircle, faCaretUp, faCaretDown, faCaretRight, faPause, faPlay, faCaretLeft,faCommentAlt, faClock, faUserAlt } from '@fortawesome/free-solid-svg-icons'

import registerServiceWorker from './registerServiceWorker';

library.add(faCaretUp, faLock, faUserAlt, faTimesCircle, faCaretDown, faCaretLeft, faPlay, faPause, faCaretRight, faClock, faCommentAlt);
ReactDOM.render(<App />, document.getElementById('root'));

console.log('ENV: ' + process.env.NODE_ENV);
if('serviceWorker' in navigator) {
    registerServiceWorker();
}
    