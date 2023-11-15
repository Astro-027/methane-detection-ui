import React from 'react';
import './App.css';
import { LineGraph } from './LineGraph';
import { BarGraph } from './BarGraph';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Methane Detection UI</h1>
        <LineGraph />
        <BarGraph />
      </header>
    </div>
  );
}

export default App;