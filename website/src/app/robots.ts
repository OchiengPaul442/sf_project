import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/redux-store/",
        "/lib/",
        "/utils/",
        "/hooks/",
        "/app/server/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
