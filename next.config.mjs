/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: [],
  },
  /* // redirects 設定はコメントアウトしたまま -> 不要なら削除も可
  async redirects() {
    return [
      {
        source: '/slides',
        destination: '/slides/',
        permanent: true,
      },
    ];
  },
  */
  async rewrites() {
    return [
      {
        source: '/presentations',
        destination: '/presentations/index.html',
      },
      {
        source: '/presentations/',
        destination: '/presentations/index.html',
      },
      {
        source: '/presentations/assets/:path*',
        destination: '/presentations/assets/:path*',
      },
    ];
  },
}

export default nextConfig
