/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
    return {
      beforeFiles: [
        { source: "/oauth2/:path*", destination: `${backend}/oauth2/:path*` },
        { source: "/login/oauth2/code/:path*", destination: `${backend}/login/oauth2/code/:path*` },
      ],
      afterFiles: [{ source: "/api/backend/:path*", destination: `${backend}/:path*` }],
      fallback: [],
    };
  },
};

export default nextConfig;
