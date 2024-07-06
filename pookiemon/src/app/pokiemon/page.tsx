"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Pokemon {
  photo: string;
  _id: string;
  name: string;
  breed: string;
  age: number;
  healthStatus: number;
  adoptedBy?: string | null;
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(`/api/pokemons/`);
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

  const handleAdopt = async (pokemonId: string) => {
    // Ensure session.user has an 'id' property

    if (!session?.user) {
      alert("You must be signed in to adopt a Pokemon");
      return;
    }

    try {
      console.log("User Session Data:", session.user);
      const response = await fetch(`/api/pokemons/${pokemonId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: (session.user as { email: string }).email,
        }),
      });
      console.log("User Session Data:", session.user);
      if (response.ok) {
        const data = await response.json();
        console.log("USER DATA", data);
        const updatedPokemons = pokemons.map((pokemon) => {
          if (pokemon._id === pokemonId) {
            return {
              ...pokemon,
              adoptedBy: data.adoptedBy,
              adopterName: data.adopterName,
            };
          }
          return pokemon;
        });
        setPokemons(updatedPokemons);
      } else {
        console.log("User Session Data:", session.user);
        console.error("Failed to adopt Pokemon");
      }
    } catch (error) {
      console.error("Error adopting Pokemon:", error);
    }
  };

  const handleUnadopt = async (pokemonId: string) => {
    if (!session?.user) {
      alert("You must be signed in to unadopt a Pokemon");
      return;
    }

    try {
      const response = await fetch(`/api/pokemons/${pokemonId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: (session.user as { email: string }).email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPokemons = pokemons.map((pokemon) => {
          if (pokemon._id === pokemonId) {
            return {
              ...pokemon,
              adoptedBy: data.adoptedBy,
              adopterName: data.adopterName,
            };
          }
          return pokemon;
        });
        setPokemons(updatedPokemons);
      } else {
        console.error("Failed to adopt Pokemon");
      }
    } catch (error) {
      console.error("Error adopting Pokemon:", error);
    }
  };

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
      <h1 className="text-xl">
        {" "}
        {session ? (
          <p>Welcome, {session.user?.name}</p>
        ) : (
          <p>You must be signed in to view this content.</p>
        )}
      </h1>
      {showSession()}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <section className="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-y-20 gap-x-14 mt-10 mb-5">
          {pokemons.map((pokemon) => (
            <div
              key={pokemon._id}
              className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
            >
              <a href="#" />
              <img
                src={
                  pokemon.photo
                    ? `${pokemon.photo}`
                    : "https://via.placeholder.com/150"
                } // Replace with your default image URL or placeholder
                alt={pokemon.name}
                className="h-80 w-72 object-cover rounded-t-xl"
              />
              <div className="px-4 py-3 w-72">
                <span className="text-gray-400 mr-3 uppercase text-xs">
                  Brand
                </span>
                <p className="text-lg font-bold text-black truncate block capitalize">
                  {pokemon.name}
                </p>
                <div className="flex-col items-center">
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    {pokemon.breed}
                  </p>
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    {pokemon.age}
                  </p>
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    {pokemon.healthStatus}
                  </p>
                  {pokemon.adoptedBy ? (
                    <p className="text-lg font-semibold text-black cursor-auto my-3">
                      Adopted By: {pokemon.adoptedBy}
                    </p>
                  ) : (
                    <button
                      className="rounded-lg px-8 py-2 text-xl bg-violet-600 text-white hover:bg-violet-500 duration-300"
                      onClick={() => handleAdopt(pokemon._id)}
                    >
                      Adopt Me
                    </button>
                  )}
                  {pokemon.adoptedBy && (
                    <button
                      className="rounded-lg px-8 py-2 text-xl bg-red-600 text-white hover:bg-red-500 duration-300"
                      onClick={() => handleUnadopt(pokemon._id)}
                    >
                      Unadopt
                    </button>
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
