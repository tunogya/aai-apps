import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async (req) => {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:shows']
    });

    return NextResponse.json({
      data: accessToken
    });
  } catch (error) {
    return NextResponse.json({ error: "error" }, { status:  500 });
  }
});