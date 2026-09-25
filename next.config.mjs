/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit the server bundle copied into the Docker runtime image.
  output: "standalone",
};

export default nextConfig;
