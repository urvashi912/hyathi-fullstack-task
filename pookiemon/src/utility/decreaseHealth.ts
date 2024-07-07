import cron from 'node-cron';
import mongoose from 'mongoose';
import Pokemon from '@/models/Pokemon';

export const startHealthDecreaseJob = async () => {
    console.log('Starting health')
  try {
    cron.schedule('0 0 * * *', async () => {
      try {
        await decreaseHealth();
      } catch (error) {
        console.error('Error in cron job:', error);
      }
    });
    console.log('Health decrease cron job started.');
  } catch (error) {
    console.error('Error starting cron job:', error);
  }
};

const decreaseHealth = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Find all Pokemons
  const pokemons = await Pokemon.find();

  // Decrease health of each Pokemon
  for (const pokemon of pokemons) {
    pokemon.healthStatus -= 5; // Decrease health (adjust as needed)
    if (pokemon.healthStatus < 0) {
      pokemon.healthStatus = 0; // Ensure health doesn't go below 0
    }
    await pokemon.save();
  }

  console.log('Health decreased for all Pokemons.');
};
