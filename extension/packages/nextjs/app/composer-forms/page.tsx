"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
// import { postComposerCreateCastActionMessage } from "frog/next";
import type { NextPage } from "next";
import {
  generateRoastOrPraise,
  getParseString,
  getUserByFid, // , savedata
} from "~~/lib/gaianet";
import "~~/styles/hide.css";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const searchParams = useSearchParams();
  const fid = searchParams.get("fid");
  const originalText = searchParams.get("originalText");
  const { data: creator, isLoading } = useQuery({
    queryKey: ["user", fid],
    queryFn: () => getUserByFid(fid),
  });
  const { data: parsedString, isLoading: loadingParsed } = useQuery({
    queryKey: ["parseString", originalText],
    queryFn: () => getParseString(originalText),
  });
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [user, setUsername] = useState("");
  if (isLoading || loadingParsed) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-4xl font-bold text-white">Roast or Praise Farcaster user</h1>
        <p className="mt-4 text-lg text-white">Input farcaster username</p>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <input
          disabled={loading}
          type="text"
          value={parsedString?.mentionsUsername.length > 0 ? parsedString.mentionsUsername[0] : "" || (user as any)}
          onChange={e => setUsername(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-md"
        />
        <div className="mt-4 flex space-x-4">
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setGenerated("");
              try {
                setType("roast");
                const text = await generateRoastOrPraise(user as string, "roast");
                setGenerated(text.choices[0].message.content);
              } catch (e) {
                //@ts-ignore
                setLoading(false);
                notification.error("Sorry there is error on our end please roast again");
              }
              setLoading(false);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "loading..." : "Roast"}
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              setGenerated("");
              setType("praise");
              try {
                const text = await generateRoastOrPraise(user as string, "praise");
                setGenerated(text.choices[0].message.content);
              } catch (e) {
                setLoading(false);

                notification.error("Sorry there is error on our end please praise again");
              }
              setLoading(false);
            }}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "loading..." : "Praise"}
          </button>
        </div>
      </div>
      {generated.length > 0 && (
        <>
          <div className="mt-8 w-[10em]] mx-10 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center text-center ">
              <p className="text-black">{generated}</p>
            </div>
          </div>
          <div className="flex justify-center my-5">
            <button
              onClick={async () => {
                // setLoading(true);
                // const url = process.env.NEXT_PUBLIC_URL;
                console.log({ user, creator, type, generated });
                // savedata(user, creator, type, generated).then(data=>{
                //   postComposerCreateCastActionMessage({
                //     text: originalText as string,
                //     embeds: [`${url}/api/roastorpraise/${data.id}`],
                //   });
                //   setLoading(false);
                // }).catch(e=>{
                //   console.log(e.message)
                //   setLoading(false);
                // notification.error("sorry there is an error in our end please try again");
                // });
              }}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-24"
            >
              Share
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
