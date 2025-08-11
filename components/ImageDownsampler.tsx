/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import {
  preparePalette,
  applyPaletteWithDithering,
} from "@/lib/image-processing";
import { converter, Color } from "culori";
import { cn } from "@/lib/util";
import { ToggleButton } from "./ToggleButton";
import ImagePreview from "./ImagePreview";

const starterPalette = [
  "#000000", // Row 1
  "#3C3C3C",
  "#787878",
  "#D2D2D2",
  "#FFFFFF",
  "#600018",
  "#ED1C24",
  "#FF7F27",
  "#F6AA09",
  "#F9DD3B",
  "#FFFABC",
  "#0EB968",
  "#13E67B",
  "#87FF5E",
  "#0C816E",
  "#10AEA6",
  "#13E1BE", // Row 2
  "#28509E",
  "#4093E4",
  "#60F7F2",
  "#6B50F6",
  "#99B1FB",
  "#780C99",
  "#AA38B9",
  "#E09FF9",
  "#CB007A",
  "#EC1F80",
  "#F38DA9",
  "#684634",
  "#95682A",
  "#F8B277",
];

const fullPalette = [
  /*"#000000", // Row 1
  "#3C3C3C",
  "#787878",
  "#D2D2D2",
  "#FFFFFF",
  "#600018",
  "#ED1C24",
  "#FF7F27",
  "#F6AA09",
  "#F9DD3B",
  "#FFFABC",
  "#0EB968",
  "#13E67B",
  "#87FF5E",
  "#0C816E",
  "#10AEA6",
  "#13E1BE", // Row 2
  "#28509E",
  "#4093E4",
  "#60F7F2",
  "#6B50F6",
  "#99B1FB",
  "#780C99",
  "#AA38B9",
  "#E09FF9",
  "#CB007A",
  "#EC1F80",
  "#F38DA9",
  "#684634",
  "#95682A",
  "#F8B277",*/
  "#000000",
  "#FFFFFF",
];

type SizeOption = "original" | "half" | "quarter" | "custom";
type PaletteOption = "starter" | "full";

export default function ImageDownsampler() {
  // TODO: select between default palette and full palette
  // TODO: maybe add a palette colour adder or remover
  // TODO: dither strength slider, with hover tip on what the setting means
  const [images, setImages] = useState({
    original: null as string | null,
    processed: null as string | null,
  });

  const [dimensions, setDimensions] = useState({
    original: null as { width: number; height: number } | null,
    processed: null as { width: number; height: number } | null,
  });

  const [palette, setPalette] = useState<string[]>(starterPalette);
  const [paletteOption, setPaletteOption] = useState<PaletteOption>("starter");
  const [sizeOption, setSizeOption] = useState<SizeOption>("original");
  const [customSize, setCustomSize] = useState({ width: 256, height: 256 });
  const [ditherFactor, setDitherFactor] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { diff, paletteLab } = preparePalette(palette);
  const toLab = (c: string) => converter("lab")(c)!;

  const updateCustomSize = (
    option: SizeOption,
    originalDims?: { width: number; height: number } | null
  ) => {
    if (!originalDims) return;
    switch (option) {
      case "original":
        setCustomSize(originalDims);
        break;
      case "half":
        setCustomSize({
          width: Math.round(originalDims.width / 2),
          height: Math.round(originalDims.height / 2),
        });
        break;
      case "quarter":
        setCustomSize({
          width: Math.round(originalDims.width / 4),
          height: Math.round(originalDims.height / 4),
        });
        break;
      case "custom":
        break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const src = target?.result as string;
      const img = new Image();
      img.onload = () => {
        const dims = { width: img.width, height: img.height };
        setDimensions((d) => ({ ...d, original: dims }));
        updateCustomSize(sizeOption, dims);
      };
      img.src = src;
      setImages((imgs) => ({ ...imgs, original: src }));
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!images.original || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = customSize.width;
      canvas.height = customSize.height;

      // high-quality downscale
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, customSize.width, customSize.height);

      // palette + dithering (ditherFactor 0..1)
      applyPaletteWithDithering(
        canvas,
        ctx,
        palette,
        paletteLab as Color[],
        toLab,
        diff,
        ditherFactor
      );

      setImages((imgs) => ({
        ...imgs,
        processed: canvas.toDataURL("image/png"),
      }));
    };
    img.src = images.original;
  };

  const downloadImage = () => {
    if (!images.processed) return;
    const link = document.createElement("a");
    link.href = images.processed;
    link.download = "processed-image.png";
    link.click();
  };

  return (
    <div className="container mx-auto">
      {/* Upload */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={cn(
            "block w-full text-sm file:mr-4 file:py-2 file:px-4",
            "file:rounded-md file:border-0 file:text-sm file:font-semibold",
            "file:bg-primary file:text-foreground hover:file:bg-primary/90",
            "transition-colors duration-300"
          )}
        />
      </div>

      {/* Previews row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original */}
        {images.original && (
          <div>
            <ImagePreview
              src={images.original}
              title="Original Image"
              onLoadSize={(w, h) =>
                setDimensions((d) => ({
                  ...d,
                  original: { width: w, height: h },
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-4 mt-6">
        <h3>Palette Options</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["starter", "full"] as PaletteOption[]).map((opt) => (
            <ToggleButton
              key={opt}
              label={`${opt.charAt(0).toUpperCase()}${opt.slice(1)} Palette`}
              isActive={paletteOption === opt}
              onClick={() => {
                setPaletteOption(opt);
                switch (opt) {
                  case "starter":
                    setPalette(starterPalette);
                    break;
                  case "full":
                    setPalette(fullPalette);
                    break;
                }
              }}
            />
          ))}
        </div>

        <h3>Size Options</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["original", "half", "quarter", "custom"] as SizeOption[]).map(
            (opt) => (
              <ToggleButton
                key={opt}
                label={`${opt.charAt(0).toUpperCase()}${opt.slice(1)} Size`}
                isActive={sizeOption === opt}
                onClick={() => {
                  setSizeOption(opt);
                  if (opt !== "custom")
                    updateCustomSize(opt, dimensions.original);
                }}
              />
            )
          )}
        </div>

        {sizeOption === "custom" && (
          <div className="mb-4 space-y-2 max-w-sm">
            <label className="block">
              Width:
              <input
                type="number"
                value={customSize.width}
                onChange={(e) =>
                  setCustomSize((s) => ({ ...s, width: +e.target.value }))
                }
                className="ml-2 p-1 border rounded-sm w-32"
              />
            </label>
            <label className="block">
              Height:
              <input
                type="number"
                value={customSize.height}
                onChange={(e) =>
                  setCustomSize((s) => ({ ...s, height: +e.target.value }))
                }
                className="ml-2 p-1 border rounded-sm w-32"
              />
            </label>
          </div>
        )}

        <h3>Dither Options</h3>
        <label className="block mb-4 max-w-md">
          Dither Strength: {ditherFactor.toFixed(2)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={ditherFactor}
            onChange={(e) => setDitherFactor(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>

        <div className="flex gap-3 items-center">
          <button
            onClick={processImage}
            disabled={!images.original}
            className="bg-primary px-4 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-60"
          >
            Process Image
          </button>
        </div>
      </div>

      {/* Processed (empty placeholder if not present) */}
      <div>
        {images.processed ? (
          <ImagePreview
            src={images.processed}
            title="Processed Image"
            onLoadSize={(w, h) =>
              setDimensions((d) => ({
                ...d,
                processed: { width: w, height: h },
              }))
            }
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            No processed image yet.
          </div>
        )}
      </div>

      <button
        onClick={downloadImage}
        disabled={!images.processed}
        className="mt-6 bg-primary text-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
      >
        Download Image
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
