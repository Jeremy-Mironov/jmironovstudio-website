import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import remarkReadingTime from "remark-reading-time";

export default defineConfig({
  site: "https://www.jmironovstudio.com/",
  // The whole site is the desk now; the old standalone pages point to their place on
  // it (vercel.json also sends these, and the wildcard ones, as real 308s).
  redirects: {
    "/work": "/projects",
    "/notebook": "/",
    "/widgets": "/",
    "/services/website-design-development": "/services",
    "/services/seo-local-seo": "/services",
    "/services/google-ads": "/services",
    "/services/meta-ads": "/services",
    "/services/tracking-analytics": "/services",
    "/services/crm-automation": "/services",
  },
  integrations: [
    sitemap({ filter: (page) => !page.includes("/widgets") }),
    icon(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkReadingTime,
      () => {
        return function (tree, file) {
          file.data.astro.frontmatter.minutesRead =
            file.data.readingTime.minutes;
        };
      },
    ],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // links on the desk never load another page, so there is nothing to prefetch
  prefetch: false,
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
