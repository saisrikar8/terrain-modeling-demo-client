# TERRA — Terrain Evolution Demo (client)

Interactive front end for comparing four neural networks against a live
[Landlab](https://landlab.readthedocs.io/) physics simulation of terrain erosion.

You pick a Puerto Rico terrain patch, set the erosion parameters, and hit Run. The app
streams a physics simulation and four model predictions side by side, rendered as
elevation-change heatmaps on a shared color scale, and scores each model against the
simulation.

This repository is the **client only**. The FastAPI backend, the trained checkpoints, and
the data-generation pipeline live in separate repositories — see
[Full stack](#full-stack) below.

---

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19, Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` tokens in `src/index.css`) |
| Animation | framer-motion |
| 3D | three.js via `@react-three/fiber` + `drei`, lazy-loaded as its own chunk |
| Lint | oxlint |
| Transport | REST for patch metadata, WebSockets for streaming results |

## Running locally

```bash
npm install
npm run dev
```

The client expects a backend on `http://localhost:8000` by default. Point it elsewhere
with two env vars (see `.env.production` for the deployed values):

```
VITE_API_HTTP=https://your-backend
VITE_API_WS=wss://your-backend
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

---

## Full stack

### 1. Data generation (offline, one time)

Patches are *generated*, not downloaded:

1. A Copernicus **COP30** DEM for the Puerto Rico study region (17.85–18.55 °N,
   67.35–65.15 °W) is pulled from OpenTopography and reprojected to local UTM at 30 m.
2. Daily **CHIRPS** rainfall rasters are downloaded and aligned to the DEM grid.
3. The DEM is tiled into 128×128 windows and filtered for validity and relief.
4. For each window, Landlab evolves the terrain for one year — `FlowAccumulator` (D8) +
   `FastscapeEroder` + `LinearDiffuser` — with randomly sampled erodibility and
   diffusivity. The resulting elevation change is that patch's ground truth.

Each `.npz` patch carries the model input stack, the ground-truth change, the source and
future elevation, the rainfall series, and the Landlab parameters used to produce it.

Terrain feature channels are z-scored **across the whole DEM**, not per patch, so new
patches are only model-compatible if regenerated from an identical source raster.

### 2. Models

Four architectures, all trained on the Puerto Rico dataset and run on CPU:

| Model | Input |
| --- | --- |
| U-Net Baseline | 10 channels — 7 terrain/rainfall rasters + 3 weather one-hots |
| CNN Dense | 14 channels — full 11-channel stack + 3 weather one-hots |
| ViT Large | 14 channels, 8×8 patch embedding |
| ConvLSTM | 12 timesteps × 6 channels, rainfall as the temporal axis |

Each checkpoint stores its own input manifest, so the server builds the exact tensor that
checkpoint was trained on rather than assuming a shared layout.

### 3. Backend

FastAPI + uvicorn:

- `GET /api/patches/{id}` — source elevation grid
- `GET /api/patches/{id}/defaults` — the Landlab parameters recorded for that patch
- `WS /ws/predict` — streams per-model status (`loading` → `running`) then each
  prediction as it completes
- `WS /ws/simulate` — runs Landlab and streams progress frames with the elevation change
  so far, then the final result

Checkpoints are cached in memory after first use (they are ~600 MB on disk and were
otherwise re-read per request). Concurrency is bounded by semaphores, and simulations are
rate limited per client.

### 4. Deployment

The backend runs on an AWS EC2 instance as a `systemd` service, behind Caddy, which
terminates TLS with an automatically renewed Let's Encrypt certificate. The client is a
static Vite build suitable for Vercel or any static host.

HTTPS on the API is not optional: a page served over HTTPS cannot open `ws://`, so the
backend must be reachable over `wss://`.

---

## How results are scored

The ground-truth panel is a **live** Landlab run using the parameters in the sidebar. Each
model is scored against that run:

- **MAE** and **RMSE** in centimetres
- **R²** — coefficient of determination; 0 means "no better than predicting the mean"

The sidebar opens on each patch's *recorded* parameters, so by default the simulation
reproduces the scenario the models were given and the comparison is apples to apples.
Moving a slider is a deliberate departure: the simulation follows your values while the
models keep predicting the recorded scenario, so the metrics drift. The UI says so when
the parameters no longer match.

Example — Cordillera Central at its recorded parameters:

| Model | R² | MAE |
| --- | --- | --- |
| ViT Large | **+0.556** | 0.033 cm |
| U-Net Baseline | +0.143 | 0.075 cm |
| ConvLSTM | +0.113 | 0.057 cm |
| CNN Dense | +0.098 | 0.049 cm |

Values vary by patch; ViT was the strongest on every patch tested.

### Reading the heatmaps

All panels share one diverging color scale so they can be compared directly — warm is
erosion, cool is deposition, near-black is no change. The scale is clipped at the 98th
percentile of absolute change, because a handful of extreme cells would otherwise
compress everything else into the neutral midtone.

---

## Attribution

- Elevation: Copernicus DEM (COP30), via [OpenTopography](https://opentopography.org/)
- Rainfall: [CHIRPS](https://www.chc.ucsb.edu/data/chirps), UC Santa Barbara Climate Hazards Center
- Physics: [Landlab](https://landlab.readthedocs.io/)
- Region photographs: Wikimedia Commons, individually credited in the app
  (CC BY-SA 4.0, CC BY-SA 2.0, CC BY 3.0)
