import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["no", "en"],
  defaultLocale: "no",
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      en: "/en",
    },
  },
  pathnames: {
    "/": "/",
    "/tjenester": {
      no: "/tjenester",
      en: "/services",
    },
    "/om-oss": {
      no: "/om-oss",
      en: "/about",
    },
    "/kontakt": {
      no: "/kontakt",
      en: "/contact",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
