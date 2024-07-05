"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Redirect if the user is already authenticated
    if (status === "authenticated") {
      router.push("/pokiemon");
    }
  }, [status, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) {
      setError(res.error as string);
    } else if (res?.ok) {
      router.push("/pokiemon");
    }
  };

  return (
    <>
    <section className="flex flex-col md:flex-row h-screen items-center">
  <div className="bg-blue-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
    <img 
      src="https://cdn.vox-cdn.com/thumbor/rrBRu45EpQ-PEi5pHlN1SxBy8wM=/0x0:1920x1080/1820x1213/filters:focal(807x387:1113x693):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/72009235/captain_pikachu.6.jpg" 
      alt="" 
      className="w-full h-full object-cover" 
    />
  </div>

  <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
    <div className="w-full h-100">
      <h1 className="text-xl font-bold">Welcome to Pokiemon</h1>
      <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

      <form className="mt-6" action="#" method="POST" onSubmit={handleSubmit}>
      {error && <div className="text-black">{error}</div>}
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input 
            type="email"
            placeholder="Email"
            name="email"
            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" 
            autoFocus 
            autoComplete="email" 
            required 
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Enter Password" 
            className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
        >
          Log In
        </button>
      </form>

      <hr className="my-6 border-gray-300 w-full" />
      <Link
          href="/register"
          className="text-blue-500 hover:text-blue-700 font-semiboldk"
        >
          Dont have an account?
        </Link>
      

      <p className="text-sm text-gray-500 mt-12">&copy; 2020 Abstract UI - All Rights Reserved.</p>
    </div>
  </div>
</section>

    </>
    // <section className="w-full h-screen flex items-center justify-center text-black">
    //   <form
    //     className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2
    //     border border-solid border-black bg-white rounded"
    //     onSubmit={handleSubmit}
    //   >
    //     {error && <div className="text-black">{error}</div>}
    //     <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
    //     <label className="w-full text-sm">Email</label>
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       className="w-full h-8 border border-solid border-black rounded p-2"
    //       name="email"
    //     />
    //     <label className="w-full text-sm">Password</label>
    //     <div className="flex w-full">
    //       <input
    //         type="password"
    //         placeholder="Password"
    //         className="w-full h-8 border border-solid border-black rounded p-2"
    //         name="password"
    //       />
    //     </div>
    //     <button className="w-full border border-solid border-black rounded">
    //       Sign In
    //     </button>
    //     <Link
    //       href="/register"
    //       className="text-sm text-[#888] transition duration-150 ease hover:text-black"
    //     >
    //       Dont have an account?
    //     </Link>
    //   </form>
    // </section>
  );
}
