import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The Ask AI page moved from /ask to /ask-ai — keep old shared links
      // (LinkedIn, resume, search results) working. The API route stays at
      // /api/ask and is unaffected.
      { source: "/ask", destination: "/ask-ai", permanent: true },
    ];
  },
};

export default nextConfig;
