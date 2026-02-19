import type { RuhHaliSkor } from '@/types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)}, ${formatTime(isoString)}`;
}

export function isToday(isoString: string): boolean {
  const date = new Date(isoString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isInLast7Days(isoString: string): boolean {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

export function getDayOfWeek(isoString: string): string {
  const date = new Date(isoString);
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return days[date.getDay()];
}

export function timeSince(isoString: string): { saat: number; dakika: number } {
  const diff = Date.now() - new Date(isoString).getTime();
  const totalMinutes = Math.floor(diff / 60000);
  return {
    saat: Math.floor(totalMinutes / 60),
    dakika: totalMinutes % 60,
  };
}

export function getMoodColor(skor: RuhHaliSkor): { bg: string; text: string; border: string } {
  if (skor <= 2) return { bg: '#FFCDD2', text: '#C62828', border: '#EF9A9A' };
  if (skor === 3) return { bg: '#FFF9C4', text: '#F57F17', border: '#FFF176' };
  return { bg: '#C8E6C9', text: '#1B5E20', border: '#A5D6A7' };
}

export function getMoodEmoji(skor: RuhHaliSkor): string {
  const emojis: Record<RuhHaliSkor, string> = {
    1: '😔',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊',
  };
  return emojis[skor];
}

export function getMoodLabel(skor: RuhHaliSkor): string {
  const labels: Record<RuhHaliSkor, string> = {
    1: 'Çok Zor',
    2: 'Zor',
    3: 'Normal',
    4: 'İyi',
    5: 'Harika',
  };
  return labels[skor];
}

export function getFeedingLabel(tur: string): string {
  const labels: Record<string, string> = {
    emzirme: 'Emzirme',
    biberon: 'Biberon',
    mama: 'Mama',
  };
  return labels[tur] ?? tur;
}

export function getFeedingEmoji(tur: string): string {
  const emojis: Record<string, string> = {
    emzirme: '🤱',
    biberon: '🍼',
    mama: '🥣',
  };
  return emojis[tur] ?? '🍽️';
}

export function getLast7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

export function isSameDay(dateA: Date, isoString: string): boolean {
  const dateB = new Date(isoString);
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}
