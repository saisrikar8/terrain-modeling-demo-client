const DIVERGING_STOPS = [
  [-1.0, [255, 214, 74]],
  [-0.72, [255, 166, 36]],
  [-0.44, [240, 104, 26]],
  [-0.2, [156, 36, 62]],
  [0.0, [18, 18, 20]],
  [0.2, [28, 54, 122]],
  [0.44, [22, 122, 192]],
  [0.72, [40, 178, 214]],
  [1.0, [142, 226, 255]],
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(c1, c2, t) {
  const e = t * t * (3 - 2 * t);
  return [
    Math.round(lerp(c1[0], c2[0], e)),
    Math.round(lerp(c1[1], c2[1], e)),
    Math.round(lerp(c1[2], c2[2], e)),
  ];
}

export function divergingColor(value, maxAbs) {
  const t = Math.max(-1, Math.min(1, maxAbs ? value / maxAbs : 0));
  for (let i = 0; i < DIVERGING_STOPS.length - 1; i++) {
    const [t0, c0] = DIVERGING_STOPS[i];
    const [t1, c1] = DIVERGING_STOPS[i + 1];
    if (t <= t1) return mixColor(c0, c1, (t - t0) / (t1 - t0));
  }
  return DIVERGING_STOPS[DIVERGING_STOPS.length - 1][1];
}

export function divergingCss(value, maxAbs) {
  const [r, g, b] = divergingColor(value, maxAbs);
  return `rgb(${r}, ${g}, ${b})`;
}

export function elevationGray(value, min, max) {
  const t = max > min ? (value - min) / (max - min) : 0.5;
  const v = Math.round(30 + t * 170);
  return [v, v, v * 0.98];
}

export function colorScaleOf(grid, percentile = 98) {
  const values = [];
  for (const row of grid) {
    for (const v of row) values.push(Math.abs(v));
  }
  if (!values.length) return 0.001;
  values.sort((a, b) => a - b);
  const idx = Math.min(values.length - 1, Math.floor((percentile / 100) * values.length));
  return values[idx] || values[values.length - 1] || 0.001;
}

export function sharedScaleOf(grids) {
  let max = 0;
  for (const g of grids) {
    if (!g?.length) continue;
    const s = colorScaleOf(g);
    if (s > max) max = s;
  }
  return max || 0.001;
}

export function maxAbsOf(grid) {
  let max = 0;
  for (const row of grid) {
    for (const v of row) {
      const a = Math.abs(v);
      if (a > max) max = a;
    }
  }
  return max || 0.001;
}

export function rangeOf(grid) {
  let min = Infinity;
  let max = -Infinity;
  for (const row of grid) {
    for (const v of row) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return [min, max];
}
