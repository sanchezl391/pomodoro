import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home/Home';
import ProtectedHome from './ProtectedHome/ProtectedHome'
import NewUser from './NewUser/NewUser'

class App extends Component {
  render() {
    return (
      <Router>    
        <div>
          <Route path='/' component={ Home } />
          <Route path='/home' component={ ProtectedHome } />
          <Route path='/new' component={ NewUser }/>
        </div>           
      </Router>
    );
  }
}

export default App;