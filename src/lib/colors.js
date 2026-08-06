const EROSION = [215, 59, 0];
const EROSION_MID = [255, 181, 160];
const NEUTRAL = [19, 19, 19];
const DEPOSITION_MID = [158, 202, 255];
const DEPOSITION = [0, 44, 79];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

export function divergingColor(value, maxAbs) {
  const t = Math.max(-1, Math.min(1, maxAbs ? value / maxAbs : 0));
  let rgb;
  if (t < -0.5) rgb = mixColor(EROSION, EROSION_MID, (t + 1) / 0.5);
  else if (t < 0) rgb = mixColor(EROSION_MID, NEUTRAL, (t + 0.5) / 0.5);
  else if (t < 0.5) rgb = mixColor(NEUTRAL, DEPOSITION_MID, t / 0.5);
  else rgb = mixColor(DEPOSITION_MID, DEPOSITION, (t - 0.5) / 0.5);
  return rgb;
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
