import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Pokemon } from '../Pokemon/Pokemon';
import './PokemonList.css';

const POKEMONS_PER_PAGE = 8;

// https://pokeapi.co/api/v2/pokemon?offset=0&limit=12
function fetchPokemons(page) {
  const limit = POKEMONS_PER_PAGE;
  const offset = (page - 1) * POKEMONS_PER_PAGE;

  return fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      const list = data.results.map(pokemon => {
        return {
          name: pokemon.name,
          id: pokemon.url.slice(34, -1)
        }
      });
      const count = data.count;

      return { list, count };
    });
}


export function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [caughtList, setCaughtList] = useState(() => JSON.parse(localStorage.getItem('caughtPokemons')) ?? []);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const [loading, setLoading] = useState(true);

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

  function incrementPage() {
    setPage(prevPage => {
      return prevPage + 1;
    });
  }

  function decrementPage() {
    setPage(prevPage => prevPage - 1);
  }

  const prevDisabled = page === 1 || loading;
  const nextDisabled = page === pages || loading;


  // routing
  let match = useRouteMatch();
  console.log(match.params.number);

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
        <Link
          className="prev"
          onClick={decrementPage}
          disabled={prevDisabled}
          to={`/${page - 1}`}
        >
          Предыдущая страница
        </Link>
        <span>Страница {page} из {pages}</span>
        <Link
          className="next"
          onClick={incrementPage}
          disabled={nextDisabled}
          to={`/${page + 1}`}
        >
          Следующая страница
        </Link>
      </div>
    </div>
  )
}