/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'yspdxycvowpczkmwskfj.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/car-img/**',
          },
        ],
      },
}

module.exports = nextConfig
