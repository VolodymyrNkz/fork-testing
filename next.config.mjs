import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ['s3-alpha-sig.figma.com', 'hare-media-cdn.tripadvisor.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hare-media-cdn.tripadvisor.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL,
  },
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
