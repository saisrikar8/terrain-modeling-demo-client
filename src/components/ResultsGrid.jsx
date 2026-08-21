import { useState } from "react";
import { motion } from "framer-motion";
import Heatmap2D from "./Heatmap2D";
import FocusPanel from "./FocusPanel";
import Legend from "./Legend";
import { computeMaeCm, computeRmseCm } from "../lib/stats";
import { sharedScaleOf } from "../lib/colors";

const STAGE_LABEL = {
  loading: "Loading weights",
  running: "Running inference",
};

const MODEL_META = {
  unet: { label: "U-Net Baseline" },
  cnn: { label: "CNN Dense" },
  vit: { label: "ViT Large" },
  convlstm: { label: "ConvLSTM" },
};

function ModelCard({ label, isTruth, state, grid, error, regionImage, groundTruthGrid, progress, stage, scale, onClick, active }) {
  const maeCm = grid && groundTruthGrid ? computeMaeCm(grid, groundTruthGrid) : null;

  const percent =
    progress != null
      ? Math.round(progress * 100)
      : state === "done"
        ? 100
        : 0;

  return (
    <div onClick={onClick} className="glass-panel card-hover rounded-xl flex flex-col w-full h-full min-h-0 cursor-pointer overflow-hidden group border border-white/5 active:scale-[0.98]">
      <div className="relative w-full h-36 overflow-hidden bg-black shrink-0">
        {grid ? (
          <Heatmap2D grid={grid} scale={scale} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : state === "loading" || state === "queued" ? (
          <div className="w-full h-full bg-surface-container-highest/50 shimmer flex items-center justify-center">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-white/50 text-[10px]">
              {state === "queued" ? "Queued" : STAGE_LABEL[stage] || "Working"}
            </span>
          </div>
        ) : state === "error" ? (
          <div className="w-full h-full flex items-center justify-center px-2">
            <span className="text-error text-[10px] text-center">{error || "Error"}</span>
          </div>
        ) : regionImage ? (
          <img
            src={regionImage}
            alt=""
            className="w-full h-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-label-mono text-label-mono text-white/40 text-[10px]">AWAITING RUN</span>
          </div>
        )}
        {!grid && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-surface-dim/40 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="shrink-0 z-10 p-2">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-white text-[15px] leading-5 truncate">{label}</h4>
          {active ? (
            <span className="px-2 py-0.5 rounded bg-white text-black text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2">
              Active
            </span>
          ) : isTruth ? (
            <span className="data-tag font-label-mono text-label-mono text-on-surface px-2 py-0.5 rounded shrink-0 ml-2">
              {state === "idle" ? "—" : `${percent}%`}
            </span>
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[16px]">open_in_new</span>
          )}
        </div>

        {!isTruth && (
          <p className="text-[12px] font-mono-nums text-white/70 group-hover:text-white transition-colors leading-4">
            {maeCm != null ? `MAE ${maeCm.toFixed(3)} cm` : "MAE —"}
          </p>
        )}
      </div>
    </div>
  );
}

function PredictionBox({
  label,
  isTruth,
  state,
  grid,
  error,
  regionImage,
  groundTruthGrid,
  horizonYears,
  progress,
  stage,
  elapsedYears,
  scale,
  onClick,
}) {
  const maeCm = grid && groundTruthGrid ? computeMaeCm(grid, groundTruthGrid) : null;
  const rmseCm = grid && groundTruthGrid ? computeRmseCm(grid, groundTruthGrid) : null;

  const percent =
    progress != null
      ? Math.round(progress * 100)
      : state === "done"
        ? 100
        : 0;

  return (
    <div onClick={onClick} className="glass-panel card-hover rounded-xl flex flex-col w-full h-full min-h-0 cursor-pointer overflow-hidden group border border-white/5 active:scale-[0.98]">
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-black">
        {grid ? (
          <Heatmap2D grid={grid} scale={scale} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : state === "loading" || state === "queued" ? (
          <div className="w-full h-full bg-surface-container-highest/50 shimmer flex items-center justify-center">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-white/50 text-[10px]">
              {state === "queued" ? "Queued" : STAGE_LABEL[stage] || "Working"}
            </span>
          </div>
        ) : state === "error" ? (
          <div className="w-full h-full flex items-center justify-center px-2">
            <span className="text-error text-[10px] text-center">{error || "Error"}</span>
          </div>
        ) : regionImage ? (
          <img
            src={regionImage}
            alt=""
            className="w-full h-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-label-mono text-label-mono text-white/40 text-[10px]">AWAITING RUN</span>
          </div>
        )}
        {!grid && (
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-surface-dim/40 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="shrink-0 z-10 p-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-white text-[17px] leading-6 truncate">{label}</h4>
          {isTruth ? (
            <span className="data-tag font-label-mono text-label-mono text-on-surface px-2 py-0.5 rounded shrink-0 ml-2">
              {state === "idle" ? "—" : `${percent}%`}
            </span>
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[16px]">open_in_new</span>
          )}
        </div>

        {isTruth ? (
          <p className="text-[13px] font-mono-nums text-white/70 group-hover:text-white transition-colors">
            {state === "loading" && elapsedYears != null
              ? `Simulating • ${elapsedYears} / ${horizonYears} years`
              : `Landlab physics simulation • T + ${horizonYears} years`}
          </p>
        ) : (
          <p className="text-[13px] font-mono-nums text-white/70 group-hover:text-white transition-colors">
            {maeCm != null ? `MAE ${maeCm.toFixed(3)} cm` : "MAE —"}
            {rmseCm != null ? ` • RMSE ${rmseCm.toFixed(3)} cm` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

function ResultsGrid({ regionName, coords, models, landlab, horizonYears, regionImage }) {
  const [focused, setFocused] = useState(null);

  const formatCoord = (v) => Math.abs(v).toFixed(3);

  const allItems = [
    {
      key: "landlab",
      label: "Ground Truth",
      isTruth: true,
      state: landlab.state,
      grid: landlab.grid,
      error: landlab.error,
      progress: landlab.progress,
      elapsedYears: landlab.elapsedYears,
    },
    ...Object.entries(MODEL_META).map(([key, meta]) => ({
      key,
      label: meta.label,
      isTruth: false,
      state: models[key]?.state,
      grid: models[key]?.grid,
      error: models[key]?.error,
      stage: models[key]?.stage,
    })),
  ];

  const focusedItem = focused
    ? allItems.find((item) => item.key === focused)
    : null;

  const scale = sharedScaleOf(allItems.map((item) => item.grid));
  const anyGrid = allItems.some((item) => item.grid?.length);

  function handleFocus(key) {
    if (key === focused) return;
    setFocused(key);
  }

  function handleBack() {
    setFocused(null);
  }

  const subtitle = focusedItem ? focusedItem.label : "ELEVATION TOPOGRAPHY";

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full">
      <header className="mt-6 mb-3 z-10 shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[28px] leading-9 font-semibold text-white tracking-tight">{regionName}</h2>
            {coords && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-white/65 text-[13px] font-mono-nums">
                  N {coords[0].toFixed(3)} / {coords[1] < 0 ? "W" : "E"} {formatCoord(coords[1])}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/35" />
                <span className="text-white/65 text-[13px] transition-all duration-300">{subtitle}</span>
              </div>
            )}
          </div>

          {focused && (
            <button
              type="button"
              onClick={handleBack}
              className="text-[13px] text-white/70 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-white/15 hover:border-primary/50"
            >
              ← Back to all panels
            </button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <Legend scale={scale} ready={anyGrid} />
        </div>
      </header>

      <div className="flex-1 min-h-0 relative overflow-hidden">
          {!focused ? (
            <motion.div
              key="grid"
              className="absolute inset-0 z-20"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-3 gap-4 w-full h-full">
                {allItems.map((item) => (
                  <PredictionBox
                    key={item.key}
                    label={item.label}
                    isTruth={item.isTruth}
                    state={item.state}
                    grid={item.grid}
                    error={item.error}
                    regionImage={regionImage}
                    groundTruthGrid={landlab.grid}
                    horizonYears={horizonYears}
                    progress={item.progress}
                    stage={item.stage}
                    elapsedYears={item.elapsedYears}
                    scale={scale}
                    onClick={() => handleFocus(item.key)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="focus"
              className="absolute inset-0 z-20 h-full grid grid-cols-12 gap-3"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {focusedItem && (
                <>
                  <div className="col-span-8 row-span-1 h-full rounded-lg glass-panel relative overflow-hidden flex flex-col cursor-pointer">
                    <FocusPanel
                      hero={focusedItem.isTruth}
                      state={focusedItem.state}
                      grid={focusedItem.grid}
                      error={focusedItem.error}
                      progress={focusedItem.progress}
                      horizonYears={horizonYears}
                      elapsedYears={focusedItem.elapsedYears}
                      stageLabel={focusedItem.isTruth ? null : STAGE_LABEL[focusedItem.stage]}
                      scale={scale}
                      regionImage={regionImage}
                    />
                  </div>

                  <div className="col-span-4 h-full flex flex-col gap-3">
                    <h3 className="text-white/60 uppercase tracking-widest text-[11px] font-label-mono shrink-0">
                      Model Variants
                    </h3>

                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                      <div className="flex flex-col gap-3">
                        {allItems
                          .filter((item) => item.key !== focused)
                          .map((item, index) => (
                            <motion.div
                              key={item.key}
                              className="min-h-0"
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.35,
                                ease: "easeInOut",
                                delay: index * 0.05,
                              }}
                            >
                              <ModelCard
                                label={item.label}
                                isTruth={item.isTruth}
                                state={item.state}
                                grid={item.grid}
                                error={item.error}
                                regionImage={regionImage}
                                groundTruthGrid={landlab.grid}
                                horizonYears={horizonYears}
                                progress={item.progress}
                                stage={item.stage}
                                scale={scale}
                                onClick={() => handleFocus(item.key)}
                              />
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
      </div>
    </div>
  );
}

export default ResultsGrid;
