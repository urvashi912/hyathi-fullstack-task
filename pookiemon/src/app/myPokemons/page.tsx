"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Pokemon {
  _id: string;
  name: string;
  breed: string;
  age: number;
  healthStatus: number;
}

export default function AdoptedPokemonsPage() {
  const { data: session, status } = useSession();
  const [adoptedPokemons, setAdoptedPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdoptedPokemons = async () => {
      try {
        const response = await fetch('/api/pokemons/adopted/' + encodeURIComponent(session?.user?.email ?? ''));
        if (!response.ok) {
          throw new Error('Failed to fetch adopted Pokémon');
        }
        const data: Pokemon[] = await response.json();
        setAdoptedPokemons(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchAdoptedPokemons();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleFeed = async (pokemonId: string) => {
    try {
      const response = await fetch(`/api/pokemons/${pokemonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.email,
        }),
      });

      if (response.ok) {
        const updatedPokemons = adoptedPokemons.map((pokemon) =>
          pokemon._id === pokemonId ? { ...pokemon, healthStatus: pokemon.healthStatus + 5 } : pokemon
        );
        setAdoptedPokemons(updatedPokemons);
      } else {
        throw new Error('Failed to feed Pokémon');
      }
    } catch (error) {
      console.error('Error feeding Pokémon:', error);
    }
  };

  const handleUnadopt = async (pokemonId: string) => {
    try {
      const response = await fetch(`/api/pokemons/${pokemonId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.email,
        }),
      });

      if (response.ok) {
        const updatedPokemons = adoptedPokemons.filter((pokemon) => pokemon._id !== pokemonId);
        setAdoptedPokemons(updatedPokemons);
      } else {
        throw new Error('Failed to unadopt Pokémon');
      }
    } catch (error) {
      console.error('Error unadopting Pokémon:', error);
    }
  };

  const showLoading = <div>Loading...</div>;
  const showError = <div>Error: {error}</div>;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Adopted Pokémon</h1>

      {status === 'loading' && showLoading}
      {status === 'error' && showError}

      {status === 'authenticated' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adoptedPokemons.map((pokemon) => (
            <div key={pokemon._id} className="border rounded p-4">
              <h2 className="text-lg font-semibold">{pokemon.name}</h2>
              <p className="text-gray-500 mb-2">{pokemon.breed}</p>
              <p>Age: {pokemon.age}</p>
              <p>Health Status: {pokemon.healthStatus}</p>

              <div className="mt-4">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                  onClick={() => handleFeed(pokemon._id)}
                >
                  Feed
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => handleUnadopt(pokemon._id)}
                >
                  Unadopt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {status !== 'authenticated' && (
        <Link href="/login" className="bg-blue-500 text-white py-2 px-4 rounded mt-4 inline-block">
          Sign In to View Adopted Pokémon
        </Link>
      )}
    </main>
  );
}
