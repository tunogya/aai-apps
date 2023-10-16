import { NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

const GET = async (req: NextRequest) => {
  const session = await getSession();
};

const POST = async (req: NextRequest) => {
  const session = await getSession();
};

export { GET, POST };
