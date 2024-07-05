'use client';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Pokemon {
  photo: string
  _id: string;
  name: string;
  breed: string;
  age: number;
  healthStatus: number;
  adoptedBy?: string | null;
}

export default function Page() {
  const { status } = useSession();
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("/api/pokemons");
        if (!response.ok) {
          throw new Error("Failed to fetch pokemons");
        }
        const data: Pokemon[] = await response.json();
        setPokemons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <button
          className="border border-solid border-black rounded"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          Sign Out
        </button>
      );
    } else if (status === "loading") {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return (
        <Link
          href="/login"
          className="border border-solid border-black rounded"
        >
          Sign In
        </Link>
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl">Pokiemonn</h1>
      {showSession()}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <section className="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-y-20 gap-x-14 mt-10 mb-5">
          {pokemons.map((pokemon) => (
            <div key={pokemon._id} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
              <a href="#"/>
              <img
        src={pokemon.photo ? `${pokemon.photo}` : 'https://via.placeholder.com/150'} // Replace with your default image URL or placeholder
        alt={pokemon.name}
        className="h-80 w-72 object-cover rounded-t-xl"
      />
              <div className="px-4 py-3 w-72">
                <span className="text-gray-400 mr-3 uppercase text-xs">Brand</span>
                <p className="text-lg font-bold text-black truncate block capitalize">{pokemon.name}</p>
                <div className="flex-col items-center">
                  <p className="text-lg font-semibold text-black cursor-auto my-3">{pokemon.breed}</p>
                  <p className="text-lg font-semibold text-black cursor-auto my-3">{pokemon.age}</p>
                  <p className="text-lg font-semibold text-black cursor-auto my-3">{pokemon.healthStatus}</p>
                  {pokemon.adoptedBy ? (
                    <p className="text-lg font-semibold text-black cursor-auto my-3">Adopted By: {pokemon.adoptedBy}</p>
                  ) : (
                    <p className="text-lg font-semibold text-black cursor-auto my-3">Ready to Adopt</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
