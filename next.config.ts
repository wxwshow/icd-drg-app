import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 ships a native .node binary — keep it out of the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  // data.db is read at runtime via fs, so make sure the tracer ships it.
  outputFileTracingIncludes: {
    "/api/*": ["./data.db"],
  },
};

export default nextConfig;