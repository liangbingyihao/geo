/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  experimental: {
    globalNotFound: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.js",
  },
};

export default nextConfig;
