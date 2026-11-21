import type { MetadataRoute } from "next";
import { clinic } from "@/config/clinic";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/__forms.html"] }], sitemap: `${clinic.siteUrl}/sitemap.xml`, host: clinic.siteUrl };
}
