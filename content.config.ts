import { defineContentConfig, defineCollection, z } from "@nuxt/content";

function createCollection(name: string, opts: any = {}) {
  return defineCollection({
    type: "page",
    schema: z.object({
      rawbody: z.string(),
    }),
    source: {
      prefix: "",
      cwd: "content/" + name,
      include: "**/*.md",
    },
    ...opts,
  });
}

export default defineContentConfig({
  collections: {
    general: createCollection("general"),
    pieces: createCollection("pieces"),
    writing: createCollection("writing"),
    media: defineCollection({
      type: "page",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string(),
        blurhash: z.string().optional(),
        metadata: z.object({
          width: z.number().optional(),
          height: z.number().optional(),
          size: z.number().optional(),
          format: z.string().optional(),
        }).optional(),
      }),
      source: {
        prefix: "",
        cwd: "content/media",
        include: "**/*.{yaml,yml}",
      },
    }),
  },
});
