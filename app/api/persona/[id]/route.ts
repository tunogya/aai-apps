import { withApiAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const GET = withApiAuthRequired(async (req: NextRequest) => {
  return NextResponse.json({
    delete: true,
  });
});

const PATCH = withApiAuthRequired(async (req: NextRequest) => {
  return NextResponse.json({
    delete: true,
  });
});

const DELETE = withApiAuthRequired(async (req: NextRequest) => {
  return NextResponse.json({
    delete: true,
  });
});

export { GET, PATCH, DELETE };
