"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { NextPage } from "next";
import "~~/styles/hide.css";

// import { generateRoastOrPraise } from "~~/lib/gaianet";
const Home: NextPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("username");
  // const originalText = searchParams.get('originalText')
  const [generated] = useState("");
  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-4xl font-bold text-white">Roast or Praise Farcaster user</h1>
        <p className="mt-4 text-lg text-white">Input farcaster username</p>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <input type="text" value={query as any} className="border border-gray-400 px-4 py-2 rounded-md" />
        <div className="mt-4 flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Roast</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Praise</button>
        </div>
      </div>
      {generated.length > 0 && (
        <>
          <div className="mt-8 w-[10em]] mx-10 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center text-center ">
              <p className="text-black">This is some centered text.</p>
            </div>
          </div>
          <div className="flex justify-center my-5">
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-24">
              Share
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
