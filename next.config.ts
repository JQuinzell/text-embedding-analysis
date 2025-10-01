import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@tensorflow/tfjs-node'],
}

export default nextConfig
