/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    // lucide-react is already optimized by default.
    optimizePackageImports: ["@fortawesome/free-solid-svg-icons", "motion"],
  },
};

export default config;
