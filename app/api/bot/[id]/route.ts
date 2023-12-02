import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);
  return NextResponse.json(
    {
      message: "hello",
    },
    {
      status: 200,
    },
  );
};

export { POST };
