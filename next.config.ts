import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Allow serving both local and remote images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true, // Allow SVG files
    contentDispositionType: 'attachment', // Handle downloads properly
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Secure SVG handling
  },
};

export default config;
