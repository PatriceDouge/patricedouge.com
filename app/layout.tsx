import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Patrice Douge",
    template: "%s | Patrice Douge",
  },
  description: "Software engineer. Writing about programming and technology.",
  openGraph: {
    title: "Patrice Douge",
    description: "Software engineer. Writing about programming and technology.",
    url: "https://patricedouge.com",
    siteName: "Patrice Douge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrice Douge",
    description: "Software engineer. Writing about programming and technology.",
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
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
