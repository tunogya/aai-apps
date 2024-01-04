import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/api/assistants/:path*",
    "/api/audio/:path*",
    "/api/chat/:path*",
    "/api/checkout",
    "/api/customer",
    "/api/files",
    "/api/images/:path*",
    "/api/moderations",
    "/api/serper/:path*",
    "/billing/:path*",
    "/chat/:path*",
    "/assistants/:path*",
  ],
};
