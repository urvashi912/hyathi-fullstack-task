import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Pokemon from "@/models/Pokemon";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import User, { UserDocument } from "@/models/User";
import cron from 'node-cron'


type Params = {
  pokemonId: string;
};

export async function GET(request: Request, context: { params: Params }) {
  const pokemonId = context.params.pokemonId;
  await connectDB();
  try {
    const pokemon = await Pokemon.findById(pokemonId).lean();
    return NextResponse.json({ ...pokemon }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Params }) {
  const pokemonId = context.params.pokemonId;
  console.log("This is POKEMON ID", pokemonId);
  await connectDB();
  try {
    const body = await request.json();
    console.log("USER BODY", body);

    // Parse JSON body
    const userId = body.userId; // Extract userId from body

    if (!userId) {
      console.log("User ID not provided");
      return NextResponse.json({ success: false, message: "User ID not provided" }, { status: 400 });
    }

    const user = await User.findOne({ email: userId }).lean().exec() as UserDocument | null;;
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const adoptedById = user._id as unknown as mongoose.Types.ObjectId;
    const adopterName = user.name;
    const adopterEmailId = user.email
    console.log(adopterName, "This is adopted by ")

    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      console.log("Pokemon not found");
      return NextResponse.json({ success: false, message: "Pokemon not found" }, { status: 404 });
    }

    if (pokemon.adoptedBy) {
      console.log("Pokemon already adopted");
      return NextResponse.json({ success: false, message: "Pokemon already adopted" }, { status: 400 });
    }

    // Simulate adoption by setting adoptedBy field
    pokemon.adoptedBy = adoptedById;
    pokemon.adopterName = adopterName;
    pokemon.adopterEmailId = adopterEmailId

    console.log(`Pokemon adopted by ${adopterName}`);
    await pokemon.save();

    console.log("Pokemon adopted successfully by:", adoptedById);
    return NextResponse.json({ success: true, adoptedBy: adoptedById, adopterName: adopterName, adopterEmailId: adopterEmailId }, { status: 200 });

  } catch (error: any) {
    console.error("Error adopting Pokemon:", error);
    return NextResponse.json({ success: false, message: "Failed to adopt Pokemon", error }, { status: 500 });
  }
}


export async function DELETE(request: Request, context: { params: Params }) {
  const pokemonId = context.params.pokemonId;
  await connectDB();

  try {
    const body = await request.json();
    console.log("USER BODY", body);

    // Parse JSON body
    const userId = body.userId;
    const user = await User.findOne({ email: userId }).lean().exec() as UserDocument | null;
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const adoptedById = user._id as unknown as mongoose.Types.ObjectId;
    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      console.log("Pokemon not found");
      return NextResponse.json({ success: false, message: "Pokemon not found" }, { status: 404 });
    }


    if (!pokemon.adoptedBy) {
      console.log("Pokemon is not adopted");
      return NextResponse.json({ success: false, message: "Pokemon is not adopted" }, { status: 400 });
    }

    if (pokemon.adoptedBy?.toString() !== adoptedById.toString()) {
      return NextResponse.json({ success: false, message: "You can only unadopt your own adopted Pokemon" }, { status: 403 });

    }

    pokemon.adoptedBy = null;

    await pokemon.save();

    console.log("Pokemon unadopted successfully");
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error unadopting Pokemon:", error);
    return NextResponse.json({ success: false, message: "Failed to unadopt Pokemon", error }, { status: 500 });
  }
}


export async function PATCH(request: Request, context: { params: Params }) {
  const pokemonId = context.params.pokemonId;
  await connectDB();

  try {
    const body = await request.json();


    const userId = body.userId;


    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID not provided" }, { status: 400 });
    }

    const user = await User.findOne({ email: userId }).lean().exec();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      return NextResponse.json({ success: false, message: "Pokemon not found" }, { status: 404 });
    }

    if (pokemon.adoptedBy?.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "You can only feed your adopted Pokémon" }, { status: 403 });
    }

    pokemon.healthStatus += 5; // Increase health status by 10
    pokemon.lastFedAt = new Date();

    await pokemon.save();

    return NextResponse.json({ success: true, healthStatus: pokemon.healthStatus }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to feed Pokémon", error }, { status: 500 });
  }
}


