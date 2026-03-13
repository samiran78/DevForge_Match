/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:3001'}/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${process.env.BACKEND_API_URL || 'http://localhost:3001'}/socket.io/:path*`,
      }
    ];
  },
};

module.exports = nextConfig;
