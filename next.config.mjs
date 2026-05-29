import path from 'path'
import fs from 'fs'

function apiImagePatterns() {
  const base =
    process.env.NEXT_PUBLIC_API_URL || 'http://cooperp.freeddns.org:8076'
  try {
    const u = new URL(base)
    const port = u.port ? `:${u.port}` : ''
    return [
      {
        protocol: u.protocol.replace(':', ''),
        hostname: u.hostname,
        port: u.port || '',
        pathname: '/web/image/**',
      },
      {
        protocol: u.protocol.replace(':', ''),
        hostname: u.hostname,
        port: u.port || '',
        pathname: '/storage/**',
      },
    ]
  } catch {
    return [
      {
        protocol: 'http',
        hostname: 'cooperp.freeddns.org',
        port: '8076',
        pathname: '/web/image/**',
      },
    ]
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: apiImagePatterns(),
    unoptimized: process.env.NEXT_PUBLIC_SEO === "false" ? true : false
  },

  experimental: {
    scrollRestoration: true,
  },
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    if (dir && outDir && fs.existsSync(path.join(dir, '.htaccess'))) {
      fs.copyFileSync(path.join(dir, '.htaccess'), path.join(outDir, '.htaccess'))
    } else {
      // console.log('No .htaccess file found')
    }
    return defaultPathMap
  }
};

// Static export disables API routes; keep proxy available during `next dev`.
const useStaticExport =
  process.env.NEXT_PUBLIC_SEO === "false" &&
  process.env.NODE_ENV !== "development";

if (useStaticExport) {
  nextConfig.output = "export";
}
export default nextConfig;
