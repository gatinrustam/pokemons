import React, { useState, useEffect } from 'react';
import { Pokemon } from '../Pokemon/Pokemon';
import './PokemonList.css';

// 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15

// offset  limit
//   0       4    1-4
//   6       4    7-10
//   3       5    4-8

const POKEMONS_PER_PAGE = 4;


// https://pokeapi.co/api/v2/pokemon?offset=0&limit=12
function fetchPokemons(page){
  const limit = POKEMONS_PER_PAGE;
  const offset = (page - 1) * POKEMONS_PER_PAGE;
  
  return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const list = data.results.map(pokemon => {
          return {
            name: pokemon.name,
            id: pokemon.url.slice(34, -1)
          }
        });
        const count = data.count;

        return {list, count};
    });
}

// fetchPokemons(1).then((x) => console.log(1, x.map(({ id }) => id))); // 1-8
// fetchPokemons(4).then((x) => console.log(4, x.map(({ id }) => id))); // 25-32


export function PokemonList(){
  const [pokemons, setPokemons] = useState([]);
  const [caughtList, setCaughtList] = useState(() => JSON.parse(localStorage.getItem('caughtPokemons')) ?? []);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const [loading, setLoading] = useState(true);

  console.log(caughtList);

  function togglePokemon(id) {
    setCaughtList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id]; 
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    fetchPokemons(page).then(x => {
      setPokemons(x.list);
      setTotal(x.count);
      setLoading(false);
    });
  }, [page]);

  useEffect(() => {
    localStorage.setItem('caughtPokemons', JSON.stringify(caughtList));
  }, [caughtList]);

  const pages = Math.ceil(total / POKEMONS_PER_PAGE);

  function incrementPage(){
    setPage(prevPage => {
        return prevPage + 1;
    });
  }

  function decrementPage(){
    setPage(prevPage => prevPage - 1);
  }

  const prevDisabled = page === 1 || loading;
  const nextDisabled = page === pages || loading;

  
  // Безопаснее передать в setIsFront функцию. 
  // Эта функция принимает предыдущее состояние и возвращает новое. 
  // Она является чистой, поскольку зависит только от своих аргументов.


  return (
    <div>
      <div>
        <h2>Поймано покемонов</h2>
        <h1>{caughtList.length}/{total}</h1>
      </div>
      <div className="pokemons">
        {pokemons.map(({ id, name }) => (
          <Pokemon
            key={id}
            id={id}
            name={name}
            caught={caughtList.includes(id)}
            togglePokemon={togglePokemon}
          />
        ))}
      </div>

      <div className="pagination">
        <button 
          className="prev"
          onClick={decrementPage}
          disabled={prevDisabled}
        >
          Предыдущая страница
        </button>
        <span>Страница {page} из {pages}</span>
        <button 
          className="next"
          onClick={incrementPage}
          disabled={nextDisabled}
        >
          Следующая страница
        </button>
      </div>
    </div>
  )
}