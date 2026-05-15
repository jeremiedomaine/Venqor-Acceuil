import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { EdgeNavDrawer } from "@/components/edge-nav-drawer"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Venqor – Domaine des lauriers de la Bastide",
  description:
    "Tableau de bord B2B Venqor : événements, upsells et prestataires.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} bg-background`}>
      <body className="font-sans font-normal antialiased">
        <EdgeNavDrawer />
        {children}
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
