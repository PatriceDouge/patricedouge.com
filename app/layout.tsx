import type { Metadata } from "next";
import { Fragment_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Fragment Mono ships a single weight (400). Synthetic bold is disabled in
// globals.css, so hierarchy comes from size, color and tracking instead.
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-fragment-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Patrice Douge",
    template: "%s | Patrice Douge",
  },
  description: "Software engineer. Dad. Lifts heavy, runs far.",
  openGraph: {
    title: "Patrice Douge",
    description: "Software engineer. Dad. Lifts heavy, runs far.",
    url: "https://patricedouge.com",
    siteName: "Patrice Douge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrice Douge",
    description: "Software engineer. Dad. Lifts heavy, runs far.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fragmentMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
