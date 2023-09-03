import React from "react";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";
export const runtime = "edge";
export default withPageAuthRequired(
  async function SSRPage() {
    const session = getSession();
    return (
      <div className="mb-5" data-testid="ssr">
        <h1 data-testid="ssr-title">Server-side Rendered Page</h1>
        <div data-testid="ssr-text">
          <p>
            You can protect a server-side rendered page by wrapping it with{" "}
            <code>withPageAuthRequired</code>. Only logged in users will be able
            to access it. If the user is logged out, they will be redirected to
            the login page instead.{" "}
          </p>
        </div>
      </div>
    );
  },
  { returnTo: "/ssr" },
);
