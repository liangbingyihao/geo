const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const cdnBase = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(/\/+$/, "");

/** Resolve a file from `public/` while respecting the deploy sub-path. */
export function publicUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  if (basePath && src.startsWith("/")) return `${basePath}${src}`;
  return src;
}

export function imageUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;

  if (cdnBase && src.startsWith("/images/")) {
    return `${cdnBase}/${src.slice("/images/".length)}`;
  }

  return publicUrl(src);
}
