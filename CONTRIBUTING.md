# Katkı Rehberi

Bitigey Türkiyat'a katkı vermek isteyen herkese açığız. Özellikle akademik
doğruluk, Osmanlı Türkçesi, klasik metinler, aruz, erişilebilirlik ve Windows
kullanım deneyimi konularındaki katkılar değerlidir.

## Başlamadan önce

1. Önce issue açarak büyük bir özellik veya veri değişikliğini tartışın.
2. Kişisel veri, telifli tarama veya üretim yedeği eklemeyin.
3. Kaynak gösteremediğiniz akademik iddiaları veri setine eklemeyin.
4. Sözlük ve kelime haznesi katkıları için [Sözlük Katkı Görevleri](./DICTIONARY-CONTRIBUTION.md) rehberini izleyin.

## Geliştirme akışı

```powershell
npm.cmd install
npm.cmd run desktop
```

Değişiklikten önce ve sonra:

```powershell
node --check js/turkiyat-app.js
node --check electron/main.cjs
```

Windows paketini doğrulamak için:

```powershell
npm.cmd run desktop:dist
```

## Pull request kuralları

- PR başlığı kısa ve eylem odaklı olsun.
- Kullanıcıya görünen Türkçe metinleri açık ve tutarlı yazın.
- Yeni analiz motorlarına örnek girdi/çıktı ekleyin.
- Web sürümü ile masaüstü sürümünün davranış farkını açıklayın.
- Güvenlik ve kişisel veri etkisini belirtin.
- Büyük binary dosyaları repoya eklemeyin; GitHub Releases kullanın.

## Katkı öncelikleri

- Sözlük maddelerini kaynak, dönem, lehçe ve anlam bilgisiyle genişletin.
- Aynı kelimenin farklı yazım ve çeviriyazı biçimlerini birbirine bağlayın.
- Osmanlı Türkçesi, Eski Anadolu Türkçesi, Çağatayca ve modern Türkiye Türkçesi
  için doğrulanabilir örnek cümleler ekleyin.
- Her veri değişikliğinde kaynak künyesini, lisans durumunu ve doğrulama notunu
  PR açıklamasında belirtin.
