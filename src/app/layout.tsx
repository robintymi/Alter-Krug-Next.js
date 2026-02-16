import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Tangerine } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSiteContent } from "@/app/actions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const tangerine = Tangerine({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-tangerine",
});

export const metadata: Metadata = {
  title: "Alter Krug Kallinchen",
  description: "Hotel & Restaurant am Motzener See",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen antialiased",
          manrope.variable,
          cormorant.variable,
          tangerine.variable
        )}
      >
        {content && <Header content={content.header} />}
        <div className="min-h-screen">{children}</div>
        {content && <Footer content={content.footer} />}
      </body>
    </html>
  );
}
