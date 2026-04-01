import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InmérgeteAR - Experiencias Inmersivas Académicas",
  description:
    "Plataforma académica de Realidad Aumentada. Sube fotos, genera experiencias 360° y accede desde tu celular con códigos QR. Transforma la educación con tecnología inmersiva.",
  keywords: [
    "InmérgeteAR",
    "Realidad Aumentada",
    "360°",
    "Educación",
    "Experiencias Inmersivas",
    "QR",
    "Académico",
  ],
  authors: [{ name: "InmérgeteAR" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "InmérgeteAR - Experiencias Inmersivas Académicas",
    description:
      "Transforma tus fotos en experiencias inmersivas con Realidad Aumentada para el ámbito académico.",
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
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
