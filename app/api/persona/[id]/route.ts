import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({
      data: "Hello",
    });
  } catch (error) {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
};
