import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { brand } from "@/data/content";
import { CartProvider } from "@/lib/cart";
import { CurrencyDisplayProvider } from "@/lib/currency-display";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fuji-card.com"),
  title: {
    default: "Fuji Card | English & Japanese Sealed TCG",
    template: "%s | Fuji Card",
  },
  description: brand.tagline,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${figtree.variable}`}>
        <CartProvider>
          <CurrencyDisplayProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CurrencyDisplayProvider>
        </CartProvider>
      </body>
    </html>
  );
}
