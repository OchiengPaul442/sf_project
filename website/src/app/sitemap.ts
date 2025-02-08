import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const currentDate = new Date().toISOString();

  // Define the sections of your site
  const sections = ["home", "how", "work"];

  // Create the home page entry
  const homePage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 1,
  };

  // Create entries for each section
  const sectionPages = sections.map((section) => ({
    url: `${baseUrl}/#${section}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Combine home page and section pages
  return [homePage, ...sectionPages];
}
