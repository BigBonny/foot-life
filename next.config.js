/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com',
      'supabase.co',
      'www.pngfind.com',
      'p7.hiclipart.com',
      'spng.pngfind.com',
      'img.freepik.com',
      'pngdownload.io',
      'e7.pngegg.com',
      
    ],
  },
}

module.exports = nextConfig
