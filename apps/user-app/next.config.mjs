/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/webhook",
        destination: "https://bank_webhook.gtthreeone.workers.dev/webhook",
      },
    ];
  },
};

export default nextConfig;
