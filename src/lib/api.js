export const API_HTTP = import.meta.env.VITE_API_HTTP || "http://localhost:8000";
export const API_WS = import.meta.env.VITE_API_WS || "ws://localhost:8000";

export async function fetchPatchElevation(patchId) {
  const res = await fetch(`${API_HTTP}/api/patches/${patchId}`);
  if (!res.ok) throw new Error(`patch fetch failed: ${res.status}`);
  return res.json();
}
