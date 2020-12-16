import React, { useState } from 'react';
import './Pokemon.css';

export function Pokemon({ id, name, caught, togglePokemon }) {
  const [counter, setCounter] = useState(0);

  function handleClick() {
    togglePokemon(id);
  }
  
  function handleMouseEnter() {
    setCounter(prev => prev + 1);
  }

  return (
    <div onMouseEnter={handleMouseEnter} className={`pokemons__item ${caught ? "pokemons-red" : "pokemons-green"}`}>
      <h2 className="pokemons__item-header">{name} {counter}</h2>
      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}></img>
      <button onClick={handleClick} className="pokemons__item-button">
        {caught ? "Отпустить" : "Поймать"}
      </button>
    </div>
  )
}