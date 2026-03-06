@echo off
REM GenAI Literature Review Game - Quick Deploy Script (Windows)
REM Bu script otomatik deployment yapar

echo ========================================================
echo 🎮 GenAI Literatür Tarama Oyunu - Otomatik Deployment
echo ========================================================
echo.

REM Kullanıcı adını sor
set /p GITHUB_USER="GitHub kullanıcı adınız: "

if "%GITHUB_USER%"=="" (
    echo ❌ Hata: Kullanıcı adı boş olamaz!
    pause
    exit /b 1
)

echo.
echo ✅ GitHub kullanıcısı: %GITHUB_USER%
echo.

REM package.json güncelle
echo 📝 package.json güncelleniyor...
powershell -Command "(gc package.json) -replace 'GITHUB_KULLANICI_ADINIZ', '%GITHUB_USER%' | Out-File -encoding ASCII package.json"

echo ✅ package.json güncellendi
echo.

REM npm install
echo 📦 Paketler kuruluyor (bu işlem 2-3 dakika sürebilir)...
call npm install

if errorlevel 1 (
    echo ❌ Hata: npm install başarısız!
    pause
    exit /b 1
)

echo ✅ Paketler kuruldu
echo.

REM Git init
echo 🔧 Git başlatılıyor...
git init
git add .
git commit -m "Initial commit: GenAI Literature Review Game"

echo ✅ Git commit tamamlandı
echo.

REM Remote ekle
echo 🔗 GitHub repository'ye bağlanıyor...
git remote add origin https://github.com/%GITHUB_USER%/genai-literature-review-game.git
git branch -M main

echo.
echo ⚠️  ŞİMDİ: GitHub'a push yapmak için şifrenizi girin
echo     (Eğer 2FA aktifse, Personal Access Token kullanın)
echo.

git push -u origin main

if errorlevel 1 (
    echo ❌ Hata: GitHub push başarısız!
    echo    GitHub'da repository oluşturmayı unutmayın!
    echo    Repository adı: genai-literature-review-game
    pause
    exit /b 1
)

echo.
echo ✅ GitHub'a yüklendi
echo.

REM Deploy
echo 🚀 GitHub Pages'e deploy ediliyor...
call npm run deploy

if errorlevel 1 (
    echo ❌ Hata: Deploy başarısız!
    pause
    exit /b 1
)

echo.
echo ==============================================
echo ✅ BAŞARILI! Oyununuz deploy edildi!
echo ==============================================
echo.
echo 🌐 Oyun Linki (5-10 dakika sonra aktif olacak):
echo    https://%GITHUB_USER%.github.io/genai-literature-review-game/
echo.
echo 📋 Kontrol Adımları:
echo    1. GitHub'da Settings → Pages → Source: gh-pages olmalı
echo    2. 5-10 dakika bekleyin
echo    3. Linki ziyaret edin
echo.
echo 🎉 Tebrikler!
echo.
pause
