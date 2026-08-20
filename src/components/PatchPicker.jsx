import PRESET_PATCHES from "../presets";

function PatchPicker({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container relative">
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/40 via-background to-background" />

      <main className="flex-1 pt-16 pb-margin-lg px-margin-sm md:px-margin-md max-w-5xl mx-auto w-full flex flex-col">
        <header className="mb-margin-lg">
          <h1 className="font-headline-xl text-headline-xl text-white mb-3 drop-shadow-md">
            Select a terrain region to begin simulation.
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl drop-shadow">
            Choose an initial geospatial dataset to load into the global erosion and
            sediment transport model. Parameters can be refined in the subsequent
            dashboard.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {PRESET_PATCHES.map((p) => {
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="rounded-2xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-500 relative h-64 md:h-80 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_32px_rgba(33,150,243,0.15)] hover:border-primary/50 bg-surface-dim/30 text-left"
              >
                <div
                  className="absolute inset-0 w-full h-full z-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${p.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute top-0 inset-x-0 z-10 flex justify-between items-start p-panel-padding">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors">open_in_new</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-10 p-panel-padding bg-background/60 backdrop-blur-xl border-t border-white/10 flex flex-col">
                  <h2 className="font-headline-lg text-headline-lg text-white mb-1">{p.region}</h2>
                  <p className="font-body-sm text-body-sm text-white/70 group-hover:text-white transition-colors">
                    {p.description}
                  </p>
                  <p className="font-label-mono text-label-mono text-white/35 mt-2 text-[10px]">
                    N {p.coords[0].toFixed(3)} / W {Math.abs(p.coords[1]).toFixed(3)} · photo: {p.credit}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default PatchPicker;
