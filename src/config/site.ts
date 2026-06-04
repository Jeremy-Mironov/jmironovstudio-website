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
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/in/eremei-mironov-8253452b5",
    facebook:
      "https://www.facebook.com/people/Eremei-Mironov/pfbid0vkrTmin2Ua6FfLctAC9y5qucvjnn7LrK9b4DAELX7HbajZLXB4Hxd1PdMsZfwRtil/",
    github: "https://github.com/Jeremy-Mironov",
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
    email: "Jeremymironov@gmail.com",
    phone: "(971) 326-7264",
    location: "Vancouver, WA",
  },
};
