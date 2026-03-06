#!/bin/bash

# GenAI Literature Review Game - Quick Deploy Script
# Bu script otomatik deployment yapar

echo "🎮 GenAI Literatür Tarama Oyunu - Otomatik Deployment"
echo "======================================================="
echo ""

# Kullanıcı adını sor
read -p "GitHub kullanıcı adınız: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Hata: Kullanıcı adı boş olamaz!"
    exit 1
fi

echo ""
echo "✅ GitHub kullanıcısı: $GITHUB_USER"
echo ""

# package.json güncelle
echo "📝 package.json güncelleniyor..."
sed -i "s/GITHUB_KULLANICI_ADINIZ/$GITHUB_USER/g" package.json

echo "✅ package.json güncellendi"
echo ""

# npm install
echo "📦 Paketler kuruluyor (bu işlem 2-3 dakika sürebilir)..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Hata: npm install başarısız!"
    exit 1
fi

echo "✅ Paketler kuruldu"
echo ""

# Git init
echo "🔧 Git başlatılıyor..."
git init
git add .
git commit -m "Initial commit: GenAI Literature Review Game"

echo "✅ Git commit tamamlandı"
echo ""

# Remote ekle
echo "🔗 GitHub repository'ye bağlanıyor..."
git remote add origin "https://github.com/$GITHUB_USER/genai-literature-review-game.git"
git branch -M main

echo ""
echo "⚠️  ŞİMDİ: GitHub'a push yapmak için şifrenizi girin"
echo "    (Eğer 2FA aktifse, Personal Access Token kullanın)"
echo ""

git push -u origin main

if [ $? -ne 0 ]; then
    echo "❌ Hata: GitHub push başarısız!"
    echo "   GitHub'da repository oluşturmayı unutmayın!"
    echo "   Repository adı: genai-literature-review-game"
    exit 1
fi

echo ""
echo "✅ GitHub'a yüklendi"
echo ""

# Deploy
echo "🚀 GitHub Pages'e deploy ediliyor..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ Hata: Deploy başarısız!"
    exit 1
fi

echo ""
echo "=============================================="
echo "✅ BAŞARILI! Oyununuz deploy edildi!"
echo "=============================================="
echo ""
echo "🌐 Oyun Linki (5-10 dakika sonra aktif olacak):"
echo "   https://$GITHUB_USER.github.io/genai-literature-review-game/"
echo ""
echo "📋 Kontrol Adımları:"
echo "   1. GitHub'da Settings → Pages → Source: gh-pages olmalı"
echo "   2. 5-10 dakika bekleyin"
echo "   3. Linki ziyaret edin"
echo ""
echo "🎉 Tebrikler!"
