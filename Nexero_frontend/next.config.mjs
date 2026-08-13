/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Any call to /api/backend/* is transparently forwarded to the .NET API
        // This eliminates all CORS issues in development
        source: '/api/backend/:path*',
        destination: 'http://localhost:5097/api/:path*',
      },
    ];
  },
};

export default nextConfig;
