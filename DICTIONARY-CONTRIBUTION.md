# Bitigey Türkiyat Sözlük Katkı Görevleri

Bu görev listesi, Bitigey Türkiyat'ın sözlük ve kelime haznesini akademik
olarak güvenilir, genişletilebilir ve makine tarafından işlenebilir biçimde
büyütmek için hazırlanmıştır.

## İlk görev havuzu

- [ ] Modern Türkiye Türkçesi temel kelime haznesini eksik başlıklara göre tamamlamak
- [ ] Osmanlı Türkçesi madde başlarını Arap harfli biçim, Latin çeviriyazı ve günümüz karşılığıyla eklemek
- [ ] Eski Anadolu Türkçesi ve Çağatayca için dönem/lehçe etiketleri oluşturmak
- [ ] Aruz, edebiyat, tarih, hukuk, tasavvuf ve kodikoloji terimlerini ayrı alanlarla işlemek
- [ ] Eş anlamlı, karşıt anlamlı, türemiş ve birleşik kelime ilişkilerini bağlamak
- [ ] Her maddeye en az bir kaynaklı örnek cümle eklemek
- [ ] Yazım varyantlarını ve yaygın OCR hatalarını arama için eşlemek
- [ ] Eksik veya tartışmalı maddeler için editoryal inceleme kuyruğu oluşturmak
- [ ] Sözlük aramasına kök, ek, dönem ve lehçe filtreleri eklemek
- [ ] Katkıların dışa aktarımı için sürümlü JSON/CSV veri sözleşmesi hazırlamak

## Madde ekleme talimatı

Her yeni madde şu alanları içermelidir:

```json
{
  "lemma": "madde başı",
  "variants": ["yazım veya çeviriyazı varyantı"],
  "partOfSpeech": "isim",
  "definitions": ["kaynaklı anlam"],
  "examples": [
    {
      "text": "örnek cümle",
      "source": "Yazar, eser, baskı, sayfa"
    }
  ],
  "language": "tr",
  "period": "Osmanlı Türkçesi",
  "register": "edebî",
  "sources": [
    {
      "citation": "Tam bibliyografik künye",
      "url": "https://example.org",
      "accessed": "2026-01-01"
    }
  ],
  "license": "public-domain"
}
```

## Kalite ve telif kontrolü

1. Birincil kaynak veya güvenilir akademik sözlük gösterin.
2. Kişisel yorumları tanım gibi yazmayın; tartışmalı anlamları not olarak işaretleyin.
3. Telifli bir eserden uzun alıntı kopyalamayın. Kısa örnek ve tam künye kullanın.
4. Kaynağı olmayan otomatik üretim sonuçlarını doğrudan yayımlamayın.
5. Aynı lemma için mevcut kaydı kontrol edin; yinelenen madde açmayın.
6. Arap harfli metinlerde karakterleri ve harekeleri ikinci bir kişiyle doğrulayın.
7. Pull request açıklamasında madde sayısını, kaynakları ve belirsizlikleri listeleyin.

## Ölçülebilir yayın hedefleri

- Her sürümde en az 100 yeni ve kaynaklı madde
- Her yeni maddenin en az bir örnek cümle ve bir bibliyografik kaynağı
- Yinelenen madde oranı: `%1` altında
- Kaynaksız madde oranı: `%0`
- Her sürüm öncesi editör incelemesi ve JSON şema doğrulaması

Veri formatı, alan adları veya lisans konusunda belirsizlik varsa veri eklemek
yerine issue açın.
