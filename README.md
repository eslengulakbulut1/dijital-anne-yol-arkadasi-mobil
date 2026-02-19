# 🌿 Bebek Bakım Takip

Yeni ebeveynler için tasarlanmış, hem bebeğin bakım sürecini hem de ebeveynin ruh halini takip etmeye yardımcı olan duygusal destek odaklı bir mobil uygulama.

Bu proje, 2 saatlik mobil uygulama geliştirme challenge kapsamında geliştirilmiştir.

---

## 🎯 Proje Amacı

Bu uygulama yalnızca bir kayıt tutma aracı değildir.

Yeni ebeveynlik süreci hem fiziksel hem de duygusal olarak yoğun bir dönemdir. Bu uygulama:

- 🍼 Bebeğin beslenme düzenini takip etmeyi
- 😊 Ebeveynin ruh halini gözlemlemeyi
- 📝 Günlük anıları saklamayı
- 📸 Fotoğraflarla dijital bir “Anı Galerisi” oluşturmayı

amaçlar.

Uygulama, ebeveyn için dijital bir yol arkadaşı olacak şekilde tasarlanmıştır.

---

## 💡 Yaratıcılık & İlham

Pinterest panosundaki pastel, yumuşak ve minimal tasarım dili uygulamaya birebir yansıtılmıştır.

Tasarım kararları:

- 🎨 Pastel renk paleti (yumuşak yeşil, pudra pembe, açık bej)
- 🟢 Yuvarlatılmış kart yapıları
- 🤍 Minimal ve sakin arayüz
- 💛 Empatik ve destekleyici metin dili

Amaç, lohusa dönemindeki anneler için sakin ve güven veren bir dijital ortam oluşturmaktır.

Bu proje sıradan bir liste uygulamasını:

> “Duygusal destek veren dijital ebeveyn asistanı”

konseptine dönüştürmeyi hedefler.

---

## 🚀 Özellikler

### 🏠 Ana Sayfa (Dashboard)

- Günlük beslenme sayısı
- Günlük ortalama ruh hali
- Günlük not sayısı
- Son beslenmeden bu yana geçen süre
- Gün sonu dinamik özet mesajı
- Akıllı destek mesajı (ruh hali ortalamasına göre)

---

### 🍼 Beslenme Takibi

- Emzirme / Biberon / Mama kayıtları
- Filtreleme özelliği
- Son 7 gün istatistik görünümü
- AsyncStorage ile kalıcı kayıt

---

### 😊 Ruh Hali Takibi

- 1–5 arası emoji tabanlı değerlendirme
- Ruh hali renk kodlama
- Haftalık ortalama hesaplama
- Destekleyici akıllı mesaj sistemi

---

### 📝 Notlar (Anı Defteri)

- Günlük not ekleme
- Tarih bazlı listeleme
- Kalıcı veri saklama

---

### 📸 Anı Galerisi

- Fotoğraf ekleme (Expo ImagePicker)
- Açıklama ekleme
- Grid galeri görünümü
- Detay ekranı
- AsyncStorage ile kalıcı kayıt

---

## 🛠 Kullanılan Teknolojiler

- ⚛️ React Native
- 🚀 Expo
- 🟦 TypeScript
- 📦 AsyncStorage
- 🖼 Expo ImagePicker
- 🧭 React Navigation

---

## 🧠 Teknik Mimari

/screens
/components
/navigation
/constants
/types


- Functional Components
- Hooks (useState, useEffect)
- Merkezi tema sistemi (`theme.ts`)
- Reusable bileşen yapısı
- Strong TypeScript typing (no `any`)

---

## 📊 UX Durumları

- Loading state
- Empty state (destekleyici metinlerle)
- Error handling
- Empatik microcopy

---

## 📦 Kurulum

```bash
git clone https://github.com/kullaniciadi/bebek-bakim-takip.git
cd bebek-bakim-takip
npm install
npx expo start
```

## 📽️ Demo Video: https://drive.google.com/file/d/1oShx_mvuQwZ--eLpuWhybvuAKjWJsPZ1/view?usp=drive_link
