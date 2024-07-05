import { NextRequest, NextResponse } from 'next/server';
import Pokemon from '@/models/Pokemon';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const pokemons = await Pokemon.find({});
    return NextResponse.json(pokemons);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching pokemons', error }, { status: 500 });
  }
}
