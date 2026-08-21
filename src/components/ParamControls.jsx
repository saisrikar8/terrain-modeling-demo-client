import { useState } from "react";

const DEFAULTS = {
  rainfallRegime: "ordinary",
  erodibility: 1e-5,
  diffusivity: 0.01,
  horizonYears: 1,
};

const REGIMES = [
  { id: "ordinary", label: "Ordinary", detail: "Baseline CHIRPS rainfall" },
  { id: "wet", label: "Wet", detail: "1.5× daily rainfall" },
  { id: "extreme", label: "Extreme", detail: "2.5× daily rainfall" },
];

const TABS = [
  { id: "rainfall", icon: "water_drop", label: "Rainfall Regime" },
  { id: "erodibility", icon: "terrain", label: "Erodibility" },
  { id: "diffusivity", icon: "grain", label: "Diffusivity" },
  { id: "horizon", icon: "hourglass_empty", label: "Time Horizon" },
];

function formatKsp(v) {
  const exp = Math.floor(Math.log10(v));
  return `${(v / 10 ** exp).toFixed(1)}e${exp}`;
}

function Slider({ label, unit, display, value, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-label-mono uppercase tracking-wider text-white/60 text-[11px]">
          {label}
        </label>
        <span className="tnum text-white text-[13px]">
          {display}
          <span className="text-white/40 ml-1">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-[2px] bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
      />
    </div>
  );
}

function ParamControls({ disabled, onRun }) {
  const [activeTab, setActiveTab] = useState("rainfall");
  const [rainfallRegime, setRainfallRegime] = useState(DEFAULTS.rainfallRegime);
  const [erodibilityExp, setErodibilityExp] = useState(Math.log10(DEFAULTS.erodibility));
  const [diffusivity, setDiffusivity] = useState(DEFAULTS.diffusivity);
  const [horizonYears, setHorizonYears] = useState(DEFAULTS.horizonYears);

  const erodibility = 10 ** erodibilityExp;

  const summary = {
    rainfall: REGIMES.find((r) => r.id === rainfallRegime).label,
    erodibility: formatKsp(erodibility),
    diffusivity: diffusivity.toFixed(3),
    horizon: `${horizonYears}y`,
  };

  const dirty =
    rainfallRegime !== DEFAULTS.rainfallRegime ||
    Math.abs(erodibility - DEFAULTS.erodibility) > 1e-9 ||
    diffusivity !== DEFAULTS.diffusivity ||
    horizonYears !== DEFAULTS.horizonYears;

  function reset() {
    setRainfallRegime(DEFAULTS.rainfallRegime);
    setErodibilityExp(Math.log10(DEFAULTS.erodibility));
    setDiffusivity(DEFAULTS.diffusivity);
    setHorizonYears(DEFAULTS.horizonYears);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <ul className="space-y-0.5 shrink-0">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2.5 p-2 rounded-xl transition-all duration-300 ${
                  active
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/70 border border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={active ? { fontVariationSettings: '"FILL" 1' } : undefined}
                >
                  {tab.icon}
                </span>
                <span className="text-[13px] flex-1 text-left">{tab.label}</span>
                <span className="tnum text-[11px] text-white/55">
                  {summary[tab.id]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 pt-3 border-t border-white/10 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
        {activeTab === "rainfall" && (
          <div className="space-y-1.5">
            {REGIMES.map((regime) => {
              const selected = regime.id === rainfallRegime;
              return (
                <button
                  key={regime.id}
                  type="button"
                  onClick={() => setRainfallRegime(regime.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all duration-200 ${
                    selected
                      ? "bg-white/10 border-white/25 text-white"
                      : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="text-[13px] font-medium">{regime.label}</div>
                  <div className="text-[11px] text-white/55 mt-0.5">{regime.detail}</div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "erodibility" && (
          <div className="space-y-2">
            <Slider
              label="Stream power K"
              unit="1/yr"
              display={formatKsp(erodibility)}
              value={erodibilityExp}
              min={-6}
              max={-4}
              step={0.05}
              onChange={(e) => setErodibilityExp(parseFloat(e.target.value))}
            />
            <p className="text-[11px] text-white/55 leading-relaxed">
              Bedrock incision coefficient in the Fastscape eroder. Higher values cut
              channels faster.
            </p>
          </div>
        )}

        {activeTab === "diffusivity" && (
          <div className="space-y-2">
            <Slider
              label="Hillslope diffusivity"
              unit="m²/yr"
              display={diffusivity.toFixed(3)}
              value={diffusivity}
              min={0.001}
              max={0.05}
              step={0.001}
              onChange={(e) => setDiffusivity(parseFloat(e.target.value))}
            />
            <p className="text-[11px] text-white/55 leading-relaxed">
              Linear diffusion rate for soil creep. Higher values smooth ridges and
              fill hollows.
            </p>
          </div>
        )}

        {activeTab === "horizon" && (
          <div className="space-y-2">
            <Slider
              label="Simulated span"
              unit={horizonYears === 1 ? "year" : "years"}
              display={horizonYears}
              value={horizonYears}
              min={1}
              max={50}
              step={1}
              onChange={(e) => setHorizonYears(parseInt(e.target.value, 10))}
            />
            <p className="text-[11px] text-white/55 leading-relaxed">
              Total time evolved by the Landlab simulation, split across 12 substeps.
            </p>
          </div>
        )}

        {dirty && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-[11px] text-white/55 leading-relaxed">
              Parameters drive the Landlab ground truth. Model predictions come from
              the scenario recorded in the patch, so they stay fixed.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-[11px] text-white/65 hover:text-white transition-colors underline underline-offset-2"
            >
              Reset to patch baseline
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRun({ rainfallRegime, horizonYears, erodibility, diffusivity })}
          className="w-full bg-white text-black text-[14px] font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>{disabled ? "Running…" : "Run"}</span>
        </button>
      </div>
    </div>
  );
}

export default ParamControls;
