import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",

  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "LoxaMail",
    },
    {
      name: "companyName",
      type: "text",
      required: true,
      defaultValue: "ONLYZER",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "contactEmail",
      type: "email",
    },
  ],
};