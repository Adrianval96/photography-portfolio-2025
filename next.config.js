import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const DEFAULT_SERVER_URL = 'http://localhost:3000'

const VERCEL_BLOB_HOSTNAME = '*.blob.vercel-storage.com'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || DEFAULT_SERVER_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  images: {
    qualities: [75, 100],
    localPatterns: [
      {
        pathname: '/api/media/**',
      },
    ],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: 'https',
        hostname: VERCEL_BLOB_HOSTNAME,
      },
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
