/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    return [
      {
        // Proxy all /api/* requests to the Spring Boot backend
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
      {
        // Proxy the initial OAuth2 redirect from Spring Security
        source: "/oauth2/authorization/google",
        destination: `${backendUrl}/oauth2/authorization/google`,
      },
      {
        // Special rewrite for the Google OAuth callback so Spring Boot receives it
        // properly and generates the correct redirect_uri
        source: "/login/oauth2/code/google",
        destination: `${backendUrl}/login/oauth2/code/google`,
      }
    ];
  },
};

export default nextConfig;
