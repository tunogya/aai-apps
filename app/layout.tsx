import type { Metadata } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import "tailwindcss/tailwind.css";
import "@/styles/global.css";
const title = "AbandonAI";
const description = "Powered by Abandon Inc.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "abandon.ai",
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
  metadataBase: new URL("https://apps.abandon.ai"),
  manifest: "/manifest.json",
  appleWebApp: {
    title: "abandon.ai",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={"https://www.googletagmanager.com/gtag/js?id=G-HT9Q8GW970"}
        />
        <Script async src={"https://js.stripe.com/v3/pricing-table.js"} />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-HT9Q8GW970');
              `}
        </Script>
        <Script id="app-height-script" strategy="afterInteractive">
          {`
            const appHeight = () => {
              const doc = document.documentElement
              doc.style.setProperty('--app-height', \`\${window.innerHeight}px\`)
            }
            window.addEventListener('resize', appHeight)
            appHeight()
          `}
        </Script>
        {props.children}
      </body>
    </html>
  );
}
