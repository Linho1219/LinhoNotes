import type { HeadConfig } from "vitepress";

export default [
  ...[16, 32, 64, 96, 128, 192].map((size) => [
    "link",
    {
      rel: "icon",
      type: "image/png",
      href: `/favicons/favicon_${size}.png`,
      sizes: `${size}x${size}`,
    },
  ]),
  [
    "link",
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/title_logo.svg",
    },
  ],
  [
    "link",
    {
      rel: "shortcut icon",
      href: "/favicon.ico",
    },
  ],
  [
    "link",
    {
      rel: "apple-touch-icon",
      href: "/favicons/apple-touch-icon.png",
      sizes: "180x180",
    },
  ],
  [
    "meta",
    {
      name: "apple-mobile-web-app-title",
      content: "LinhoNotes",
    },
  ],
  [
    "link",
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],
] as HeadConfig[];
