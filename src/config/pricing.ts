// ─── Pricing page ────────────────────────────────────────────────────────────

export const websitePackages = [
  {
    name: "Starter Website",
    price: "$900–$1,500",
    type: "One-time",
    description:
      "A simple, professional website for a small business that needs a clean online presence, clear service information, and basic contact options.",
    features: [
      "Up to 5 pages",
      "Mobile-friendly design",
      "Basic on-page SEO setup",
      "Contact form",
      "Fast load speed",
      "Google Analytics connection",
    ],
  },
  {
    name: "Local Business Website",
    price: "$1,500–$3,000",
    type: "One-time",
    description:
      "A stronger website for local service businesses that need multiple service pages, better structure, trust elements, and clear calls to action.",
    features: [
      "Up to 10 pages",
      "Service pages with local SEO structure",
      "Conversion-focused layout",
      "Lead capture forms",
      "Google Maps / location integration",
      "GA4 + basic conversion tracking",
      "Google Search Console setup",
    ],
    highlight: true,
  },
  {
    name: "Custom Growth Website",
    price: "$3,000+",
    type: "One-time",
    description:
      "A more custom website for businesses that need advanced sections, stronger conversion strategy, SEO-focused pages, tracking setup, or more detailed content.",
    features: [
      "Custom page count",
      "Landing pages for ads",
      "Advanced content structure",
      "Full tracking and conversion setup",
      "SEO content strategy",
      "CRM or form integration",
      "Ongoing support available",
    ],
  },
];

export const seoPackages = [
  {
    name: "SEO Starter",
    price: "$300–$600/month",
    features: [
      "Keyword research",
      "On-page SEO",
      "Google Business Profile basics",
      "Monthly reporting",
    ],
  },
  {
    name: "Local SEO Growth",
    price: "$600–$1,000/month",
    features: [
      "Everything in Starter",
      "Service area pages",
      "Local citation building",
      "Blog content",
      "Competitor gap analysis",
    ],
    highlight: true,
  },
  {
    name: "Custom SEO Campaign",
    price: "$1,000+/month",
    features: [
      "Custom keyword strategy",
      "Advanced technical SEO",
      "Content calendar",
      "Link building",
      "Priority support",
    ],
  },
];

export const otherServices = [
  {
    name: "Google Ads",
    items: [
      { label: "Campaign Setup", price: "$300–$700 one-time" },
      { label: "Monthly Management", price: "$300–$900/month" },
    ],
    note: "Ad spend budget is separate and paid directly to Google.",
  },
  {
    name: "Tracking & Analytics",
    items: [
      { label: "Basic Tracking Setup", price: "$200–$400 one-time" },
      { label: "Advanced Tracking Setup", price: "$500–$1,000+ one-time" },
    ],
    note: "Includes GA4, GTM, and conversion events setup.",
  },
  {
    name: "CRM & Automation",
    items: [
      { label: "Simple Lead Workflow", price: "$300–$700 one-time" },
      { label: "Custom Automation System", price: "$700–$1,500+ one-time" },
    ],
    note: "Includes lead capture, follow-up automation, and basic CRM setup.",
  },
  {
    name: "Meta Ads",
    items: [
      { label: "Campaign Setup", price: "$300–$600 one-time" },
      { label: "Monthly Management", price: "$300–$800/month" },
    ],
    note: "Ad spend budget is separate and paid directly to Meta.",
  },
];

// ─── Service landing pages ────────────────────────────────────────────────────

export const websiteServicePricing = [
  {
    name: "Starter Website",
    price: "$900–$1,500",
    period: "one-time",
    bestFor: "Simple professional websites with essential pages",
    items: [
      "Up to 5 pages",
      "Mobile-friendly design",
      "Basic on-page SEO",
      "Contact form",
      "GA4 setup",
    ],
  },
  {
    name: "Local Business Website",
    price: "$1,500–$3,000",
    period: "one-time",
    bestFor: "Service businesses that need a stronger lead-generating website",
    items: [
      "Up to 10 pages",
      "Service pages with local SEO structure",
      "Conversion-focused layout",
      "Click-to-call + quote forms",
      "GA4 + phone click tracking",
      "Google Search Console setup",
    ],
    highlighted: true,
  },
  {
    name: "Custom Growth Website",
    price: "$3,000+",
    period: "one-time",
    bestFor:
      "Businesses needing custom layouts, landing pages, and strong lead strategy",
    items: [
      "Custom page count",
      "Landing pages for ads",
      "Advanced content structure",
      "Full tracking setup",
      "CRM/form integration",
      "SEO content strategy",
    ],
  },
];

export const seoServicePricing = [
  {
    name: "SEO Starter",
    price: "$300–$600",
    period: "/month",
    bestFor: "Businesses just getting started with local SEO",
    items: [
      "Keyword research",
      "On-page SEO optimization",
      "Google Business Profile basics",
      "Search Console monitoring",
      "Monthly reporting",
    ],
  },
  {
    name: "Local SEO Growth",
    price: "$600–$1,000",
    period: "/month",
    bestFor: "Service businesses that need consistent local visibility",
    items: [
      "Everything in Starter",
      "Service area pages (up to 5)",
      "Local citation building",
      "Blog content (2/month)",
      "Competitor gap analysis",
      "GBP post management",
    ],
    highlighted: true,
  },
  {
    name: "Custom SEO Campaign",
    price: "$1,000+",
    period: "/month",
    bestFor: "Competitive markets or multi-location businesses",
    items: [
      "Custom keyword strategy",
      "Advanced technical SEO",
      "Content calendar (4+/month)",
      "Link building outreach",
      "Detailed monthly reporting",
      "Priority support",
    ],
  },
];

export const googleAdsServicePricing = [
  {
    name: "Campaign Setup",
    price: "$300–$700",
    period: "one-time",
    bestFor: "New campaigns needing a strong foundation before spending",
    items: [
      "Keyword research",
      "Campaign structure",
      "Negative keyword list",
      "Ad copy",
      "Conversion tracking",
      "Landing page review",
    ],
  },
  {
    name: "Monthly Management",
    price: "$300–$900",
    period: "/month",
    bestFor: "Ongoing optimization to improve cost-per-lead over time",
    items: [
      "Bid adjustments",
      "Search term report review",
      "Negative keyword updates",
      "Ad copy testing",
      "Monthly report with lead data",
      "Recommendations for next month",
    ],
    highlighted: true,
  },
];

export const metaAdsServicePricing = [
  {
    name: "Campaign Setup",
    price: "$300–$600",
    period: "one-time",
    bestFor: "New campaigns needing proper structure before spending",
    items: [
      "Audience research",
      "Campaign structure",
      "Creative direction",
      "Lead form setup",
      "Pixel verification",
      "Notification system",
    ],
  },
  {
    name: "Monthly Management",
    price: "$300–$800",
    period: "/month",
    bestFor: "Ongoing optimization to improve lead quality and cost",
    items: [
      "Budget optimization",
      "Audience refinement",
      "Creative testing",
      "Lead quality monitoring",
      "Monthly performance report",
      "Recommendations for next month",
    ],
    highlighted: true,
  },
];

export const trackingServicePricing = [
  {
    name: "Basic Tracking Setup",
    price: "$200–$400",
    period: "one-time",
    bestFor: "Businesses that need foundational analytics and call tracking",
    items: [
      "GA4 setup",
      "Google Search Console",
      "Phone click tracking",
      "Form submission tracking",
      "Basic GTM configuration",
    ],
  },
  {
    name: "Advanced Tracking Setup",
    price: "$500–$1,000+",
    period: "one-time",
    bestFor: "Businesses running ads that need full lead attribution",
    items: [
      "Everything in Basic",
      "Full GTM configuration",
      "Google Ads conversion import",
      "Microsoft Clarity",
      "Enhanced ecommerce or multi-step form tracking",
      "Detailed handoff documentation",
    ],
    highlighted: true,
  },
];

export const crmServicePricing = [
  {
    name: "Simple Lead Workflow",
    price: "$300–$700",
    period: "one-time",
    bestFor: "Small teams that need basic lead capture and notification",
    items: [
      "Lead notification setup",
      "Auto-acknowledgment email",
      "Follow-up reminder",
      "Google Sheets tracker",
      "Basic Zapier integration",
    ],
  },
  {
    name: "Custom Automation System",
    price: "$700–$1,500+",
    period: "one-time",
    bestFor:
      "Businesses that need a full CRM, multi-step automation, and lead tracking",
    items: [
      "CRM setup (Go High Level, HubSpot, or similar)",
      "Multi-step follow-up sequences",
      "Pipeline stage automation",
      "Custom Zapier integrations",
      "Lead source tracking",
      "Team training and documentation",
    ],
    highlighted: true,
  },
];

// ─── Home page summary ────────────────────────────────────────────────────────

export const pricingSummary = [
  { label: "Website Design", range: "From $900", note: "One-time project" },
  { label: "SEO & Local SEO", range: "From $300/mo", note: "Monthly ongoing" },
  {
    label: "Google Ads Mgmt.",
    range: "From $300/mo",
    note: "+ ad spend budget",
  },
];
