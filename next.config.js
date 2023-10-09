/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "s3.us-west-2.amazonaws.com",
      "unsplash.com",
      "images.unsplash.com",
    ],
    minimumCacheTTL: 60,
    remotePatterns: [{
      hostname: 's3.us-west-2.amazonaws.com',
      protocol: 'https',
      port: '',
      pathname: '/my-bucket/**',
    }],
  },
};

module.exports = nextConfig;
