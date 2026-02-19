export const MOTIVASYON_MESAJLARI = [
  'Her güneşin doğuşu yeni bir başlangıçtır. Sen harika bir ebeveynsin. 🌅',
  'Bebeğine verdiğin her şey, onu büyük biri yapıyor. Gurur duy! 💛',
  'Yorgun hissediyorsan bil ki bu aşkın ta kendisi. Devam et! 🌿',
  'Mükemmel ebeveyn yoktur, ama sen olabildiğince iyisini yapıyorsun. ✨',
  'Bugün zor olsa bile, bebeğin için orada olmak yeter. Bravo! 🌸',
  'Her gülüş, her bakış — bunlar emeklerinin karşılığı. Değer veriyorsun. 🤍',
  'Kendine karşı nazik ol. Sen de bu süreçte büyüyorsun. 🌱',
  'Bir nefes al. Yaptıkların görünmese de hissediliyor. 💙',
  'Bugün biraz daha kolay geçsin diye dua ediyoruz. Sabah hep gelir. 🌤️',
  'Bebeğin en iyi arkadaşı sensin. Ve sen bunu hak ediyorsun. 💖',
  'Uyku azsa bile, sevgi hiç eksilmiyor. Güçlüsün! 🦋',
  'Bu günler geçecek, ama anılar kalacak. Her anı değerli! 📸',
  'Zorluklarla baş etmek seni daha güçlü yapıyor. Farkında mısın? 💪',
  'Bebeğinin gülüşü için yaptığın her şey anlam taşıyor. 😊',
  'Sen inanılmaz bir iş yapıyorsun. Bugün de başarırsın! 🌟',
];

export function getRandomMotivasyonMesaji(): string {
  const today = new Date();
  // Same message all day but changes daily
  const index = (today.getDate() + today.getMonth() * 31) % MOTIVASYON_MESAJLARI.length;
  return MOTIVASYON_MESAJLARI[index];
}

export function getGunSonuMesaji(beslenme: number, ruhHaliOrt: number | null): string {
  if (beslenme === 0) {
    return 'Bugün henüz kayıt eklenmedi. Nasıl geçiyor günün? 💛';
  }
  if (ruhHaliOrt !== null && ruhHaliOrt < 3) {
    return 'Bugün biraz yorucu geçmiş olabilir. Kendine zaman ayırmayı unutma. 💙';
  }
  if (beslenme >= 6 && ruhHaliOrt !== null && ruhHaliOrt >= 4) {
    return 'Harika bir gün geçiriyorsun! Hem beslenme hem de ruh halin süper. 🌟';
  }
  if (beslenme >= 4) {
    return `Bugün ${beslenme} beslenme kaydı ekledin. Böyle devam! 💪`;
  }
  return 'Her gün küçük bir adım. Bugün de harika gidiyor! ✨';
}

export function getSmartSuggestion(son3RuhHali: number[]): string | null {
  if (son3RuhHali.length < 2) return null;
  const ort = son3RuhHali.reduce((a, b) => a + b, 0) / son3RuhHali.length;
  if (ort < 3) {
    return 'Son günlerde biraz zorlanıyor olabilirsin. Kendine zaman ayırmayı unutma 💛';
  }
  if (ort >= 4.5) {
    return 'Son günlerde çok iyi hissediyorsun! Bu enerjiyi koru ✨';
  }
  return null;
}
