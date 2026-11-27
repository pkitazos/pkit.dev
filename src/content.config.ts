import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "**/*.mdx"],
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean(),
    // tags: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    name: z.string(),
    href: z.string().url(),
    status: z.enum(["active", "wip", "archived"]),
    order: z.number(),
    stack: z.array(z.string()),
  }),
});

export const collections = { blog, projects };
