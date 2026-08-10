import type { Metadata } from "next";
import { Caveat, Patrick_Hand } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ variable: "--font-hand", subsets: ["latin"] });
const patrick = Patrick_Hand({ variable: "--font-body", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bloom for you 🌱",
  description: "plant a seed with a secret note inside — it blooms in 3 real days",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${caveat.variable} ${patrick.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
