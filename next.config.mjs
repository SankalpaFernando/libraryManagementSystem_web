/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/login',
            permanent: true, // Use true for a 301 (permanent) redirect
          },
        ];
      },
};

export default nextConfig;
