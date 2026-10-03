import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "navLabel"],
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "navLabel",
      type: "text",
      required: true,
    },
    {
      name: "eyebrow",
      type: "text",
    },
    {
      name: "highlight",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "features",
      type: "array",
      fields: [
        {
          name: "number",
          type: "text",
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "text",
          type: "textarea",
        },
      ],
    },
    {
      name: "process",
      type: "array",
      fields: [
        {
          name: "number",
          type: "text",
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "text",
          type: "textarea",
        },
      ],
    },
    {
      name: "audience",
      type: "array",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "ctaTitle",
      type: "text",
    },
    {
      name: "ctaText",
      type: "textarea",
    },
  ],
};