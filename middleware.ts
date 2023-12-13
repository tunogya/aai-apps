import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/api/audio/:path*",
    "/api/images/:path*",
    "/api/chat/:path*",
    "/api/files/:path*",
    "/api/conversation/:path*",
    "/api/assistants/:path*",
    "/api/customer/:path*",
    "/api/serper/:path*",
    "/billing/:path*",
    "/chat/:path*",
    "/assistants/:path*",
  ],
};
