"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "css" });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const entries = (cache as unknown as { inserted: Record<string, string | boolean> }).inserted;
    if (!entries || Object.keys(entries).length === 0) return null;

    const names: string[] = [];
    let styles = "";

    for (const [name, value] of Object.entries(entries)) {
      if (typeof value === "string") {
        names.push(name);
        styles += value;
      }
    }

    if (styles.length === 0) return null;

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
