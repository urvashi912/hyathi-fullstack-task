import Pokemon from "@/models/Pokemon";

const seedPokemons = async () => {
  const pokemons = [
    { name: 'Pikachu', breed: 'Electric', age: 3, photo:"https://i.pinimg.com/736x/5d/6d/23/5d6d23fd7adb44baba20a60c252da339.jpg" },
    { name: 'Bulbasaur', breed: 'Grass/Poison', age: 5, photo:"https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/07/Pokemon-Fan-Designs-Crystal-Version-of-Bulbasaur.jpg" },
    { name: 'Charmander', breed: 'Fire', age: 4, photo:"https://img.pokemondb.net/sprites/home/normal/2x/charmander.jpg" },
    { name: 'Squirtle', breed: 'Water', age: 4, photo:"https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokedex/4/4b/Ash_Squirtle.png" },
    { name: 'Jigglypuff', breed: 'Normal/Fairy', age: 2, photo:"https://db.pokemongohub.net/_next/image?url=%2Fimages%2Fofficial%2Ffull%2F039.webp&w=640&q=75" }
  ];

  try {
    await Pokemon.deleteMany(); // Clear existing data
    const insertedPokemons = await Pokemon.insertMany(pokemons);
    console.log(`${insertedPokemons.length} Pokemons seeded successfully`);
  } catch (error) {
    console.error('Error seeding pokemons:', error);
    throw error;
  }
};

export default seedPokemons;
