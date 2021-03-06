import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home/Home';
import ProtectedHome from './ProtectedHome/ProtectedHome'

class App extends Component {
  render() {
    return (
      <Router>    
        <div>
          <Route path='/' component={ Home } />
          <Route path='/home' component={ ProtectedHome } />
        </div>           
      </Router>
    );
  }
}

export default App;