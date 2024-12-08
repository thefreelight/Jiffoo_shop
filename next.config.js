const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
  // 添加图片域名配置
  images: {
    domains: [
      'cdn.simpleicons.org',
      'images.unsplash.com',
      'i.pravatar.cc'
    ],
  },
  // 添加 Cloudflare 相关配置
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Forwarded-Proto',
            value: 'https'
          }
        ],
      },
    ]
  },
  // 确保正确处理代理请求
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'https'
            }
          ],
          destination: '/:path*'
        }
      ]
    }
  }
}

module.exports = withMDX(nextConfig)