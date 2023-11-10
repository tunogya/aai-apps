import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    // start a chat conversation api
    "/api/chat",
    // start a payment;
    // note: /api/checkout/callback is stripe callback url
    "/api/checkout",
    // CRUD conversation api
    "/api/conversation/:path*",
    // CRUD persona api
    "/api/persona/:path*",
    // Status api
    "/api/status/:path*",
    // generate note api
    "/api/token/:path*",
    // query usage
    "/api/usage/:path*",
    // billing page
    "/billing/:path*",
    // chat page
    "/chat/:path*",
    // developers page
    "/developers/:path*",
  ],
};
