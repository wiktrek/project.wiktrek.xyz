import MillionLint from '@million/lint';
// @ts-ignore
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    esmExternals: false
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{
      protocol: "https",
      hostname: "raw.githubusercontent.com",
      port: "",
      pathname: "/PokeAPI/sprites/master/sprites/pokemon/**"
    }]
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  }
};
export default MillionLint.next()(config);