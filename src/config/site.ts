import ogImage from "@/assets/og-image.png";

export const siteConfig = {
  name: "JMironov Studio",
  description:
    "Web design, SEO, Google Ads, and digital marketing for local businesses in Vancouver WA and Portland Metro.",
  url: "https://www.jmironovstudio.com",
  lang: "en",
  locale: "en_US",
  author: "Jeremy Mironov",
  twitter: "@JMironovStudio",
  ogImage: ogImage,
  socialLinks: {
    twitter: "https://twitter.com/JMironovStudio",
    linkedin: "https://linkedin.com/in/jeremymironov",
    facebook: "https://facebook.com",
  },
  navLinks: [
    { text: "Home", href: "/" },
    { text: "Services", href: "/services" },
    { text: "Pricing", href: "/pricing" },
    { text: "Work", href: "/work" },
    { text: "About", href: "/about" },
    { text: "Blog", href: "/blog" },
    { text: "Contact", href: "/contact" },
  ],
  contact: {
    email: "[ADD EMAIL HERE]",
    phone: "[ADD PHONE HERE]",
    location: "Vancouver, WA",
  },
};
