# 🚀 GitHub Pages Deployment Rehberi

## Hızlı Başlangıç (5 Adım)

### 1️⃣ GitHub Repository Oluştur

1. https://github.com adresine git
2. Sağ üstte **+** → **New repository**
3. Repository name: `genai-literature-review-game`
4. **Public** seç
5. **Create repository** tıkla

### 2️⃣ package.json Düzenle

Bu klasördeki `package.json` dosyasını aç ve 6. satırı düzenle:

**DEĞİŞTİR:**
```json
"homepage": "https://GITHUB_KULLANICI_ADINIZ.github.io/genai-literature-review-game"
```

**ÖRNEK:**
```json
"homepage": "https://emreerdogan.github.io/genai-literature-review-game"
```

### 3️⃣ Paketleri Kur

Terminal veya Komut İstemi'ni aç, bu klasöre git ve çalıştır:

```bash
npm install
```

Bu işlem 2-3 dakika sürebilir. ☕

### 4️⃣ GitHub'a Yükle

Aynı terminalde sırayla çalıştır:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/KULLANICI_ADINIZ/genai-literature-review-game.git
git branch -M main
git push -u origin main
```

**NOT:** `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yaz!

### 5️⃣ Deploy Et

```bash
npm run deploy
```

✅ **Tamamlandı!** 5-10 dakika sonra oyununuz şu adreste canlı olacak:

```
https://KULLANICI_ADINIZ.github.io/genai-literature-review-game/
```

---

## 🔍 Detaylı Açıklamalar

### npm install Hatası Alıyorsanız

**Node.js yüklü değil:**
1. https://nodejs.org adresine git
2. LTS versiyonu indir ve kur
3. Terminali kapat ve yeniden aç
4. `npm install` tekrar dene

### git push Hatası Alıyorsanız

**Git yüklü değil:**
1. https://git-scm.com/downloads
2. İndir ve kur
3. Terminali kapat ve yeniden aç

**Authentication hatası:**
1. GitHub'da **Settings** → **Developer settings** → **Personal access tokens**
2. **Tokens (classic)** → **Generate new token**
3. Tüm `repo` izinlerini seç
4. Token'ı kopyala
5. Push ederken şifre yerine bu token'ı kullan

### Deploy Kontrol

1. GitHub repo sayfana git
2. **Settings** → **Pages**
3. **Source**: `gh-pages` branch olmalı
4. Üstte yeşil kutuda link görünmeli

### Güncelleme Nasıl Yapılır?

Oyunda değişiklik yapıp güncellemek için:

```bash
# 1. Dosyaları düzenle (örn: src/App.jsx)

# 2. Commit et
git add .
git commit -m "Oyun güncellendi"
git push

# 3. Yeniden deploy et
npm run deploy
```

---

## 📱 Paylaşım İpuçları

### QR Code Oluştur

1. https://qr-code-generator.com adresine git
2. Link'ini yapıştır
3. QR code indir
4. Ders sunumlarına ekle

### Öğrencilere Gönder

**Email Şablonu:**
```
Merhaba,

GenAI Literatür Tarama Oyunu artık hazır!

🎮 Link: https://KULLANICI_ADINIZ.github.io/genai-literature-review-game/

📚 Özellikler:
- 7 seviye, 14 senaryo
- Türkçe/İngilizce seçeneği
- Anında geri bildirim
- Wagner et al. (2026) bazlı

Keyifli öğrenmeler!
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. ✅ Repository adı ve `package.json` homepage eşleşmeli
2. ✅ Repository **Public** olmalı
3. ✅ `npm run deploy` her güncellemeden sonra çalıştırılmalı
4. ✅ 5-10 dakika bekleyin (GitHub Pages deployment süresi)
5. ✅ Tarayıcı cache'i temizleyin (Ctrl+Shift+R)

---

## 🆘 Yardım

Sorun mu yaşıyorsunuz?

1. README.md dosyasındaki "Sorun Giderme" bölümüne bakın
2. GitHub Issues'da soru açın
3. emre.erdogan@bilgi.edu.tr adresine mail atın

---

## ✅ Başarı Kontrol Listesi

- [ ] GitHub repository oluşturuldu
- [ ] package.json homepage düzenlendi
- [ ] npm install başarılı
- [ ] git push başarılı
- [ ] npm run deploy başarılı
- [ ] GitHub Pages Settings kontrol edildi
- [ ] Link çalışıyor
- [ ] Oyun açılıyor ve oynatabiliyor

**Hepsi ✅ ise tebrikler! Oyununuz canlıda!** 🎉
