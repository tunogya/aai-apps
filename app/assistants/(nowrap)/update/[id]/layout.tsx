import { Metadata } from "next";
import { ReactNode } from "react";

export const runtime = "edge";

const title = "Update an assistant";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};

export default function Layout(props: { children: ReactNode }) {
  return <>{props.children}</>;
}
