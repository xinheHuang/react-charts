import React from 'react';
import logo from './logo.svg';
import './App.css';
import LiquidFillGaugeDemo from './demo/liquid-fill-gauge-demo';

const App = () =>
  (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <LiquidFillGaugeDemo />
    </div>
  )
;

export default App;
