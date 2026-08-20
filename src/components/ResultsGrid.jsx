import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Heatmap2D from "./Heatmap2D";
import FocusPanel from "./FocusPanel";
import { computeMaeCm, computeRmseCm } from "../lib/stats";

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

function ModelCard({ label, isTruth, state, grid, error, regionImage, groundTruthGrid, progress, stage, onClick, active }) {
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
          <Heatmap2D grid={grid} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
          <h4 className="font-semibold text-white text-sm leading-5 truncate">{label}</h4>
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
          <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-4">
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
    <div onClick={onClick} className="glass-panel card-hover rounded-xl flex flex-col aspect-square w-[min(36%,27vw,46vh)] min-w-[260px] min-h-0 mb-[1.7%] cursor-pointer overflow-hidden group border border-white/5 active:scale-[0.98]">
      <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-black">
        {grid ? (
          <Heatmap2D grid={grid} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
          <h4 className="font-semibold text-white text-base leading-6 truncate">{label}</h4>
          {isTruth ? (
            <span className="data-tag font-label-mono text-label-mono text-on-surface px-2 py-0.5 rounded shrink-0 ml-2">
              {state === "idle" ? "—" : `${percent}%`}
            </span>
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[16px]">open_in_new</span>
          )}
        </div>

        {isTruth ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
            {state === "loading" && elapsedYears != null
              ? `Simulating • ${elapsedYears} / ${horizonYears} years`
              : `Ground truth erosion simulation • T + ${horizonYears} years`}
          </p>
        ) : (
          <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
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

  const formatCoord = (v) => Math.abs(v).toFixed(1);

  const allItems = [
    {
      key: "landlab",
      label: "Ground Truth (Landlab)",
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
      <header className="mt-8 mb-3 flex justify-between items-end z-10 shrink-0">
        <div>
          <h2 className="text-[26px] leading-8 font-semibold text-white tracking-tight">{regionName}</h2>
          {coords && (
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-white/60 text-xs">
                N {coords[0].toFixed(1)} / {coords[1] < 0 ? "W" : "E"} {formatCoord(coords[1])}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/60 text-xs transition-all duration-300">{subtitle}</span>
            </div>
          )}
        </div>

        {focused && (
          <button
            type="button"
            onClick={handleBack}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            ← Back to grid
          </button>
        )}
      </header>

      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {!focused ? (
            <motion.div
              key="grid"
              className="absolute inset-0 z-20 flex items-center justify-center"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="flex flex-wrap justify-center content-center gap-x-[2%] w-[92%]">
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
              exit={{ opacity: 0, x: 60 }}
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
                      regionImage={regionImage}
                    />
                  </div>

                  <div className="col-span-4 h-full flex flex-col gap-3">
                    <h3 className="text-white/60 uppercase tracking-widest text-[10px] font-label-mono shrink-0">
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
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ResultsGrid;
