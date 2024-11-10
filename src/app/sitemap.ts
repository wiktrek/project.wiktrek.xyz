import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://project.wiktrek.xyz/poll",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://project.wiktrek.xyz/url",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://project.wiktrek.xyz/term",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://project.wiktrek.xyz/teamgenerator",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: "https://project.wiktrek.xyz/other",
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
  ];
}
