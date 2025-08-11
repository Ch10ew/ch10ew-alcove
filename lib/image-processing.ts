import { Color, converter, differenceEuclidean } from "culori";

export function preparePalette(palette: string[]) {
  const toLab = converter("lab");
  const diff = differenceEuclidean("lab");
  const paletteLab = palette.map((color) => toLab(color));

  return { toLab, diff, paletteLab };
}

export function findClosestColor(
  r: number,
  g: number,
  b: number,
  palette: string[],
  paletteLab: Color[],
  toLab: (color: string) => Color,
  diff: (a: Color, b: Color) => number
) {
  const targetLab = toLab(`rgb(${r}, ${g}, ${b})`);
  let minDistance = Infinity;
  let closestHex = palette[0];

  paletteLab.forEach((pColor, i) => {
    const distance = diff(targetLab as Color, pColor as Color);
    if (distance < minDistance) {
      minDistance = distance;
      closestHex = palette[i];
    }
  });

  const hex = closestHex.replace("#", "");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function applyPaletteWithDithering(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  palette: string[],
  paletteLab: Color[],
  toLab: (color: string) => Color,
  diff: (a: Color, b: Color) => number,
  ditherFactor: number = 0
) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const w = canvas.width;
  const h = canvas.height;

  const distributeError = (
    x: number,
    y: number,
    errR: number,
    errG: number,
    errB: number,
    factor: number
  ) => {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const idx = (y * w + x) * 4;
    data[idx] = Math.min(
      255,
      Math.max(0, data[idx] + errR * factor * ditherFactor)
    );
    data[idx + 1] = Math.min(
      255,
      Math.max(0, data[idx + 1] + errG * factor * ditherFactor)
    );
    data[idx + 2] = Math.min(
      255,
      Math.max(0, data[idx + 2] + errB * factor * ditherFactor)
    );
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const oldR = data[idx];
      const oldG = data[idx + 1];
      const oldB = data[idx + 2];

      const newColor = findClosestColor(
        oldR,
        oldG,
        oldB,
        palette,
        paletteLab,
        toLab,
        diff
      );
      data[idx] = newColor.r;
      data[idx + 1] = newColor.g;
      data[idx + 2] = newColor.b;

      const errR = oldR - newColor.r;
      const errG = oldG - newColor.g;
      const errB = oldB - newColor.b;

      // Floyd–Steinberg error diffusion
      distributeError(x + 1, y, errR, errG, errB, 7 / 16);
      distributeError(x - 1, y + 1, errR, errG, errB, 3 / 16);
      distributeError(x, y + 1, errR, errG, errB, 5 / 16);
      distributeError(x + 1, y + 1, errR, errG, errB, 1 / 16);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
