const axios = require('axios');
const { Pokemon, Types } = require('../db');

const URL_BASE = 'https://pokeapi.co/api/v2/pokemon/';

module.exports = async function getPokemonById (req,res) {
    const { idPokemon } = req.params;

    //* Si el id tiene una longitud menor a 5, busco al Pokemons en la API
    if(idPokemon.length < 5) {

        try {
            const pokemon = await axios(`${URL_BASE}${idPokemon}`);

            // Si encuentra al Pokemon en la API:
            const { id, name, stats, height, weight, types, sprites  } = pokemon.data;

            // Extraigo las propiedades hp, attack, defense y speed de stats
            const hp = stats[0].base_stat;
            const attack = stats[1].base_stat;
            const defense = stats[2].base_stat;
            const speed = stats[5].base_stat;

            // Extraigo los nombres de los tipos de types
            const typesNames = types.map(elem => elem.type.name);

            // Extraigo las imágenes de sprites
            const imageClassic = sprites.other.dream_world.front_default;
            const image3d = sprites.other.home.front_default;
            const imageArtistic = sprites.other['official-artwork'].front_default;

            // Devuelvo un JSON con el pokemon encontrado
            return res.status(200).json({id, name, hp, attack, defense, speed, height, weight, imageClassic, image3d,  imageArtistic, typesNames});

        } catch (error) {
            res.status(404).json({message: `Pokemon with ID ${idPokemon} not found`})
        }

    //* Si el id recibido no es un número, lo busco en la DB
    } else {

        try {
            let pokemon = await Pokemon.findByPk(idPokemon);

            // Traigo todos los types asociados a ese Pokemon
            const pokemonTypes = (await pokemon.getTypes()).map(elem => elem.name)

            // Retorno la info del pokemon y sus types
            res.status(200).json({ pokemon, pokemonTypes });

        } catch (error) {
            res.status(404).json({message: `Pokemon with ID ${idPokemon} not found`})
        }
    }
}