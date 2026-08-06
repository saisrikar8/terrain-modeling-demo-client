import { useState } from "react";

function Slider({ label, value, min, max, onChange }) {
  return (
    <div className="mb-2.5">
      <label className="block text-white/60 mb-1 text-xs">{label}</label>
      <div className="flex items-center space-x-2">
        <span className="font-label-mono text-label-mono text-white/40">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-[2px] bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <span className="font-label-mono text-label-mono text-white">{value}</span>
      </div>
    </div>
  );
}

function NavRow({ icon, label }) {
  return (
    <div className="w-full flex items-center space-x-2.5 p-2 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 cursor-default">
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function ParamControls({ disabled, onRun }) {
  const [rainfallRegime] = useState("ordinary");
  const [horizonYears] = useState(1);
  const [precipitationRate, setPrecipitationRate] = useState(45);
  const [soilCohesion, setSoilCohesion] = useState(12);

  // Map the visible Stitch sliders to the backend parameter space.
  const erodibility = 1e-6 + (precipitationRate / 100) * 99e-6;
  const diffusivity = 0.001 + (soilCohesion / 50) * 0.049;

  return (
    <div className="flex flex-col h-full">
      <ul className="space-y-0.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
        <li>
          <button
            type="button"
            className="w-full flex items-center space-x-2.5 p-2 rounded-xl bg-white/10 text-white border border-white/20 transition-all duration-300"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              water_drop
            </span>
            <span className="text-xs">Rainfall Regime</span>
          </button>
        </li>
        <li>
          <NavRow icon="terrain" label="Erodibility" />
        </li>
        <li>
          <NavRow icon="grain" label="Diffusivity" />
        </li>
        <li>
          <NavRow icon="hourglass_empty" label="Time Horizon" />
        </li>

        <li className="mt-4 pt-3 border-t border-white/10">
          <Slider
            label="PRECIPITATION RATE (mm/hr)"
            value={precipitationRate}
            min={0}
            max={100}
            onChange={(e) => setPrecipitationRate(parseInt(e.target.value, 10))}
          />
          <Slider
            label="SOIL COHESION (kPa)"
            value={soilCohesion}
            min={0}
            max={50}
            onChange={(e) => setSoilCohesion(parseInt(e.target.value, 10))}
          />
        </li>
      </ul>

      <div className="mt-auto pt-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onRun({
              rainfallRegime,
              horizonYears,
              erodibility,
              diffusivity,
            })
          }
          className="w-full bg-white text-black text-xs font-medium py-2 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>Run</span>
        </button>
      </div>
    </div>
  );
}

export default ParamControls;
