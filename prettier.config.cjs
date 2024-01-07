// @ts-check

/**
 * @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
*/
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss"), '@ianvs/prettier-plugin-sort-imports'],
};
