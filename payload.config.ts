import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Services } from "./collections/Services";
import { Homepage } from "./globals/Homepage";
import { SiteSettings } from "./globals/SiteSettings";

export default buildConfig({
  admin: {
    user: Users.slug,
  },

  collections: [Users, Services],

  globals: [SiteSettings, Homepage],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || "",

  db: sqliteAdapter({
    client: {
      url: process.env.PAYLOAD_DB_URL || "file:./payload.db",
    },
  }),

  sharp,

  routes: {
    admin: "/cms",
    api: "/api",
  },

  typescript: {
    outputFile: "./payload-types.ts",
  },
});
