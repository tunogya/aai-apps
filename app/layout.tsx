import './globals.css'
import type {Metadata} from 'next'
import "cal-sans";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abandon AI',
  description: 'Powered by OpenAI',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className={`${inter.className} h-screen w-screen`}>
    {children}
    </body>
    </html>
  )
}
