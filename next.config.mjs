/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_TEST_API_URL}`,
        port: '',
        pathname: '/storage/**',
      },
    ]

  },
  reactStrictMode: false,
};

export default nextConfig;
