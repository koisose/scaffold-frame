# 🏗 Scaffold-ETH 2 and Farcaster Frame

Creating a farcaster composer action using scaffold-eth

```shell
npx create-eth@latest -e koisose/scaffold-frame
```

## 🫂Farcaster frame

**Frames Introduction**

Frames are a way to build interactive apps that run directly in a Farcaster social feed.

They can be used to create rich in-feed experiences for web applications:

*  Newsletters shared from [Paragraph](https://paragraph.xyz/) can be read inline and subscribed to in-feed

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)


## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd <your dapp name>
```

2. Add environment variable

```
cd packages/nextjs
cp .env.example .env.local
```

and then fill out the environment variable

```
NEYNAR=
MONGO=
GROQ_API_KEY=
NEXT_PUBLIC_URL=
AIRSTACK_API_KEY=
```

For `NEYNAR` environment variable you can get api key from https://neynar.com/ 

For `MONGO` you can create free database in https://www.mongodb.com/cloud/atlas/register

For `GROQ_API_KEY` you can get in https://console.groq.com/keys

For `NEXT_PUBLIC_URL` is your public url you can create one using https://github.com/cloudflare/cloudflared

For `AIRSTACK_API_KEY` you can get api key from https://airstack.xyz/

3. How to run

First run your app:

```
yarn start
```

Then in new terminal run cloudflared:

```
cloudflared tunnel --url http://localhost:3000
```

Copy paste the url you got to `NEXT_PUBLIC_URL` env variable then open https://warpcast.com/~/developers/composer-actions then input the `<NEXT_PUBLIC_URL>/api/roaster` in `Post URL` type something then click `Test Action` button, if you successfully run this then you will see your composer action 

# Youtube tutorial

https://www.youtube.com/watch?v=ErMzcH4txdw
