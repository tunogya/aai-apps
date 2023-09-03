import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const accessToken = req.headers.get("Authorization");

    return NextResponse.json({
      data: accessToken,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({
      data: "Hello",
    });
  } catch (error) {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
