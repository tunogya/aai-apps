import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TailwindIndicator } from "@/components/TailwindIndicator";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";
import Link from "next/link";
import "./styles/globals.css";
import "./styles/katex.min.css";
import CheckBalance from "@/components/CheckBalance";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const title = "AbandonAI";
const description = "Powered by OpenAI";

export const metadata: Metadata = {
  title,
  description,
  viewport:
    "width=device-width, viewport-fit=cover, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
  applicationName: "AbandonAI",
  metadataBase: new URL(process.env.AUTH0_BASE_URL!),
  themeColor: "#fff",
  openGraph: {
    images: "/favicon.svg",
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@abandonai",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "AbandonAI",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <UserProvider>
        <body className={`h-full w-full`}>
          <Link
            rel="stylesheet"
            prefetch
            href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          />
          <GoogleTagManager gtmId="G-HT9Q8GW970" />
          <TailwindIndicator />
          <CheckBalance />
          {props.children}
        </body>
      </UserProvider>
    </html>
  );
}
