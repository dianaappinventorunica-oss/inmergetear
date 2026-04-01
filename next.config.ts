import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" es para servidores propios (Railway, VPS)
  // Para Vercel, se usa el modo por defecto (no necesita "output")
  // Si despliegas en Railway o VPS, descomenta la siguiente línea:
  // output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // Permitir imágenes de dominios externos si necesitas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
