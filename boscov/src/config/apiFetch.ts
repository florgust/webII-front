const API_BASE = "http://localhost:3030";

export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE}${path}`;
  return fetch(url, options);
}