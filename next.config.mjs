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
  async rewrites() {
    return [
      // Slidev アセット: /:lang/presentations/:title/assets/* -> /public/:lang/presentations/:title/assets/*
      {
        source: '/:lang(ja|en)/presentations/:title/:path(assets/.*)',
        destination: '/:lang/presentations/:title/:path',
      },
      // Slidev index.html (スラッシュあり): /:lang/presentations/:title/ -> /public/:lang/presentations/:title/index.html
      {
        source: '/:lang(ja|en)/presentations/:title/',
        destination: '/:lang/presentations/:title/index.html',
      },
      // Slidev index.html (スラッシュなし): /:lang/presentations/:title -> /public/:lang/presentations/:title/index.html
      {
        source: '/:lang(ja|en)/presentations/:title',
        destination: '/:lang/presentations/:title/index.html',
      },
    ];
  },
}

export default nextConfig
