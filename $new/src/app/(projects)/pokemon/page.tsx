/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-img-element */
"use client"
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
interface Pokemon {
  name: string;
  height: number;
  image: string;
}
interface Response {
  data: {
    results: {
      url: string;
    }[],
    species: {
      name: string;
    }
    height: number;
    id: number;
    count: number;
  },
}
const Pokemon: NextPage = () => {
  const [pokemon, setPokemon] = useState({

  } as Pokemon);
  const [pokemon2, setPokemon2] = useState(
    {} as Pokemon,
  );
  const [answer, setAnswer] = useState("");

  function getRandomPokemon() {
    axios
      .get(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0https://pokeapi.co/api/v2/"
      )
      .then(function (response: Response) {
        // handle success

        const randomnumber =
          Math.floor(Math.random() * 1000) + (response.data.count - 1000);
        const randomnumber2 =
          Math.floor(Math.random() * 1000) + (response.data.count - 1000);
        // console.log(response, response.data.count);
        // console.log(response.data.results[randomnumber].url);

        getPokemon(response.data.results[randomnumber]?.url!, 1);
        getPokemon(response.data.results[randomnumber2]?.url!, 2);
      });
  }
  function taller(e: React.SyntheticEvent) {
    if (pokemon.height == pokemon2.height) {
      getRandomPokemon();
    }
    const a = e.currentTarget.id == "first" ? pokemon.height > pokemon2.height : pokemon.height < pokemon2.height
    setAnswer(`Your answer is ${a ? "correct": "incorrect"}! ${a ? pokemon.name : pokemon2.name} is taller than ${a ? pokemon2.name : pokemon.name}`);
    console.log(`${pokemon.height} ${pokemon2.height}`)
    getRandomPokemon();
  }
  function getPokemon(url: string, number: number) {
    switch (number) {
      case 1: {
        axios.get(url).then(function (response: Response) {
          setPokemon({
            name: response?.data?.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + response.data.id + ".png",
            height: response.data.height,
        })
        console.log(response.data.height)
        });
        break;
      }
      case 2: {
        axios.get(url).then(function (response: Response) {
          setPokemon2({
            name: response?.data?.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` + response.data.id + ".png",
            height: response.data.height,
        })
        console.log(response.data.height)
        });
        break;
      }
    }
  }
  useEffect(() => {
    getRandomPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Head>
        <title>Pokemon - wiktrek</title>
        <meta name="description" content="Guess which pokemon is taller" />
      </Head>
      <div className="text-center text-2xl">
        <a>Select which pokemon is taller</a>
        <div className=" flex items-center justify-center text-center">
          <div>
            <img src={pokemon.image} alt="image" width={200} height={200} />
            <button id="first" onClick={taller}>
              {pokemon.name}
            </button>
          </div>
          <div>
            <img src={pokemon2.image} alt="image2" width={200} height={200} />
            <button id="second" onClick={taller}>
              {pokemon2.name}
            </button>
          </div>
        </div>
        <p>{answer}</p>
        <button onClick={getRandomPokemon}>Get random pokemon</button>
      </div>
    </>
  );
};

export default Pokemon;
