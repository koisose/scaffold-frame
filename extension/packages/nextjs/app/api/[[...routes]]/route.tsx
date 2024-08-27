/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { Box, Heading, Text, VStack, vars } from "~~/frog-ui/ui";
import { getAllCast, getUserByUserName, groqFallback, randomNode } from "~~/lib/gaianet";
import { getDataById } from "~~/lib/mongo";
import { parseString } from "~~/lib/parseString";

const app = new Frog({
  // imageAspectRatio: '1:1',
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      //@ts-ignore
      headers: {
        "x-airstack-hubs": process.env.AIRSTACK_API_KEY,
      },
    },
  },
  ui: { vars },
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Roast or praise farcaster user",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
app.composerAction(
  "/roaster",
  async c => {
    const data = c.actionData;
    //@ts-ignore
    const parsedData = await parseString(JSON.parse(decodeURIComponent(data.state)).cast.text);
    return c.res({
      title: "Roast or praise farcaster user",
      //@ts-ignore
      url: `${process.env.NEXT_PUBLIC_URL}/composer-forms?originalText=${
        JSON.parse(decodeURIComponent(data.state as any)).cast.text as any
      }${parsedData.mentionsUsername.length > 0 ? "&username=" + parsedData.mentionsUsername[0] : ""}`,
    });
  },
  {
    /* Name of the action – 14 characters max. */
    name: "Roast or praise",
    /* Description of the action – 20 characters max. */
    description: "Roasting or praising farcaster user",
    icon: "image",
    imageUrl: "https://frog.fm/logo-light.svg",
  },
);
app.frame("/", c => {
  return c.res({
    image: (
      <Box fontSize="16" textAlign="center" backgroundColor="blue">
        Hello world
      </Box>
    ),
    intents: [
      (
        <Button.Redirect
          location={`https://warpcast.com/~/developers/composer-actions?postUrl=${encodeURIComponent(
            (process.env.NEXT_PUBLIC_URL as string) + "/api/roaster",
          )}`}
        >
          try now
        </Button.Redirect>
      ) as any,
    ],
  });
});
app.frame("/roastorpraise/:id", async c => {
  const id = c.req.param("id");
  const data = await getDataById("roastorpraise", id);
  return c.res({
    imageAspectRatio: "1:1",
    image: `https://${process.env.MINIO_ENDPOINT}/image/file-${id}`,
    intents: [
      (
        <Button action={"/giveback/" + data.creator} value={data.type}>
          {data.type} back
        </Button>
      ) as any,
    ],
  });
});
app.frame("/giveback/:username", async c => {
  const { buttonValue } = c;
  const username = c.req.param("username");
  try {
    await getUserByUserName(username as string);
  } catch {
    return c.error({ message: "can't find that username" });
  }

  return c.res({
    image: (
      <Box grow alignVertical="center" alignHorizontal="center" padding="32">
        <VStack gap="4">
          <Heading>
            Your {username} of {buttonValue} still being processed, we will mention you in a cast when its done
          </Heading>
          <Text color="text200" size="20">
            powered by gaianet
          </Text>
        </VStack>
      </Box>
    ),
    intents: [(<Button.Reset>Back</Button.Reset>) as any],
  });
});
app.frame("/whats", async c => {
  const { buttonValue, inputText } = c;
  try {
    await getUserByUserName(inputText as string);
  } catch {
    return c.error({ message: "can't find that username" });
  }

  return c.res({
    image: (
      <Box grow alignVertical="center" alignHorizontal="center" padding="32">
        <VStack gap="4">
          <Heading>
            Your {buttonValue} of {inputText} still being processed, we will mention you in a cast when its done
          </Heading>
          <Text color="text200" size="20">
            powered by gaianet
          </Text>
        </VStack>
      </Box>
    ),
    intents: [(<Button.Reset>Back</Button.Reset>) as any],
  });
});
app.hono.get("/get/:id", async c => {
  const id = c.req.param("id");
  const data = await getDataById("roastorpraise", id);
  return c.json(data);
});
app.hono.get("/getallnodes", async c => {
  const data = await randomNode();
  return c.json(data);
});
app.hono.get("/getallcast/:fid", async c => {
  const fid = c.req.param("fid");
  const data = await getAllCast(fid);
  return c.json(data as any);
});
app.hono.post("/checkusername", async c => {
  const data = await c.req.parseBody({ all: true });
  const getUsername = await getUserByUserName(data.username as string);
  return c.json(getUsername);
});
app.hono.post("/groqfallback", async c => {
  const data = await c.req.parseBody({ all: true });
  const fallback = await groqFallback(data.username as string, data.roast as any, data.detail);
  return c.json(fallback);
});
devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
