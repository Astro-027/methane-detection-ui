import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Note the change here
import './App.css';
import MapComponent from './components/Map';
import DataVisualization from './components/DataVisualization'; // Ensure this component exists

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Methane Detection UI</h1>
          {/* Setup the Routes and Route components here */}
          <Routes> {/* Updated to Routes */}
            {/* Home Route */}
            <Route path="/" element={<MapComponent />} /> {/* Updated syntax */}
            {/* Data Visualization Route */}
            <Route path="/data-visualization" element={<DataVisualization />} /> {/* Updated syntax */}
            {/* You can add more routes as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
