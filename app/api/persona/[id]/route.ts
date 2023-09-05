import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";
import ddbDocClient from "@/utils/ddbDocClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const GET = withApiAuthRequired(async (req: NextRequest, { params }) => {
  const session = await getSession();
  const sub = session?.user.sub;
  const id = params?.id;
  // const data = await ddbDocClient.send(new GetCommand({
  //   TableName: 'abandonai-dev',
  //   Key: {
  //     PK: sub,
  //     SK: `PERSONA#`
  //   }
  // }))

  return NextResponse.json({
    sub: sub,
    p_id: id,
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
