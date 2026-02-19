import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Ani, BeslenmeKaydi, Not, RuhHaliKaydi } from '@/types';

const KEYS = {
  BESLENME: '@bebek_app/beslenme',
  RUH_HALI: '@bebek_app/ruh_hali',
  NOTLAR: '@bebek_app/notlar',
  ANI_GALERISI: '@bebek_app/ani_galerisi',
} as const;

async function getItem<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function setItem<T>(key: string, data: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silently handle storage errors
  }
}

// Beslenme
export const BeslenmeStorage = {
  getAll: () => getItem<BeslenmeKaydi>(KEYS.BESLENME),
  save: async (kayitlar: BeslenmeKaydi[]) => setItem(KEYS.BESLENME, kayitlar),
  add: async (kayit: BeslenmeKaydi) => {
    const existing = await getItem<BeslenmeKaydi>(KEYS.BESLENME);
    await setItem(KEYS.BESLENME, [kayit, ...existing]);
  },
  remove: async (id: string) => {
    const existing = await getItem<BeslenmeKaydi>(KEYS.BESLENME);
    await setItem(KEYS.BESLENME, existing.filter((k) => k.id !== id));
  },
};

// Ruh Hali
export const RuhHaliStorage = {
  getAll: () => getItem<RuhHaliKaydi>(KEYS.RUH_HALI),
  save: async (kayitlar: RuhHaliKaydi[]) => setItem(KEYS.RUH_HALI, kayitlar),
  add: async (kayit: RuhHaliKaydi) => {
    const existing = await getItem<RuhHaliKaydi>(KEYS.RUH_HALI);
    await setItem(KEYS.RUH_HALI, [kayit, ...existing]);
  },
  remove: async (id: string) => {
    const existing = await getItem<RuhHaliKaydi>(KEYS.RUH_HALI);
    await setItem(KEYS.RUH_HALI, existing.filter((k) => k.id !== id));
  },
};

// Notlar
export const NotlarStorage = {
  getAll: () => getItem<Not>(KEYS.NOTLAR),
  save: async (notlar: Not[]) => setItem(KEYS.NOTLAR, notlar),
  add: async (not: Not) => {
    const existing = await getItem<Not>(KEYS.NOTLAR);
    await setItem(KEYS.NOTLAR, [not, ...existing]);
  },
  remove: async (id: string) => {
    const existing = await getItem<Not>(KEYS.NOTLAR);
    await setItem(KEYS.NOTLAR, existing.filter((n) => n.id !== id));
  },
};

// Anı Galerisi
export const AniStorage = {
  getAll: () => getItem<Ani>(KEYS.ANI_GALERISI),
  save: async (anilar: Ani[]) => setItem(KEYS.ANI_GALERISI, anilar),
  add: async (ani: Ani) => {
    const existing = await getItem<Ani>(KEYS.ANI_GALERISI);
    await setItem(KEYS.ANI_GALERISI, [ani, ...existing]);
  },
  remove: async (id: string) => {
    const existing = await getItem<Ani>(KEYS.ANI_GALERISI);
    await setItem(KEYS.ANI_GALERISI, existing.filter((a) => a.id !== id));
  },
};
