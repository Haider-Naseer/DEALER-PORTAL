import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honda Dealer Portal",
  description: "Sales, revenue and FBR overview for your Honda dealership.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
