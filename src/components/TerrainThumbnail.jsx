import { useEffect, useRef, useState } from "react";
import { fetchPatchElevation } from "../lib/api";
import { rangeOf } from "../lib/colors";

function drawElevation(canvas, grid) {
  const size = grid.length;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  const [min, max] = rangeOf(grid);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = grid[y][x];
      const t = max > min ? (v - min) / (max - min) : 0.5;
      const shade = Math.round(28 + t * 150);
      const i = (y * size + x) * 4;
      img.data[i] = shade * 0.75;
      img.data[i + 1] = shade * 0.86;
      img.data[i + 2] = shade * 0.72;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function TerrainThumbnail({ patchId, className }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchPatchElevation(patchId)
      .then((data) => {
        if (cancelled) return;
        drawElevation(canvasRef.current, data.elevation_map);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [patchId]);

  return (
    <div className={`relative overflow-hidden bg-surface ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        style={{ imageRendering: "pixelated" }}
      />
      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-full h-full ${status === "loading" ? "shimmer" : "bg-gradient-to-br from-surface-raised to-surface"}`} />
        </div>
      )}
    </div>
  );
}

export default TerrainThumbnail;
