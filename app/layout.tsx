import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "builder-bot — Your identity has an address.",
  description:
    "Claim your personal website address at you.builder-bot.com. Powered by an AI chat builder and a growing social network of personal sites.",
  keywords: [
    "personal website",
    "AI website builder",
    "personal address",
    "builder-bot",
    "social network",
  ],
  openGraph: {
    title: "builder-bot — Your identity has an address.",
    description:
      "Claim your personal website address at you.builder-bot.com. Powered by an AI chat builder and a growing social network of personal sites.",
    url: "https://builder-bot.com",
    siteName: "builder-bot",
    type: "website",
    images: [
      {
        url: "/images/og-builder-bot.jpg",
        width: 1200,
        height: 630,
        alt: "builder-bot — Your identity has an address.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "builder-bot — Your identity has an address.",
    description:
      "Claim your personal website address at you.builder-bot.com. Powered by an AI chat builder.",
    images: ["/images/og-builder-bot.jpg"],
  },
  metadataBase: new URL("https://builder-bot.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0B0F] text-[#F4F4F6] antialiased font-sans">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}