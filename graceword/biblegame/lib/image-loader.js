/**
 * Custom next/image loader backed by Alibaba OSS image processing.
 * The CDN returns resized WebP variants on demand, so the app server
 * never has to run image optimization (works with `output: "export"`).
 */
export default function bibleArtImageLoader({ src, width, quality }) {
  if (!/^https?:\/\//.test(src)) return src;

  const separator = src.includes("?") ? "&" : "?";
  const w = Math.round(width);
  const q = quality ?? 75;

  return `${src}${separator}x-oss-process=image/resize,w_${w}/quality,q_${q}/format,webp`;
}
