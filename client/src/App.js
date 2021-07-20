import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HomePage from './components/homepage';
import Episode from './components/episode';
import './App.css';

function App() {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route path="/episode/:episode" component={Episode} />
    </Router>
  );
}

export default App;
