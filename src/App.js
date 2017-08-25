import React from 'react';
import logo from './logo.svg';
import './App.css';
import LiquidFillGauge from './componenets/liquid-fill-gauge';

const App = () =>
  (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p>liquid-fill-gauge</p>
      <LiquidFillGauge />
    </div>
  );

export default App;
