import React from "react";
import Chat from "@/app/chat/[[...id]]/Chat";

export const runtime = "edge";

export default async function SSRPage() {
  return <Chat />;
}
