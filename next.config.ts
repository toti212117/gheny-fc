import type { NextConfig } from "next";

// Set on GitHub Actions so the site works at https://<user>.github.io/gheny-fc/
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/gheny-fc" : "",
};

export default nextConfig;
