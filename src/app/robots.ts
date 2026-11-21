import type { MetadataRoute } from "next";
import { clinic } from "@/config/clinic";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!clinic.allowSearchEngines) {
    // Pre-launch: keep the site out of search results (see clinic.allowSearchEngines)
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/__forms.html"] }], sitemap: `${clinic.siteUrl}/sitemap.xml`, host: clinic.siteUrl };
}
