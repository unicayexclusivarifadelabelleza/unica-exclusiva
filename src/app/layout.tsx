import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Única y Exclusiva Rifa de la Belleza",
  description: "Participa en las rifas más exclusivas y gana premios increíbles de belleza. Boletos desde 1000 pesos.",
  keywords: ["Rifa", "Sorteos", "Premios", "Belleza", "Mercado Pago"],
  authors: [{ name: "Única y Exclusiva" }],
  openGraph: {
    title: "Única y Exclusiva Rifa de la Belleza",
    description: "Participa en las rifas más exclusivas y gana premios increíbles",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
