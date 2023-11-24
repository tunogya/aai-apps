import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/api/audio/:path*",
    "/api/images/:path*",
    "/api/chat",
    "/api/checkout",
    "/api/conversation/:path*",
    "/api/assistants/:path*",
    "/api/customer/:path*",
    "/billing/:path*",
    "/chat/:path*",
  ],
};
