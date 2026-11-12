"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { imageUrl, publicUrl } from "@/lib/image";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

/**
 * Loads images from the CDN, falling back to the local copy in public/images
 * if the CDN object is missing (for example right after adding a new artwork).
 */
export default function SafeImage({ src, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={failed ? publicUrl(src) : imageUrl(src)}
      onError={() => setFailed(true)}
    />
  );
}
