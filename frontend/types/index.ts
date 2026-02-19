export type BeslenmeTuru = 'emzirme' | 'biberon' | 'mama';

export interface BeslenmeKaydi {
  id: string;
  tur: BeslenmeTuru;
  miktar?: number; // ml for biberon, grams for mama
  sure?: number;   // minutes for emzirme
  not?: string;
  olusturulmaTarihi: string; // ISO string
}

export type RuhHaliSkor = 1 | 2 | 3 | 4 | 5;

export interface RuhHaliKaydi {
  id: string;
  skor: RuhHaliSkor;
  not?: string;
  olusturulmaTarihi: string; // ISO string
}

export interface Not {
  id: string;
  baslik: string;
  icerik: string;
  olusturulmaTarihi: string; // ISO string
}

export interface Ani {
  id: string;
  imageUri: string;
  aciklama: string;
  olusturulmaTarihi: string; // ISO string
}

export type BeslenmeFiltresi = 'tumu' | BeslenmeTuru;

export interface GunlukOzet {
  beslenme: number;
  ruhHaliOrt: number | null;
  notSayisi: number;
  sonBeslenmeSure: { saat: number; dakika: number } | null;
}
