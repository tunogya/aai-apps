import { Metadata } from "next";
import { ReactNode } from "react";
import Dock from "@/components/Dock";
import Toolbar from "@/components/Toolbar";
import PrimaryNav from "@/components/Nav/PrimaryNav";

export const runtime = "edge";

const title = "Create new Persona";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
};

export default function Layout(props: { children: ReactNode }) {
  return <>{props.children}</>;
}
