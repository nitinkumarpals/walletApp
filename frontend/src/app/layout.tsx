import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const workSans = localFont({
  src: "./fonts/WorkSans.woff2",
  variable: "--font-sans",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "NimbleWallet — Move Money at the Speed of Thought",
  description: "Next-generation fintech wallet with obsidian neon aesthetics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <Providers>
        <body className={`${workSans.variable} ${jetbrainsMono.variable}`}>
          <div>{children}</div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
