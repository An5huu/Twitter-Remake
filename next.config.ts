import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'eu.ui-avatars.com',
                port: '',
                pathname: '/**'
            }
        ],
    },
    reactStrictMode: false
};

export default nextConfig;