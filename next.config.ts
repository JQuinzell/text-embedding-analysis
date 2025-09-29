import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ['@tensorflow/tfjs-node'],
  experimental: {
    serverComponentsExternalPackages: ['@tensorflow/tfjs-node'],
  },
}

export default nextConfig
