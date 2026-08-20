import { useEffect, useState } from "react";
import PatchPicker from "./components/PatchPicker";
import ParamControls from "./components/ParamControls";
import ResultsGrid from "./components/ResultsGrid";
import { API_WS } from "./lib/api";

const MODEL_NAMES = ["unet", "cnn", "vit", "convlstm"];

const emptyModelState = () =>
  Object.fromEntries(MODEL_NAMES.map((m) => [m, { state: "idle" }]));

function App() {
  const [patch, setPatch] = useState(null);
  const [running, setRunning] = useState(false);
  const [modelResults, setModelResults] = useState(emptyModelState());
  const [landlab, setLandlab] = useState({ state: "idle" });
  const [horizonYears, setHorizonYears] = useState(1);

  useEffect(() => {
    document.body.style.overflow = patch ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [patch]);

  function runPrediction(params) {
    setRunning(true);
    setHorizonYears(params.horizonYears);
    setModelResults(
      Object.fromEntries(MODEL_NAMES.map((m) => [m, { state: "loading" }]))
    );
    setLandlab({ state: "queued" });

    const predictWs = new WebSocket(`${API_WS}/ws/predict`);
    predictWs.onopen = () => {
      predictWs.send(JSON.stringify({ patch_id: patch.id, models: MODEL_NAMES }));
    };
    predictWs.onmessage = (evt) => {
      let msg;
      try {
        msg = JSON.parse(evt.data);
      } catch {
        return;
      }
      if (msg.type === "model_status") {
        setModelResults((prev) => ({
          ...prev,
          [msg.model]: { state: "loading", stage: msg.stage },
        }));
      } else if (msg.model) {
        setModelResults((prev) => ({
          ...prev,
          [msg.model]: msg.error
            ? { state: "error", error: msg.error }
            : { state: "done", grid: msg.grid },
        }));
      }
    };
    predictWs.onclose = () => setRunning(false);
    predictWs.onerror = () => {
      setModelResults((prev) =>
        Object.fromEntries(
          MODEL_NAMES.map((m) => [
            m,
            prev[m]?.state === "done" ? prev[m] : { state: "error", error: "Connection failed" },
          ])
        )
      );
    };

    const simWs = new WebSocket(`${API_WS}/ws/simulate`);
    simWs.onopen = () => {
      simWs.send(
        JSON.stringify({
          patch_id: patch.id,
          rainfall_regime: params.rainfallRegime,
          horizon_years: params.horizonYears,
          erodibility: params.erodibility,
          diffusivity: params.diffusivity,
        })
      );
    };
    simWs.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "queued") {
        setLandlab({ state: "queued" });
      } else if (msg.type === "progress") {
        setLandlab({
          state: "loading",
          progress: msg.percent,
          elapsedYears: msg.elapsed_years,
          grid: msg.change_m,
        });
      } else if (msg.type === "simulate_result") {
        setLandlab({ state: "done", grid: msg.change_m });
      } else if (msg.type === "rate_limited" || msg.type === "error") {
        setLandlab({ state: "error", error: msg.message });
      }
    };
    simWs.onerror = () => {
      setLandlab((prev) =>
        prev.state === "done" ? prev : { state: "error", error: "Connection failed" }
      );
    };
  }

  if (!patch) {
    return <PatchPicker onSelect={setPatch} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden flex bg-surface text-on-surface font-body-md selection:bg-white/20">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/70 via-background to-background" />

      <nav className="fixed left-0 top-0 bottom-0 w-[240px] z-40 flex flex-col p-4 glass-panel border-r border-white/10 h-full">
        <div className="mb-5 flex flex-col">
          <h1 className="text-base font-semibold text-white leading-tight">Simulation Parameters</h1>
          <button
            type="button"
            onClick={() => setPatch(null)}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors mt-0.5 text-left"
          >
            ← Change region
          </button>
        </div>

        <ParamControls disabled={running} onRun={runPrediction} />
      </nav>

      <main className="flex-1 ml-[240px] h-full p-6 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-[1280px] h-full">
          <ResultsGrid
            regionName={patch.region}
            coords={patch.coords}
            models={modelResults}
            landlab={landlab}
            horizonYears={horizonYears}
            regionImage={patch.image}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
