import type { Metadata } from "next";
import Script from "next/script";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";
import Link from "next/link";
import "./styles/globals.css";
import "./styles/katex.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import dynamic from "next/dynamic";

const TailwindIndicator = dynamic(
  () => import("@/app/components/TailwindIndicator"),
);

const title = "AbandonAI";
const description =
  "AbandonAI is a free-to-use AI system. It can help you with coding, drawing and more. All in one place.";

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
    <html lang="en">
      <UserProvider>
        <body className={`h-full w-full`}>
          <Link
            rel="stylesheet"
            prefetch
            href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          />
          <Script
            src={"https://www.googletagmanager.com/gtag/js?id=G-HT9Q8GW970"}
          />
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-HT9Q8GW970');
              `}
          </Script>
          <TailwindIndicator />
          {props.children}
        </body>
      </UserProvider>
    </html>
  );
}
