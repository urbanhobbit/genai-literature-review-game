# 🎮 GenAI Literatür Tarama Eğitim Oyunu

Wagner et al. (2026) makalesine dayalı interaktif literatür tarama eğitim oyunu.

## 📋 İçerik

- **7 Seviye**: Problem tanımlama, literatür arama, eleme, kalite değerlendirme, veri çıkarma, analiz, sentez
- **14 Senaryo**: Her seviyede 2 gerçekçi durum
- **42 Soru**: Randomize edilmiş, eşit uzunlukta seçenekler
- **İki Dilli**: Türkçe ↔ İngilizce dil değiştirme
- **Bilgilendirme Ekranları**: Her seviye öncesi Wagner et al. bazlı teorik bilgi

## 🚀 Kurulum ve Deploy

### Ön Gereksinimler

- Node.js (v18 veya üzeri)
- Git
- GitHub hesabı

### Adım 1: Projeyi Klonla veya İndir

Bu projeyi bilgisayarınıza indirin.

### Adım 2: GitHub Repository Oluştur

1. [github.com](https://github.com) → **New repository**
2. Repository adı: `genai-literature-review-game` (veya istediğiniz isim)
3. ✅ **Public** seç
4. ❌ README ekleme
5. **Create repository**

### Adım 3: package.json Düzenle

`package.json` dosyasını açın ve şu satırı düzenleyin:

```json
"homepage": "https://GITHUB_KULLANICI_ADINIZ.github.io/genai-literature-review-game"
```

**GITHUB_KULLANICI_ADINIZ** yerine kendi GitHub kullanıcı adınızı yazın.

Örnek:
```json
"homepage": "https://emreerdogan.github.io/genai-literature-review-game"
```

### Adım 4: Paketleri Kur

Terminal veya Komut İstemi'nde proje klasöründe:

```bash
npm install
```

### Adım 5: Lokal Test (Opsiyonel)

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

### Adım 6: GitHub'a Yükle

```bash
# Git başlat
git init

# Dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: GenAI Literature Review Game"

# GitHub repo'nuza bağla (kendi URL'nizi kullanın)
git remote add origin https://github.com/KULLANICI_ADINIZ/genai-literature-review-game.git

# Push et
git branch -M main
git push -u origin main
```

### Adım 7: GitHub Pages'e Deploy

```bash
npm run deploy
```

Bu komut:
1. ✅ Production build oluşturur
2. ✅ `gh-pages` branch'ine deploy eder
3. ✅ GitHub Pages'i otomatik aktif eder

### Adım 8: GitHub Pages Ayarlarını Kontrol

1. GitHub repo sayfanıza gidin
2. **Settings** → **Pages**
3. **Source**: `gh-pages` branch seçili olmalı
4. **Save**

**5-10 dakika** sonra oyununuz canlı olacak!

## 🌐 Oyun Linki

```
https://KULLANICI_ADINIZ.github.io/genai-literature-review-game/
```

Örnek: `https://emreerdogan.github.io/genai-literature-review-game/`

## 🔄 Güncelleme

Oyunda değişiklik yapmak için:

1. `src/App.jsx` dosyasını düzenleyin
2. Commit ve push edin:
   ```bash
   git add .
   git commit -m "Update game"
   git push
   ```
3. Yeniden deploy edin:
   ```bash
   npm run deploy
   ```

## 📱 Paylaşım

### QR Code Oluşturma

```bash
# https://qr-code-generator.com adresinden link için QR code oluştur
```

### Sosyal Medya Paylaşımı

```
🎮 GenAI Literatür Tarama Oyunu

Wagner et al. (2026) makalesine dayalı interaktif eğitim oyunu.

✅ 7 seviye, 14 senaryo
✅ Türkçe/İngilizce
✅ Anında feedback
✅ Bilgilendirme ekranları

🔗 Oyna: [LINK]
```

## 🐛 Sorun Giderme

### Deploy çalışmıyor?

```bash
# Cache temizle
rm -rf node_modules dist
npm install
npm run deploy
```

### Sayfa 404 hatası veriyor?

- `package.json`'daki `homepage` alanını kontrol edin
- `vite.config.js`'deki `base` yolunu kontrol edin
- Repository adı ve URL eşleşmeli

### Stil bozuk görünüyor?

- Tarayıcı cache'ini temizleyin (Ctrl+Shift+R)
- `npm run build` çalıştırıp tekrar `npm run deploy` yapın

## 📊 Özellikler

- ✅ **Randomize Sorular**: Her oyunda farklı sırada
- ✅ **Eşit Uzunluk**: Tüm seçenekler aynı uzunlukta
- ✅ **Bilgilendirme**: Wagner et al. bazlı teorik açıklamalar
- ✅ **İki Dilli**: Türkçe ↔ İngilizce
- ✅ **Progress Tracking**: Seviye bazlı performans
- ✅ **Grade System**: A-F notlama
- ✅ **Responsive**: Mobil ve desktop uyumlu

## 🎓 Pedagojik Değer

Öğrenciler bu oyun ile:
- GenAI promptlama stratejilerini öğrenir
- Literatür tarama metodolojisini uygular
- Telif hakkı ve etik kuralları anlar
- Metodolojik titizlik kazanır

## 📚 Kaynak

Wagner, G., Prester, J., Mousavi, R., Lukyanenko, R., & Paré, G. (2026). Generative artificial intelligence for literature reviews. *Journal of Information Technology*, 0(0), 1-23.

## 📄 Lisans

Bu proje eğitim amaçlıdır ve Wagner et al. (2026) makalesine dayalıdır.

## 👤 Geliştirici

**Prof. Dr. Emre Erdoğan**  
İstanbul Bilgi Üniversitesi  
Göç Çalışmaları Uygulama ve Araştırma Merkezi

---

## ⚡ Hızlı Başlangıç

```bash
# 1. Paketleri kur
npm install

# 2. package.json'da homepage düzenle
# "homepage": "https://KULLANICI_ADINIZ.github.io/genai-literature-review-game"

# 3. Git işlemleri
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADINIZ/genai-literature-review-game.git
git push -u origin main

# 4. Deploy
npm run deploy
```

**5-10 dakika sonra oyun canlı!** 🎉
