---
title: "How I built a Next.js MDX table of contents"
date: "Nov 2025"
publishedAt: "2025-11-15"
readTime: "8 min read"
summary: "A breakdown of build-time table of contents generation using Turbopack, rehype plugins, and zero client-side JavaScript overhead."
tags: ["Next.js", "MDX", "Turbopack", "Design Systems"]
featured: true
---

I tested a number of different table of contents solutions before finding one that actually worked well with Turbopack. The winner was `@stefanprobst/rehype-extract-toc`, which generates TOCs at build time with zero client JavaScript.

The official documentation helped with the basics, but it didn't cover Next.js 16's app router or address the Turbopack serialization issues I ran into. This guide walks through my complete setup so you can skip the trial and error.

---

## Install the Tooling

Everything hinges on `@next/mdx` and the rehype plugins, so install them alongside your existing Next.js deps:

```bash
npm install @next/mdx rehype-slug @stefanprobst/rehype-extract-toc
```

If you rely on TypeScript, the default `@types/mdx` package you likely already have remains compatible—no extra typings needed beyond the custom declaration you'll add in Step 2.

---

## Context & Constraints

Working with Next.js 16 (app router) and Turbopack locally, I needed server-side TOC generation with no client bundles. Manual anchor lists broke every time I added headings. Remark plugins only output HTML, not structured data for React components.

My stack needed something that exported JSON during the MDX compile step—which led me to `@stefanprobst/rehype-extract-toc`.

---

## Step 1 — Wire the Rehype Plugins

The MDX pipeline lives inside `next.config.mjs`. I wrap the config with `@next/mdx`, feed in the remark/rehype plugins, and keep the rest of the Next config intact. Here's the full file with only the relevant bits expanded:

```javascript
// next.config.mjs
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      "rehype-slug",
      "@stefanprobst/rehype-extract-toc",
      "@stefanprobst/rehype-extract-toc/mdx",
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // ... leave the rest of your Next config untouched
};

export default nextConfig;
```

- `rehype-slug` adds predictable IDs on every heading.
- `@stefanprobst/rehype-extract-toc` walks the AST, builds a nested list, and stores it in `vfile.data.toc`.
- The `/mdx` companion injects an automatic `export const tableOfContents = [...]` into each MDX file.

Once the build finishes, every page file ships its own outline alongside the default React component.

### Avoiding the "non-serializable options" pitfall

When configuring Turbopack, keep plugin configurations purely declarative. Avoid passing inline arrow functions or complex closures to rehype options in `next.config.mjs`, as Turbopack serializes options across worker threads.

---

## Step 2 — Add Type Definitions

Because TypeScript doesn't know about exports injected by rehype plugins, create a custom declaration file `mdx.d.ts` in your root:

```typescript
declare module "*.mdx" {
  import type { Toc } from "@stefanprobst/rehype-extract-toc";
  export const tableOfContents: Toc;
  const component: (props: any) => JSX.Element;
  export default component;
}
```

### Understanding the tableOfContents export

The emitted data structure is clean, recursive, and directly maps to your UI components:

```json
[
  {
    "value": "The Attempts that Didn't Stick",
    "depth": 2,
    "id": "the-attempts-that-didnt-stick",
    "children": []
  },
  {
    "value": "Step 1 — Wire the Rehype Plugins",
    "depth": 2,
    "id": "step-1-wire-the-rehype-plugins",
    "children": [
      {
        "value": "Avoiding the \"non-serializable options\" pitfall",
        "depth": 3,
        "id": "avoiding-the-non-serializable-options-pitfall",
        "children": []
      }
    ]
  }
]
```

That structure maps directly onto the `Toc` TypeScript type in `@stefanprobst/rehype-extract-toc`. The React component simply iterates over the array, renders a link for each node, and recursively outputs children.

---

## Step 3 — Build the TOC Component

With data structures firmly established, building the floating dynamic island becomes remarkably straightforward. The component observes scroll intersections and animates smoothly between active headings.

```typescript
// TocFloatingIsland.tsx
import { useEffect, useState } from "react";

export function TocFloatingIsland({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Smooth observer setup for active viewport headings
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -60% 0%" }
    );

    document.querySelectorAll("h2, h3").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Floating pill navigation UI */}
    </div>
  );
}
```

---

## Step 4 — Surface the TOC in Layouts

Finally, place the component inside your blog post layout. Because the table of contents is statically computed during compilation, hydration is practically instantaneous and adds zero layout shift.

The reading experience feels tangible, intentional, and deeply refined.
