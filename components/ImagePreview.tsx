/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  title?: string;
  onLoadSize?: (w: number, h: number) => void;
  className?: string;
}

export default function ImagePreview({
  src,
  alt = "image",
  title,
  onLoadSize,
  className,
}: ImagePreviewProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  return (
    <div>
      {title && (
        <h2 className="not-prose text-3xl font-semibold mt-4 mb-2">{title}</h2>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className ?? "not-prose max-w-full h-auto border"}`}
        onLoad={(e) => {
          const img = e.currentTarget;
          const s = { width: img.naturalWidth, height: img.naturalHeight };
          setSize(s);
          if (onLoadSize) onLoadSize(s.width, s.height);
        }}
      />
      {size && (
        <div className="text-sm text-muted-foreground mt-1">
          {size.width} × {size.height}px
        </div>
      )}
    </div>
  );
}
