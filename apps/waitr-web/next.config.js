/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  sassOptions: {
    includePaths: ['./src'],
  },
  // Enable CSS modules
  // cssModules: true,
  // Redirect root to dashboard for now (can be changed later)
  async redirects() {
    return [];
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;