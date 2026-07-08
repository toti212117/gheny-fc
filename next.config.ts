import type { NextConfig } from "next";

// Set on GitHub Actions so the site works at https://<user>.github.io/gheny-fc/
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  // Emit folder/index.html so URLs work with and without a trailing slash on static hosts
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/gheny-fc" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/gheny-fc" : "",
  },
};

export default nextConfig;
