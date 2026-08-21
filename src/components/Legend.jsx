import { divergingColor } from "../lib/colors";

const STEPS = 32;

const GRADIENT = `linear-gradient(to right, ${Array.from({ length: STEPS + 1 }, (_, i) => {
  const t = -1 + (2 * i) / STEPS;
  const [r, g, b] = divergingColor(t, 1);
  return `rgb(${r},${g},${b}) ${((i / STEPS) * 100).toFixed(1)}%`;
}).join(", ")})`;

function format(cm) {
  if (cm >= 10) return cm.toFixed(0);
  if (cm >= 1) return cm.toFixed(1);
  return cm.toFixed(2);
}

function Legend({ scale, ready }) {
  const cm = (scale || 0) * 100;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] text-white/70 whitespace-nowrap">Elevation change</span>
        <div className="flex items-center gap-2">
          <span className="font-mono-nums text-[12px] text-white/60 whitespace-nowrap">
            {ready ? `−${format(cm)} cm` : "−"}
          </span>
          <div
            className="h-2.5 w-48 rounded-full border border-white/15"
            style={{ background: GRADIENT }}
          />
          <span className="font-mono-nums text-[12px] text-white/60 whitespace-nowrap">
            {ready ? `+${format(cm)} cm` : "+"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[12px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[rgb(255,214,74)]" />
          Erosion
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[rgb(18,18,20)] border border-white/25" />
          No change
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[rgb(142,226,255)]" />
          Deposition
        </span>
      </div>

      {ready && (
        <span className="text-[11px] text-white/35">
          Shared scale across all panels · 98th percentile
        </span>
      )}
    </div>
  );
}

export default Legend;
