import { useState, Suspense, lazy } from "react";
import Heatmap2D from "./Heatmap2D";
import { SpinnerIcon } from "../lib/icons";

const Terrain3D = lazy(() => import("./Terrain3D"));

function FocusPanel({
  hero,
  state,
  grid,
  error,
  progress,
  horizonYears,
  elapsedYears,
  stageLabel,
  scale,
  regionImage,
}) {
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState("2d");
  const hasGrid = Boolean(grid?.length);

  const percent =
    progress != null
      ? Math.round(progress * 100)
      : state === "done"
        ? 100
        : 0;

  return (
    <div className="rounded-lg glass-panel relative overflow-hidden flex flex-col w-full h-full">
      <div className="absolute top-2.5 right-2.5 z-20 flex space-x-1.5">
        {hasGrid && (
          <button
            type="button"
            onClick={() => setMode((m) => (m === "2d" ? "3d" : "2d"))}
            className="h-6 px-2 rounded bg-black/50 border border-white/20 flex items-center justify-center gap-1 text-white/70 hover:text-white hover:bg-black/70 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">
              {mode === "2d" ? "view_in_ar" : "grid_view"}
            </span>
            <span className="text-[10px] uppercase tracking-wider">
              {mode === "2d" ? "3D" : "2D"}
            </span>
          </button>
        )}
        {mode === "2d" && (
          <>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
              className="w-6 h-6 rounded bg-black/50 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              className="w-6 h-6 rounded bg-black/50 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_out</span>
            </button>
          </>
        )}
      </div>

      <div className="flex-1 relative w-full min-h-0 bg-black overflow-hidden">
        {!hasGrid && (
          <div className="absolute inset-0">
            <img
              src={regionImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {hasGrid && mode === "2d" && (
          <div className="absolute inset-0 overflow-auto">
            <Heatmap2D
              grid={grid}
              scale={scale}
              className="w-full h-full transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        )}

        {hasGrid && mode === "3d" && (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <SpinnerIcon className="w-5 h-5 text-white/40 animate-spin" />
              </div>
            }
          >
            <Terrain3D grid={grid} scale={scale} className="absolute inset-0" />
          </Suspense>
        )}

        {!hasGrid && (state === "loading" || state === "queued") && (
          <div className="absolute inset-0 shimmer" />
        )}

        {!hasGrid && (state === "loading" || state === "queued") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <SpinnerIcon className="w-5 h-5 text-white/40 animate-spin" />
            <span className="text-label-mono uppercase tracking-widest text-white/40">
              {state === "queued" ? "Queued" : stageLabel || "Simulating"}
            </span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-error">
            {error}
          </div>
        )}
      </div>

      {hero && (
        <div className="h-9 border-t border-white/10 bg-black/40 backdrop-blur-md flex items-center px-4 shrink-0">
          <div className="flex-1 flex items-center space-x-3">
            <span className="text-white/70 w-8 text-xs tnum">
              {state === "idle" ? "—" : `${percent}%`}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white relative"
                style={{ width: `${percent}%` }}
              >
                {state !== "idle" && state !== "done" && (
                  <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-white/50 animate-pulse" />
                )}
              </div>
            </div>
            <span className="text-white/50 text-xs tnum">
              {state === "loading" && elapsedYears != null
                ? `${elapsedYears} / ${horizonYears} YEARS`
                : `T + ${horizonYears} YEARS`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusPanel;
