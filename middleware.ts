import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    "/api/chat",
    "/api/conversation/:path*",
    "/api/generate",
    "/api/note/:path*",
    "/api/persona/:path*",
    "/api/upload",
    "/api/dashboard",
    "/api/usage/:path*",
    "/billing/:path*",
    "/chat/:path*",
    "/dashboard/:path*",
    "/note/:path*",
  ],
};
