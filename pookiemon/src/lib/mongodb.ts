import Pokemon from "@/models/Pokemon";
import mongoose from "mongoose";
import seedPokemons from "@/utility/PokemonSeeder";
const { MONGODB_URI } = process.env;
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log("MongoDb connected");
      await seedPokemons()
      return Promise.resolve(true);

    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

