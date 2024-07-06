// src/models/Pokemon.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface PokemonModel extends Document {
  name: string;
  breed: string;
  age: number;
  healthStatus: number;
  adoptedBy?:string | mongoose.Schema.Types.ObjectId | null;
  photo?: string; // Add photo field
}

let Pokemon: mongoose.Model<PokemonModel>;

try {
  Pokemon = mongoose.model('Pokemon') as mongoose.Model<PokemonModel>;
} catch (error) {
  const PokemonSchema = new Schema<PokemonModel>({
    name: { type: String },
    breed: { type: String },
    age: { type: Number},
    healthStatus: { type: Number, default: 100 },
    adoptedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    photo: { type: String, default: 'default.jpg' },
  });

  Pokemon = mongoose.model<PokemonModel>('Pokemon', PokemonSchema);
}

export default Pokemon;
