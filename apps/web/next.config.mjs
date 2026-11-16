/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — no server runtime, so it serves on Firebase Hosting free tier.
  output: "export",
  // The UI library ships TypeScript source; let Next compile it.
  transpilePackages: ["@chat-evolve/ui"],
  // Static export can't use the Next image optimizer.
  images: { unoptimized: true },
  // Trailing slash makes Firebase Hosting's clean-URL routing match index.html.
  trailingSlash: true,
  reactStrictMode: true,
  // Lint is run as its own pipeline step; don't couple it to the deploy build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
