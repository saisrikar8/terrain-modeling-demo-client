import { useEffect, useRef } from "react";
import { divergingColor, colorScaleOf } from "../lib/colors";

const UPSCALE = 4;

function sampleBilinear(grid, gx, gy) {
  const size = grid.length;
  const x0 = Math.max(0, Math.min(size - 1, Math.floor(gx)));
  const y0 = Math.max(0, Math.min(size - 1, Math.floor(gy)));
  const x1 = Math.min(size - 1, x0 + 1);
  const y1 = Math.min(size - 1, y0 + 1);
  const tx = Math.max(0, Math.min(1, gx - x0));
  const ty = Math.max(0, Math.min(1, gy - y0));
  const top = grid[y0][x0] + (grid[y0][x1] - grid[y0][x0]) * tx;
  const bottom = grid[y1][x0] + (grid[y1][x1] - grid[y1][x0]) * tx;
  return top + (bottom - top) * ty;
}

function draw(canvas, grid, scale) {
  const size = grid.length;
  const out = size * UPSCALE;
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(out, out);
  const maxAbs = scale || colorScaleOf(grid);
  for (let y = 0; y < out; y++) {
    const gy = (y + 0.5) / UPSCALE - 0.5;
    for (let x = 0; x < out; x++) {
      const gx = (x + 0.5) / UPSCALE - 0.5;
      const [r, g, b] = divergingColor(sampleBilinear(grid, gx, gy), maxAbs);
      const i = (y * out + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function Heatmap2D({ grid, scale, className, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (grid) draw(canvasRef.current, grid, scale);
  }, [grid, scale]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className || ""}`}
      style={{ imageRendering: "auto", ...style }}
    />
  );
}

export default Heatmap2D;
