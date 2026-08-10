export interface Project {
  slug: string;
  name: string;
  industry: string;
  url: string;
  tags: string[];
  technologies: string[];
  cardImage: string;
  cardImageAlt: string;
  images: { src: string; alt: string }[];
  summary: string;
  goal: string;
  whatIDid: string[];
  result: string;
}

export const projects: Project[] = [
  {
    slug: "freshfit-bath",
    name: "FreshFit Bath",
    industry: "Bath & Shower Remodeling",
    url: "https://freshfitbath.com/",
    tags: ["Website", "SEO", "Tracking"],
    technologies: [
      "Website Design & Development",
      "On-Page SEO",
      "Google Search Console",
      "Google Analytics 4",
      "Google Tag Manager",
      "Google Ads",
    ],
    cardImage: "/work/freshfit-bath.png",
    cardImageAlt:
      "FreshFit Bath & Shower homepage — bathroom remodeling in Vancouver WA and Portland OR area",
    images: [
      {
        src: "/work/freshfit-bath.png",
        alt: "FreshFit Bath homepage hero — Bathroom Remodels Made Simple, Clean, and Built to Last",
      },
      {
        src: "/work/freshfit-bath-2.png",
        alt: "FreshFit Bath services page — Tub-to-Shower Conversion, Shower Renovation, Tub Replacement, and more",
      },
      {
        src: "/work/freshfit-bath-3.png",
        alt: "FreshFit Bath About Us page — mission, vision, and company stats",
      },
      {
        src: "/work/freshfit-bath-4.png",
        alt: "FreshFit Bath Projects page — work gallery of completed bathroom remodels",
      },
      {
        src: "/work/freshfit-bath-5.png",
        alt: "FreshFit Bath Contact page — quote request form and service area list",
      },
    ],
    summary:
      "A local remodeling brand focused on wet-area bathroom services including walk-in showers, tub replacements, and bathroom updates.",
    goal: "FreshFit Bath needed a website that could clearly present its remodeling services, build trust with homeowners, and turn visitors into booked estimates — without relying on a generic template that looked like every other contractor site.",
    whatIDid: [
      "Designed and built the website from scratch around core service types (walk-in showers, tub replacements, bathroom updates)",
      "Structured service pages for local search visibility, targeting bathroom remodeling searches in the Portland OR area",
      "Placed contact forms and calls-to-action throughout the site to focus on lead capture",
      "Configured Google Analytics 4 and Google Tag Manager for conversion tracking ahead of running paid ads",
      "Set up the technical SEO foundation (page structure, metadata, Search Console) before launch",
    ],
    result:
      "The result is a clean, service-focused website that gives FreshFit Bath a professional online presence and a clear path from visitor to booked estimate. Design and structure decisions were made to support future SEO and advertising work, not just to look good.",
  },
  {
    slug: "dwell-installations",
    name: "Dwell Installations",
    industry: "Flooring Installation",
    url: "https://dwellinc.net/",
    tags: ["Website", "SEO", "Google Ads"],
    technologies: [
      "Website Direction & Design",
      "Local SEO",
      "Service Page Strategy",
      "Google Ads Planning",
      "Google Analytics 4",
    ],
    cardImage: "/work/dwell-installations.png",
    cardImageAlt:
      "Dwell Installations homepage — flooring installation in Vancouver WA and Portland area",
    images: [
      {
        src: "/work/dwell-installations.png",
        alt: "Dwell Installations homepage hero — Providing quality flooring service",
      },
      {
        src: "/work/dwell-installations-2.png",
        alt: "Dwell Installations homepage — flooring type breakdown (hardwood, laminate, vinyl, tile)",
      },
      {
        src: "/work/dwell-installations-3.png",
        alt: "Dwell Installations About Us page — mission and company values",
      },
      {
        src: "/work/dwell-installations-4.png",
        alt: "Dwell Installations footer — quick links, service areas, and contact info",
      },
      {
        src: "/work/dwell-installations-5.png",
        alt: "Dwell Installations Contact page — quote request form and service areas",
      },
    ],
    summary:
      "A flooring installation business offering laminate, vinyl plank, hardwood, and baseboard installation services.",
    goal: "Dwell Installations needed a website design direction and service page structure that could support local search visibility and give a future Google Ads campaign a strong landing experience for each flooring type.",
    whatIDid: [
      "Directed the website design around clear presentation of each flooring type — laminate, vinyl plank, hardwood, and baseboard installation",
      "Built a service page strategy organized by installation type rather than one generic services page",
      "Researched local keywords around installation searches to inform page content and structure",
      "Planned a Google Ads campaign structure around high-intent keywords, with service area targeting for local neighborhoods and cities",
    ],
    result:
      "The site gives Dwell Installations a design that separates each service clearly for visitors and search engines alike, laying the groundwork for local SEO and paid search to perform once campaigns go live.",
  },
  {
    slug: "acremaker-nw",
    name: "AcreMaker NW",
    industry: "Land Clearing & Outdoor Property Services",
    url: "https://acremakernw.com/",
    tags: ["Website", "Local SEO"],
    technologies: [
      "Website Structure & Design",
      "Local SEO Planning",
      "Content Strategy",
    ],
    cardImage: "/work/acremakernw-alt.png",
    cardImageAlt:
      "AcreMaker NW homepage — land clearing and site prep in Vancouver WA",
    images: [
      {
        src: "/work/acremakernw-alt.png",
        alt: "AcreMaker NW homepage hero — From Land Clearing To Site Prep, We Build The Groundwork Right",
      },
      {
        src: "/work/acremaker-nw-2.png",
        alt: "AcreMaker NW homepage — Local Service, Honest Work, Reliable Results section",
      },
      {
        src: "/work/acremaker-nw-3.png",
        alt: "AcreMaker NW About Us page — Meet Our Team Members",
      },
      {
        src: "/work/acremaker-nw-4.png",
        alt: "AcreMaker NW footer — quick links, services, and office hours",
      },
    ],
    summary:
      "A local service business website focused on land clearing and outdoor property services.",
    goal: "AcreMaker NW needed a website that made land clearing and outdoor property services easy to understand for homeowners, with a clear next step toward getting in touch.",
    whatIDid: [
      "Designed the website structure around service clarity and easy navigation between offerings",
      "Organized content to answer the questions potential customers ask most before contacting a land clearing company",
      "Planned local SEO around service-area terms for visibility in nearby cities and neighborhoods",
      "Made the contact path and calls-to-action prominent throughout the site",
    ],
    result:
      "The finished design gives AcreMaker NW a straightforward, easy-to-navigate site where services are easy to understand and the path to contact is never more than a click away.",
  },
  {
    slug: "power-professor",
    name: "Power Professor",
    industry: "Electrical Contracting",
    url: "https://powerprofessor.vercel.app/",
    tags: ["Website", "SEO", "Tracking"],
    technologies: [
      "Website Design & Development",
      "Service Page Strategy",
      "Local SEO",
      "Google Analytics 4",
      "Google Tag Manager",
    ],
    cardImage: "/work/power-professor.png",
    cardImageAlt:
      "Power Professor homepage — licensed residential and commercial electrical contractors based in Portland, OR",
    images: [
      {
        src: "/work/power-professor.png",
        alt: "Power Professor homepage hero — Expertise section with licensing, guarantees, and company stats",
      },
      {
        src: "/work/power-professor-2.png",
        alt: "Power Professor services grid — commercial electrical, emergency service, wiring, panel upgrades, EV chargers, and solar",
      },
      {
        src: "/work/power-professor-3.png",
        alt: "Power Professor Projects page — recent electrical work across residential and commercial jobs",
      },
    ],
    summary:
      "A licensed electrical contracting company offering residential and commercial services, including 24/7 emergency response, across the Pacific Northwest and beyond.",
    goal: "Power Professor needed a website that could establish trust for high-stakes electrical work, clearly separate its many service lines (from panel upgrades to solar and EV charger installs), and make it easy for a homeowner or property manager to reach someone fast — especially during an emergency.",
    whatIDid: [
      "Designed and built the website around Power Professor's full service lineup, from residential wiring to commercial and emergency electrical work",
      "Structured a dedicated services grid so each offering (panel upgrades, tenant improvement work, EV chargers, solar, emergency service) has its own clear entry point",
      "Built out a service area section covering the multiple states and cities the company serves",
      "Added a projects gallery to showcase completed residential and commercial jobs and build trust with prospective clients",
      "Set up the technical foundation for local SEO and conversion tracking ahead of future marketing campaigns",
    ],
    result:
      "The result is a professional, trust-building site that makes Power Professor's licensing, guarantees, and emergency availability immediately clear, with a service structure built to support future SEO and lead generation work. The site is live on a temporary domain and will move to powerprofessor.co.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
