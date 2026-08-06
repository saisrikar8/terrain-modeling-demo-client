import { useEffect, useRef } from "react";
import { divergingColor, maxAbsOf } from "../lib/colors";

function draw(canvas, grid) {
  const size = grid.length;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  const maxAbs = maxAbsOf(grid);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = divergingColor(grid[y][x], maxAbs);
      const i = (y * size + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function Heatmap2D({ grid, className, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (grid) draw(canvasRef.current, grid);
  }, [grid]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className || ""}`}
      style={{ imageRendering: "pixelated", ...style }}
    />
  );
}

export default Heatmap2D;
