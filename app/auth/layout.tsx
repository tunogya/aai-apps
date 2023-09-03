import React from "react";
export const runtime = "edge";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={"h-screen"}>{children}</div>;
}
