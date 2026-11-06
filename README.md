# Bitigey Türkiyat — Windows Masaüstü Uygulaması

Bu repository yalnızca Bitigey Türkiyat Windows masaüstü uygulamasının kaynak
kodunu içerir. Türkoloji, klasik Türk edebiyatı, Osmanlı Türkçesi ve dijital
filoloji araştırmaları için ücretsiz, yerel öncelikli bir çalışma
istasyonudur. Bitigey.com'un web portalı, üretim verileri ve kullanıcı
yedekleri bu repository'nin parçası değildir.

## Neler var?

- Çoklu nüsha edisyon kritik ve otomatik varyant aparatı
- Aruz vezni analizi
- Çeviriyazı klavyesi ve dönüştürücü
- Edebiyat ve filoloji sözlüğü
- Ebced ve tarih düşürme
- Kodikoloji tavsif formu
- Dizin ve konkordans analizi
- TEI-XML, LaTeX, CSV, TXT, Word ve JSON dışa aktarma
- Windows masaüstü uygulaması (Electron)

## Geliştirme

```powershell
npm.cmd install
npm.cmd run desktop
```

Windows kurulum paketi üretmek için:

```powershell
npm.cmd run desktop:dist
```

Çıktı `downloads/` klasörüne yazılır. Bu klasör Git'e gönderilmez; yayınlama
için GitHub Releases veya Bitigey'in indirme sunucusu kullanılmalıdır.

## Proje yapısı

- `html/` — web ve uygulama ekranları
- `css/` — ortak, Türkiyat ve masaüstü stilleri
- `js/` — analiz motorları ve arayüz davranışları
- `electron/` — Windows masaüstü kabuğu
- `cloudflare/` — ayrı AI Worker entegrasyonu

## Veri ve güvenlik

Kullanıcı/yazar yedekleri, üretim verileri, API sırları ve yerel dışa
aktarmalar açık kaynak dağıtımına dahil edilmez. Gerçek verilerle çalışırken
`.gitignore` kurallarını kontrol edin ve Cloudflare/Firebase sırlarını kaynak
dosyalarına yazmayın.

## Katkı

Katkı göndermeden önce [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasını okuyun.
Sözlük ve kelime haznesi çalışmaları için
[DICTIONARY-CONTRIBUTION.md](./DICTIONARY-CONTRIBUTION.md) görev listesini izleyin.
Güvenlik açığı için public issue açmak yerine [SECURITY.md](./SECURITY.md)
üzerindeki kanalı kullanın.

## Lisans

Bitigey Türkiyat AGPL-3.0-or-later ile lisanslanır. Ayrıntı için
[LICENSE](./LICENSE) ve [GNU lisans metni](https://www.gnu.org/licenses/agpl-3.0.html)
sayfasına bakın.
