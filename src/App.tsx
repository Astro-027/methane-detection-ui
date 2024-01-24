import React from 'react';
import './App.css';
// import { LineGraph } from './components/LineGraph';
// import { BarGraph } from './components/BarGraph';
import MapComponent from './components/Map';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Methane Detection UI</h1>
        {/* <LineGraph />
        <BarGraph /> */}
        <MapComponent />
      </header>
    </div>
  );
}

export default App;