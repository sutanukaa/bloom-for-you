import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import { GardenBackground } from "@/components/GardenBackground";
import { AmbienceToggle } from "@/components/AmbienceToggle";

// A different soul from the scrapbook: soft storybook serif + clean rounded body.
const fraunces = Fraunces({ variable: "--font-hand", subsets: ["latin"], style: ["normal", "italic"] });
const karla = Karla({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bloom for you 🌱",
  description: "plant a seed with a secret note inside — it blooms in 3 real days",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GardenBackground />
        {children}
        <AmbienceToggle />
      </body>
    </html>
  );
}
