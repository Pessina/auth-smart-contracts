import type { Metadata } from "next";

import "./globals.css";
import GoogleProvider from "./_providers/GoogleProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`antialiased h-full w-full`}
        suppressHydrationWarning
      >
        <GoogleProvider>
          {children}
        </GoogleProvider>
      </body>
    </html>
  );
}