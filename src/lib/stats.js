export function computeMSE(gridA, gridB) {
  if (!gridA || !gridB) return null;
  const size = Math.min(gridA.length, gridB.length);
  let sum = 0;
  let count = 0;
  for (let y = 0; y < size; y++) {
    const rowA = gridA[y];
    const rowB = gridB[y];
    const w = Math.min(rowA.length, rowB.length);
    for (let x = 0; x < w; x++) {
      const d = rowA[x] - rowB[x];
      sum += d * d;
      count++;
    }
  }
  return count ? sum / count : null;
}

export function computeErrorPercent(gridA, gridB) {
  if (!gridA || !gridB) return null;
  let sumAbsA = 0;
  let sumAbsDiff = 0;
  const size = Math.min(gridA.length, gridB.length);
  for (let y = 0; y < size; y++) {
    const rowA = gridA[y];
    const rowB = gridB[y];
    const w = Math.min(rowA.length, rowB.length);
    for (let x = 0; x < w; x++) {
      sumAbsA += Math.abs(rowA[x]);
      sumAbsDiff += Math.abs(rowA[x] - rowB[x]);
    }
  }
  return sumAbsA > 0 ? (sumAbsDiff / sumAbsA) * 100 : null;
}
