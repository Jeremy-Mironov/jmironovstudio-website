import { getCollection, type CollectionEntry } from "astro:content";
import { projects } from "@/data/projects";

// Every address of the site is a place on the desk. The page script keeps this table
// so the title and description follow the camera without a page load.
export interface DeskRoute {
  title: string;
  description: string;
  image?: string;
}

export async function blogPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog");
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function postDate(date: Date, month: "short" | "long" = "long"): string {
  return date.toLocaleDateString("en-US", {
    month,
    day: "numeric",
    year: month === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

// The light copy of a screenshot or cover the desk shows (npm run desk:images).
export function deskImage(src: string, folder: "blog" | "work"): string {
  const name = src
    .split("/")
    .pop()!
    .replace(/\.[a-z]+$/i, "");
  return `/desk/${folder}/${name}.jpg`;
}

export async function deskRoutes(): Promise<Record<string, DeskRoute>> {
  const routes: Record<string, DeskRoute> = {
    "/": {
      title: "JMironov Studio | Websites, SEO & Ads for Local Businesses",
      description:
        "JMironov Studio helps local businesses in Vancouver WA and Portland Metro with websites, SEO, Google Ads, tracking, and automation built to generate more leads.",
    },
    "/services": {
      title:
        "Digital Marketing Services for Local Businesses | JMironov Studio",
      description:
        "Website design, SEO, local SEO, Google Ads, Meta Ads, tracking, and automation services for local businesses in Vancouver WA and Portland Metro.",
    },
    "/pricing": {
      title: "Website, SEO & Marketing Pricing | JMironov Studio",
      description:
        "View starting prices for websites, SEO, Google Ads, tracking, and automation services for local businesses in Vancouver WA and Portland Metro.",
    },
    "/projects": {
      title: "Projects | JMironov Studio",
      description:
        "View selected website, SEO, advertising, and local business marketing projects by JMironov Studio in Vancouver WA.",
    },
    "/blog": {
      title: "Blog | JMironov Studio",
      description:
        "Practical articles about websites, SEO, Google Ads, and local business marketing from JMironov Studio in Vancouver WA.",
    },
    "/about": {
      title: "About JMironov Studio | Web Design, SEO & Digital Marketing",
      description:
        "Learn about Jeremy Mironov and JMironov Studio, a Vancouver WA web design, SEO, and digital marketing studio for local businesses.",
    },
    "/contact": {
      title: "Contact JMironov Studio | Book a Free Consultation",
      description:
        "Contact JMironov Studio to discuss your website, SEO, Google Ads, tracking, or automation project. Based in Vancouver, WA.",
    },
  };
  for (const project of projects) {
    routes[`/projects/${project.slug}`] = {
      title: `${project.name} | Projects | JMironov Studio`,
      description: project.summary,
      image: project.cardImage,
    };
  }
  for (const post of await blogPosts()) {
    routes[`/blog/${post.id}`] = {
      title: `${post.data.title} | JMironov Studio`,
      description: post.data.description,
      image: post.data.image,
    };
  }
  return routes;
}
