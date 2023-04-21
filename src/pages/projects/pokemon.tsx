/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
const Pokemon: NextPage = () => {
  const [pokemon, setPokemon] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [height, setHeight] = useState(0);
  const [height2, setHeight2] = useState(0);
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  const [anwser, setAnwser] = useState("");

  function getRandomPokemon() {
    setAnwser("");
    axios
      .get(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0https://pokeapi.co/api/v2/"
      )
      .then(function (response) {
        // handle success

        const randomnumber =
          Math.floor(Math.random() * 1000) + (response.data.count - 1000);
        const randomnumber2 =
          Math.floor(Math.random() * 1000) + (response.data.count - 1000);
        // console.log(response, response.data.count);
        // console.log(response.data.results[randomnumber].url);

        getPokemon(response.data.results[randomnumber].url, 1);
        getPokemon(response.data.results[randomnumber2].url, 2);
      });
  }
  function taller(e: React.SyntheticEvent) {
    if (height == height2) {
      getRandomPokemon();
    }
    switch (e.currentTarget.id) {
      case "first": {
        if (height > height2) {
          setAnwser(
            `Your anwser is correct! ${pokemon} is taller than ${pokemon2}`
          );
          getRandomPokemon();
        }
        if (height < height2) {
          setAnwser(
            `Your anwser is incorrect! ${pokemon} is shorter than ${pokemon2}`
          );
          getRandomPokemon();
        }
        break;
      }
      case "second": {
        if (height2 > height) {
          setAnwser(
            `Your anwser is correct! ${pokemon2} is taller than ${pokemon}`
          );
          getRandomPokemon();
        }
        if (height > height2) {
          setAnwser(
            `Your anwser is incorrect! ${pokemon2} is shorter than ${pokemon}`
          );
          getRandomPokemon();
        }
        break;
      }
    }
  }
  function getPokemon(url: string, number: number) {
    switch (number) {
      case 1: {
        axios.get(url).then(function (response) {
          setPokemon(response.data.species.name);
          setHeight(response.data.height / 10);
          setImage(
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` +
              response.data.id +
              ".png"
          );
        });
        break;
      }
      case 2: {
        axios.get(url).then(function (response) {
          setPokemon2(response.data.species.name);
          setHeight2(response.data.height / 10);
          setImage2(
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/` +
              response.data.id +
              ".png"
          );
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
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="text-center text-2xl">
        <a>Select which pokemon is taller</a>
        <div className=" flex items-center justify-center text-center">
          <div>
            <img src={image} alt="image" width={200} height={200} />
            <button id="first" onClick={taller}>
              {pokemon}
            </button>
          </div>
          <div>
            <img src={image2} alt="image2" width={200} height={200} />
            <button id="second" onClick={taller}>
              {pokemon2}
            </button>
          </div>
        </div>
        <p>{anwser}</p>
        <button onClick={getRandomPokemon}>Get random pokemon</button>
      </div>
    </>
  );
};

export default Pokemon;
