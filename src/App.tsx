import React from 'react';
import logo from './logo.svg';
import './App.css';
import Parser from "./components/Parser";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Upload your json file and trans to csv.
        </p>
        <Parser />
      </header>
    </div>
  );
}

export default App;
