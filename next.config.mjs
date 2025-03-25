/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
        port: '',
        pathname: '/storage/**',
      },
    ],
    unoptimized: true

  },
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  }
};

export default nextConfig;
