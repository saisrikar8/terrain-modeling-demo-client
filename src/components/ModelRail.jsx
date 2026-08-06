import Heatmap2D from "./Heatmap2D";
import { computeMSE, computeErrorPercent } from "../lib/stats";

function RailCard({ active, label, dotClass, state, grid, error, groundTruthGrid, onClick }) {
  const mse = grid && groundTruthGrid ? computeMSE(grid, groundTruthGrid) : null;
  const errPct = grid && groundTruthGrid ? computeErrorPercent(grid, groundTruthGrid) : null;

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-4 cursor-pointer hover:border-white/30 transition-all relative group ${
        active ? "border border-white/20" : "opacity-70 hover:opacity-100"
      }`}
    >
      {active && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />}
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-headline-lg-mobile text-on-surface flex items-center gap-2">
          {!active && <span className={`w-2 h-2 rounded shrink-0 ${dotClass || "bg-surface-variant"}`} />}
          {label}
        </h4>
        {active && <span className="bg-white text-black px-2 py-0.5 rounded-sm text-[11px] font-bold shrink-0">ACTIVE</span>}
      </div>

      <div className="h-24 w-full rounded border border-white/10 mb-3 overflow-hidden relative bg-black">
        {grid && <Heatmap2D grid={grid} className="opacity-90" />}
        {!grid && (state === "loading" || state === "queued") && (
          <div className="w-full h-full bg-surface-container-highest/50 shimmer" />
        )}
        {!grid && (state === "idle" || !state) && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-label-mono text-on-surface-variant/40 text-[11px]">AWAITING RUN</span>
          </div>
        )}
        {!grid && error && (
          <div className="w-full h-full flex items-center justify-center px-2">
            <span className="text-error text-[11px] text-center">Error</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="bg-black/30 p-2 rounded border border-white/5">
          <span className="block text-on-surface-variant/50 mb-1 text-[11px] text-label-mono">MSE</span>
          <span className="text-body-sm text-on-surface">{mse != null ? mse.toFixed(3) : "--"}</span>
        </div>
        <div className="bg-black/30 p-2 rounded border border-white/5">
          <span className="block text-on-surface-variant/50 mb-1 text-[11px] text-label-mono">ERR %</span>
          <span className="text-body-sm text-on-surface">{errPct != null ? `${errPct.toFixed(1)}%` : "--"}</span>
        </div>
      </div>
    </div>
  );
}

export default RailCard;
