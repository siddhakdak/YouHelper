import React from 'react';
import './App.css';
import Playlist from './components/Playlist';
import Header from './components/Header';
import Extension from './components/Extension';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <>
        <Header/>
        <Playlist />
        <Extension/>
        </>
      </main>
    </div>
  );
}

export default App;
