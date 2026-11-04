import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sheedo.art"),

  title: {
    default: "SHEEDO — The Digital Art Museum",
    template: "%s | SHEEDO",
  },

  description:
    "Discover the artistic world of Sheedo, an artist from Basra, Iraq. Explore a curated collection of paintings, drawings, and creative expressions.",

  applicationName: "SHEEDO Digital Art Museum",

  keywords: [
    "Sheedo",
    "Sheedo Art",
    "Digital Art Museum",
    "Paintings",
    "Drawings",
    "Basra Artist",
    "Iraqi Artist",
    "Contemporary Art",
  ],

  openGraph: {
    title: "SHEEDO — The Digital Art Museum",
    description:
      "A digital museum celebrating the paintings, drawings, and artistic world of Sheedo.",
    siteName: "SHEEDO",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "SHEEDO — The Digital Art Museum",
    description:
      "Explore the artistic world of Sheedo through paintings and drawings.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f1e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable}`}
      >
        <a className="skip-to-content" href="#main-content">
          Skip to content
        </a>

        <Navbar />

        <main id="main-content">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
