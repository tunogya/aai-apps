import React from "react";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export default async function SSRPage() {
  const session = await getSession();
  return <div>Billing</div>;
}
