import type { ChatCompletion, Result } from "./type";
import Groq from "groq-sdk";
import ky from "ky";

async function groqFallback(username: string, roastOrPraise: "roast" | "praise", detail: any) {
  const API_KEY = process.env.GROQ_API_KEY;
  const groq = new Groq({
    apiKey: API_KEY,
  });
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          roastOrPraise === "roast" ? "you're a roast master" : "You are a helpful, respectful, and honest praiser.",
      },
      {
        role: "user",
        content: `give a short and ${
          roastOrPraise === "roast" ? "harsh roasting" : "glowing praise"
        } for the following social media user: "${username}". Here are the details: ${detail}`,
      },
    ],
    model: "gemma-7b-it",
  });
  // const text = completion.choices[0]?.message?.content;
  return completion;
}

export async function getUserByUserName(username: string): Promise<Result> {
  const response = await ky.get(`https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`, {
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR,
    },
  });

  return response.json<Result>();
}

export async function getCastByHash(hash: string): Promise<any> {
  const response = await ky.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`, {
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR,
    },
  });

  return response.json();
}
export async function getUserBulk(fids: string): Promise<any> {
  const response = await ky.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, {
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR,
    },
  });

  return response.json();
}

async function randomNode() {
  const response = await ky.get("https://api.gaianet.ai/api/v1/network/nodes/");
  const data = await response.json();

  const objectArray = (data as any).data.objects.filter(
    (obj: any) => obj.status === "ONLINE" && obj.model_name && obj.model_name.toLowerCase().includes("llama"),
  );
  const random = objectArray[Math.floor(Math.random() * objectArray.length)];
  return random;
}
async function getAllCast(fid: any) {
  const response = await ky.get(`https://client.warpcast.com/v2/profile-casts?fid=${fid}&limit=5`);
  return response.json();
  // Process the response here
}
export async function generateRoastOrPraise(
  username: string,
  roastOrPraise: "roast" | "praise",
): Promise<ChatCompletion> {
  const user = await getUserByUserName(username);
  const { fid, activeStatus, displayName, followerCount, followingCount, powerBadge, profile } = user.result.user;
  const last5Post = [] as any;
  try {
    const last5 = await getAllCast(fid);
    //@ts-ignore
    populars = last5.result.casts.map(a => ({ text: a.text }));
  } catch {
    console.log("no populars");
  }

  const detail = JSON.stringify({
    activeStatus,
    displayName,
    followerCount,
    followingCount,
    powerBadge,
    profile,
    last5Post,
  });
  try {
    const random = await randomNode();
    const response = await ky.post(`https://${random.subdomain}/v1/chat/completions`, {
      json: {
        messages: [
          {
            role: "system",
            content:
              roastOrPraise === "roast"
                ? "you're a roast master for a social media website called farcaster"
                : "You are a helpful, respectful, and honest praiser for a social media website called farcaster",
          },
          {
            role: "user",
            content: `give a short and ${
              roastOrPraise === "roast" ? "harsh roasting" : "glowing praise"
            } for the following social media user: "${username}". Here are the details: ${detail}`,
          },
        ],
        model: random.model_name,
      },
      retry: {
        limit: 3,
        methods: ["post"],
        statusCodes: [408, 504],
        backoffLimit: 3000,
      },
      timeout: 50000,
    });
    return response.json<ChatCompletion>();
  } catch {
    const response = await groqFallback(username, roastOrPraise, detail);
    return response as any;
  }
}
