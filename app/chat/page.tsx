import React from "react";
import Chat from "@/app/chat/Chat";

export const runtime = "edge";

export default async function SSRPage() {
  return <Chat />;
}
