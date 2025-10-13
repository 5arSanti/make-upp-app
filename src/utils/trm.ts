export interface TRMApiResponseItem {
  unidad: string; // expected 'COP'
  valor: string; // comes as string in the API
  vigenciadesde: string;
  vigenciahasta: string;
}

export interface TRM {
  unidad: string;
  valor: number;
  vigenciadesde: string;
  vigenciahasta: string;
}

const TRM_STORAGE_KEY = "trm_cache_v1";

interface TRMCacheEntry {
  dateKey: string; // YYYY-MM-DD
  trm: TRM;
}

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseTRM(apiItem: TRMApiResponseItem): TRM {
  return {
    unidad: apiItem.unidad,
    valor: Number(apiItem.valor),
    vigenciadesde: apiItem.vigenciadesde,
    vigenciahasta: apiItem.vigenciahasta,
  };
}

export async function fetchLatestTRM(): Promise<TRM> {
  const url =
    "https://www.datos.gov.co/resource/mcec-87by.json?$order=vigenciadesde%20DESC&$limit=1";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch TRM: ${response.status}`);
  }
  const data = (await response.json()) as TRMApiResponseItem[];
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("TRM response empty");
  }
  return parseTRM(data[0]);
}

export function readCachedTRM(): TRM | null {
  try {
    const raw = localStorage.getItem(TRM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TRMCacheEntry;
    if (!parsed?.trm) return null;
    return parsed.trm;
  } catch {
    return null;
  }
}

export function isCacheValidForToday(entry: TRMCacheEntry | null): boolean {
  if (!entry) return false;
  return entry.dateKey === getTodayKey();
}

export async function ensureTRMForToday(): Promise<TRM | null> {
  try {
    const existingRaw = localStorage.getItem(TRM_STORAGE_KEY);
    let existing: TRMCacheEntry | null = null;
    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw) as TRMCacheEntry;
      } catch {
        existing = null;
      }
    }

    if (isCacheValidForToday(existing)) {
      return existing!.trm;
    }

    const trm = await fetchLatestTRM();
    const entry: TRMCacheEntry = { dateKey: getTodayKey(), trm };
    localStorage.setItem(TRM_STORAGE_KEY, JSON.stringify(entry));
    return trm;
  } catch {
    // On failure, keep previous cached value if present
    const fallback = readCachedTRM();
    return fallback ?? null;
  }
}

export function usdToCop(usdAmount: number, trm?: TRM | null): number {
  const rate = trm?.valor ?? readCachedTRM()?.valor ?? 0;
  if (!rate) return usdAmount; // fallback: show USD amount if no TRM
  return usdAmount * rate;
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
