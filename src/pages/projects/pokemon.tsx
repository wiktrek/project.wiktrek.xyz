/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import React, { useState } from "react";
import axios from "axios";
const Pokemon: NextPage = () => {
  const [pokemon, setPokemon] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [image, setImage] = useState("");
  const [image2, setImage2] = useState("");
  function getRandomPokemon() {
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
        console.log(response, response.data.count);
        console.log(response.data.results[randomnumber].url);

        getPokemon(response.data.results[randomnumber].url, 1);
        getPokemon(response.data.results[randomnumber2].url, 2);
      });
  }
  function getPokemon(url: string, number: number) {
    switch (number) {
      case 1: {
        axios.get(url).then(function (response) {
          setPokemon(response.data.name);
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
          setPokemon2(response.data.name);
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
  return (
    <>
      <Head>
        <title>Pokemon - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="text-center">
        <a>Select which pokemon is taller</a>
        <div className=" flex items-center justify-center text-center">
          <div>
            <img src={image} alt="image" width={200} height={200} />
            <button>{pokemon}</button>
          </div>
          <div>
            <img src={image2} alt="image2" width={200} height={200} />
            <button>{pokemon2}</button>
          </div>
        </div>

        <button onClick={getRandomPokemon}>Get random pokemon</button>
      </div>
    </>
  );
};

export default Pokemon;
