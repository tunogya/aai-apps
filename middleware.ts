import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/api/chat",
    "/api/checkout",
    "/api/conversation/:path*",
    "/api/persona/:path*",
    "/api/customer/:path*",
    "/billing/:path*",
    "/chat/:path*",
    "/developers/:path*",
  ],
};
