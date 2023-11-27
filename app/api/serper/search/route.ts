import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// @ts-ignore
export async function POST(req: NextRequest): Promise<NextResponse> {
  // @ts-ignore
  const { user } = await getSession();
  const sub = user.sub;

  let { q, num = 10 } = await req.json();

  try {
    const data = await fetch(`https://google.serper.dev/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.SERPER_API_KEY!,
      },
      body: JSON.stringify({
        q,
        num,
      }),
    }).then((res) => res.json());
    return NextResponse.json(data);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}