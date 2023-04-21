import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import axios from "axios";
const Pokemon: NextPage = () => {
  const [pokemon, setPokemon] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  function getRandomPokemon() {
    axios
      .get(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0https://pokeapi.co/api/v2/"
      )
      .then(function (response) {
        // handle success

        console.log(response, response.data.count);
      });
  }
  axios
    .get("https://pokeapi.co/api/v2/pokemon/snorlax")
    .then(function (response) {
      // handle success
      console.log(response.data.height / 10);
      setPokemon(response.data.name);
    });

  return (
    <>
      <Head>
        <title>Pokemon - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div>
        <button>button 1</button>
        <p>{pokemon}</p>
        <button>button 2</button>
        <button onClick={getRandomPokemon}>Get random pokemon</button>
      </div>
    </>
  );
};

export default Pokemon;
