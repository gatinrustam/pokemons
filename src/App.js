import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { PokemonList } from './PokemonList/PokemonList';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/:number" exact component={PokemonList} />
      </BrowserRouter>
    </div>
  );
}

export default App;