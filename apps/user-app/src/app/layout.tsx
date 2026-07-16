import type { Metadata } from "next";
import { Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../../provider";
import { Toaster } from "@/components/ui/toaster";

const workSans = Work_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
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
