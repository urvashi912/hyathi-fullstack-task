import { connectDB } from '@/lib/mongodb';
import Pokemon from '@/models/Pokemon';
import User from '@/models/User';

type Params = {
  teams: string; // Assuming 'team' represents the user's email
};

export async function GET(request: Request, { params }: { params: Params }) {
    const userEmail = params.teams; // Extracting user email from params
    // Ensure userEmail contains the expected email string
    console.log('User Email:', userEmail);

  console.log('API received request to fetch adopted Pokémon for user:', userEmail);
  await connectDB();

  try {
    // Find the user by email (ensure case insensitivity)
    const user = await User.findOne({ email: userEmail.toLowerCase() }).lean().exec();
    if (!user) {
      console.error('User not found:', userEmail);
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    console.log('User found:', user);

    // Find all Pokémon adopted by this user
    const adoptedPokemons = await Pokemon.find({ adoptedBy: user._id }).lean().exec();
    return new Response(JSON.stringify(adoptedPokemons), { status: 200 });
  } catch (error) {
    console.error('Error fetching adopted Pokémon:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error fetching adopted Pokémon', error }), { status: 500 });
  }
}
