import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import PusherServer from "pusher";

const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const POST = async (req: NextRequest) => {
  // @ts-ignore
  const { user } = await getSession();
  const form = new URLSearchParams(await req.text());
  const socket_id = form.get("socket_id")!;
  const channel_name = form.get("channel_name")!;
  if (channel_name.startsWith("private-")) {
    if (channel_name.split("-")[1] !== user?.sub?.replace("|", "")) {
      return NextResponse.json({ auth: false });
    }
  }

  const data = {
    user_id: user.sub,
  };

  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    data,
  );

  return NextResponse.json(authResponse);
};

export { POST };
