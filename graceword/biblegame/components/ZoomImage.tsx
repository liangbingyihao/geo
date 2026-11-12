"use client";

import SafeImage from "./SafeImage";

interface ZoomImageProps {
  src: string;
  alt: string;
  scale: number;
  className?: string;
  priority?: boolean;
}

export default function ZoomImage({
  src,
  alt,
  scale,
  className = "aspect-[4/3]",
  priority = false,
}: ZoomImageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-ink/10 bg-ink/5 shadow-inner ${className}`}
    >
      <SafeImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-cover transition-transform duration-700 ease-out will-change-transform"
        style={{ transform: `scale(${scale})` }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
      {scale > 1 && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] tracking-wider text-white/90">
          放大 {scale.toFixed(1)}×
        </span>
      )}
    </div>
  );
}
