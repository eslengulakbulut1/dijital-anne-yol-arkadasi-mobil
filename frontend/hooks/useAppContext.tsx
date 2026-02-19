import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Ani, BeslenmeKaydi, Not, RuhHaliKaydi } from '@/types';
import {
  AniStorage,
  BeslenmeStorage,
  NotlarStorage,
  RuhHaliStorage,
} from '@/utils/storage';

interface AppContextValue {
  // Data
  beslenmeKayitlari: BeslenmeKaydi[];
  ruhHaliKayitlari: RuhHaliKaydi[];
  notlar: Not[];
  anilar: Ani[];
  isLoading: boolean;

  // Beslenme
  beslenmeEkle: (kayit: BeslenmeKaydi) => Promise<void>;
  beslenmeSil: (id: string) => Promise<void>;

  // Ruh Hali
  ruhHaliEkle: (kayit: RuhHaliKaydi) => Promise<void>;
  ruhHaliSil: (id: string) => Promise<void>;

  // Notlar
  notEkle: (not: Not) => Promise<void>;
  notSil: (id: string) => Promise<void>;

  // Anı
  aniEkle: (ani: Ani) => Promise<void>;
  aniSil: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [beslenmeKayitlari, setBeslenmeKayitlari] = useState<BeslenmeKaydi[]>([]);
  const [ruhHaliKayitlari, setRuhHaliKayitlari] = useState<RuhHaliKaydi[]>([]);
  const [notlar, setNotlar] = useState<Not[]>([]);
  const [anilar, setAnilar] = useState<Ani[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [beslenme, ruhHali, notlarData, anilarData] = await Promise.all([
        BeslenmeStorage.getAll(),
        RuhHaliStorage.getAll(),
        NotlarStorage.getAll(),
        AniStorage.getAll(),
      ]);
      setBeslenmeKayitlari(beslenme);
      setRuhHaliKayitlari(ruhHali);
      setNotlar(notlarData);
      setAnilar(anilarData);
    } catch {
      // handle gracefully
    } finally {
      setIsLoading(false);
    }
  }

  const beslenmeEkle = useCallback(async (kayit: BeslenmeKaydi) => {
    await BeslenmeStorage.add(kayit);
    setBeslenmeKayitlari((prev) => [kayit, ...prev]);
  }, []);

  const beslenmeSil = useCallback(async (id: string) => {
    await BeslenmeStorage.remove(id);
    setBeslenmeKayitlari((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const ruhHaliEkle = useCallback(async (kayit: RuhHaliKaydi) => {
    await RuhHaliStorage.add(kayit);
    setRuhHaliKayitlari((prev) => [kayit, ...prev]);
  }, []);

  const ruhHaliSil = useCallback(async (id: string) => {
    await RuhHaliStorage.remove(id);
    setRuhHaliKayitlari((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const notEkle = useCallback(async (not: Not) => {
    await NotlarStorage.add(not);
    setNotlar((prev) => [not, ...prev]);
  }, []);

  const notSil = useCallback(async (id: string) => {
    await NotlarStorage.remove(id);
    setNotlar((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const aniEkle = useCallback(async (ani: Ani) => {
    await AniStorage.add(ani);
    setAnilar((prev) => [ani, ...prev]);
  }, []);

  const aniSil = useCallback(async (id: string) => {
    await AniStorage.remove(id);
    setAnilar((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        beslenmeKayitlari,
        ruhHaliKayitlari,
        notlar,
        anilar,
        isLoading,
        beslenmeEkle,
        beslenmeSil,
        ruhHaliEkle,
        ruhHaliSil,
        notEkle,
        notSil,
        aniEkle,
        aniSil,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
