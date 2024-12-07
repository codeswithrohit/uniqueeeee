/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // Replaces exportTrailingSlash
  output: 'export',   // Tells Next.js to export the app as static files
};

export default nextConfig;
