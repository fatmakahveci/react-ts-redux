/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit the server bundle copied into the Docker runtime image.
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          // The demo never submits forms to a server, including before hydration.
          value: "form-action 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "no-referrer" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    }];
  },
};

export default nextConfig;
