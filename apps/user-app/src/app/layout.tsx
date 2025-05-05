import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../../provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "NimbleWallet",
  description: "A secure and easy to use wallet",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <Providers>
        <body className="bg-gray-100 dark:bg-gray-900">
          <div>{children}</div>
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
