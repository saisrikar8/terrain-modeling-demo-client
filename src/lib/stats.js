function accumulate(gridA, gridB) {
  if (!gridA || !gridB) return null;
  const size = Math.min(gridA.length, gridB.length);
  let sumAbs = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 0; y < size; y++) {
    const rowA = gridA[y];
    const rowB = gridB[y];
    const w = Math.min(rowA.length, rowB.length);
    for (let x = 0; x < w; x++) {
      const d = rowA[x] - rowB[x];
      sumAbs += Math.abs(d);
      sumSq += d * d;
      count++;
    }
  }
  return count ? { sumAbs, sumSq, count } : null;
}

export function computeMaeCm(gridA, gridB) {
  const acc = accumulate(gridA, gridB);
  return acc ? (acc.sumAbs / acc.count) * 100 : null;
}

export function computeRmseCm(gridA, gridB) {
  const acc = accumulate(gridA, gridB);
  return acc ? Math.sqrt(acc.sumSq / acc.count) * 100 : null;
}

export function computeR2(prediction, truth) {
  const acc = accumulate(prediction, truth);
  if (!acc) return null;

  const size = Math.min(prediction.length, truth.length);
  let sum = 0;
  for (let y = 0; y < size; y++) {
    const row = truth[y];
    const w = Math.min(row.length, prediction[y].length);
    for (let x = 0; x < w; x++) sum += row[x];
  }
  const mean = sum / acc.count;

  let ssTot = 0;
  for (let y = 0; y < size; y++) {
    const row = truth[y];
    const w = Math.min(row.length, prediction[y].length);
    for (let x = 0; x < w; x++) {
      const d = row[x] - mean;
      ssTot += d * d;
    }
  }

  return ssTot > 0 ? 1 - acc.sumSq / ssTot : null;
}
