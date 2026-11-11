/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    agentUpgrade: 'security',
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/login', destination: '/api/auth' },
      { source: '/api/logout', destination: '/api/auth/logout' },
      { source: '/api/profile', destination: '/api/customer/profile' },
      { source: '/api/change-password', destination: '/api/customer/change-password' },
      { source: '/api/products/promotion', destination: '/api/products/discounted' },
      { source: '/api/admin/orders', destination: '/api/orders' },
      { source: '/api/dashboard', destination: '/api/admin/stats' },
      { source: '/api/system/logs', destination: '/api/admin/logs' },
      { source: '/api/system/settings', destination: '/api/admin/settings' },
      { source: '/api/reports/revenue', destination: '/api/admin/reports/revenue' },
      { source: '/api/reports/orders', destination: '/api/admin/reports/orders' },
      { source: '/api/reports/customers', destination: '/api/admin/customers' },
      { source: '/api/reports/inventory', destination: '/api/admin/reports/inventory' },
    ];
  },
};

module.exports = nextConfig;
