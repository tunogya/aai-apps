import './globals.css'
import type {Metadata} from 'next'
import "cal-sans";
import { Inter } from 'next/font/google'
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abandon AI',
  description: 'Powered by OpenAI',
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
  applicationName: 'Abandon AI',
  themeColor: '#fff',
  openGraph: {
    images: '/apple-touch-icon.png',
    title: 'Abandon AI',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={`${inter.className} h-screen w-screen`}>
    <Script src={'https://www.googletagmanager.com/gtag/js?id=G-EDPQ3K7EN8'}/>
    <Script id='google-tag-manager' strategy='afterInteractive'>
      {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-EDPQ3K7EN8');
              `}
    </Script>
    <Script id={'sw'}>
      {`
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
        `}
    </Script>
    {children}
    </body>
    </html>
  )
}
