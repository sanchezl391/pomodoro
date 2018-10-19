import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faTimesCircle, faCaretUp, faCaretDown, faCaretRight, faPause, faPlay, faCaretLeft,faCommentAlt, faClock } from '@fortawesome/free-solid-svg-icons'

library.add(faCaretUp, faTimesCircle, faCaretDown, faCaretLeft, faPlay, faPause, faCaretRight, faClock, faCommentAlt);
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
