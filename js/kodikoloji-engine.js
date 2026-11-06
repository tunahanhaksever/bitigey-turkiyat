/**
 * Bitigey Türkiyat - Kodikoloji & Yazma Eser Tavsif Formu Motoru
 * (c) 2026 Bitigey Dijital Filoloji Laboratuvarı - contact@bitigey.com
 * Bitigey SEO ile Güçlendirilmiştir.
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.KodikolojiEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // Örnek Akademik Yazma Nüsha Şablonları
    const MANUSCRIPT_TEMPLATES = [
        {
            name: "Fuzûlî Dîvânı (Süleymaniye Nüshası - Hâlet Efendi)",
            title: "Dîvân-ı Fuzûlî-i Baġdâdî",
            author: "Muhammed b. Süleymân Fuzûlî (ö. 963/1556)",
            library: "Süleymaniye Yazma Eser Kütüphanesi",
            collection: "Hâlet Efendi Koleksiyonu",
            shelfmark: "No. 684",
            folios: "1b - 114a (114 varak)",
            lines: "15 satır, 2 sütun (manzum gazeliyat ve kasideler)",
            dimensions: "215 x 140 mm (Dış Ebat) / 160 x 85 mm (Yazı Alanı)",
            script: "Nesta'lîk (İnce ve fasih talik hattı)",
            paper: "Açık saman rengi, ince âharlı, mühreli şark kağıdı",
            ink: "İs mürekkebi; gazel ve kaside serlevhaları surh (kırmızı mürekkep) ile yazılmış",
            borders: "Çift surh ve tek zencefre tahrirli altın yaldız cetvel",
            binding: "Vişne çürüğü meşin deri cilt; şemseli, miklepli ve köşebentleri tezhipli",
            colophon: "Ketebehu'l-fakîr Dervîş Mahmûd fî evâsıt-ı şehr-i Rebî'ül-evvel sene 998 (1590)",
            provenance: "Sayfa 1a'da Şeyhülislam Âşir Efendi vakıf mührü ve 'Ketebehu fî mülkihî' temellük kaydı mevcuttur.",
            incipit: "Kad enâra'l-ışku li'l-uşşâkı minhâce'l-hudâ / Sâlik-i râh-ı hakîkat ışka eyler iktidâ",
            explicit: "Yâ Rabb hemişe lutfunı kıl mûnis-i Fuzûlî / Rahmet kapusın aç ana kahr ile kılma dûr"
        },
        {
            name: "Bâkî Dîvânı (Millet Kütüphanesi - Ali Emîrî)",
            title: "Dîvân-ı Bâkî",
            author: "Mahmûd Abdülbâkî (ö. 1008/1600)",
            library: "Millet Yazma Eser Kütüphanesi",
            collection: "Ali Emîrî Manzum Eserler",
            shelfmark: "No. 78",
            folios: "1b - 148b (148 varak)",
            lines: "17 satır, çift sütun",
            dimensions: "200 x 130 mm (Dış Ebat) / 145 x 75 mm (Yazı Alanı)",
            script: "Ta'lîk",
            paper: "İtalyan menşeli filigranlı (çapa armalı) parlak âharlı kağıt",
            ink: "Siyah is mürekkebi, bölüm başları lâciverd ve surh",
            borders: "İki iplik siyah ve altın yaldızlı cetvel",
            binding: "Siyah maroken deri, gömme şemseli, zencirekli klasik Osmanlı cildi",
            colophon: "Hicri 1025 / Miladi 1616 senesinde İstinsah edilmiştir",
            provenance: "Ali Emîrî Efendi'nin kendi el yazısıyla vakıf ve ferağ temellük şerhi",
            incipit: "Ezelden şâh-ı aşkung bende-i fermânıyuz cânâ / Mahabbet mülkinün sultân-ı âlî-şânıyuz cânâ",
            explicit: "Bâkıyâ nazmunı işidüp didi bir nükte-şinâs / Bârekallâh zihî şâ'ir-i pâkîze-edâ"
        }
    ];

    /**
     * Kodikolojik Tavsif Raporu Üretici (Markdown formatı)
     */
    function generateMarkdown(data) {
        return `# KODİKOLOJİK YAZMA ESER TAVSİF RAPORU
**Bitigey Türkiyat Dijital Filoloji İstasyonu**

---

### 1. KİMLİK BİLGİLERİ (IDENTIFICATION)
* **Eser Adı:** ${data.title || '-'}
* **Müellif:** ${data.author || '-'}
* **Kütüphane / Koleksiyon:** ${data.library || '-'} — ${data.collection || '-'}
* **Katalog / Demirbaş No:** ${data.shelfmark || '-'}

---

### 2. MADDİ NİTELİKLER (PHYSICAL CHARACTERISTICS)
* **Varak / Sayfa Sayısı:** ${data.folios || '-'}
* **Satır & Sütun Düzeni:** ${data.lines || '-'}
* **Ölçüler (Ebat):** ${data.dimensions || '-'}
* **Kağıt & Filigran Özellikleri:** ${data.paper || '-'}
* **Cilt & Şemse Tavsifi:** ${data.binding || '-'}

---

### 3. YAZI & TEZYİNAT (PALEOGRAPHY & DECORATION)
* **Hat Türü (Yazı Cinsi):** ${data.script || '-'}
* **Mürekkep Nitelikleri:** ${data.ink || '-'}
* **Cetvel & Tahrir:** ${data.borders || '-'}

---

### 4. TARİHÎ KAYITLAR & ŞERHLER (PARATEXTS)
* **Ferağ / Ketebe Kaydı:** ${data.colophon || '-'}
* **Temellük & Vakıf Mühürleri:** ${data.provenance || '-'}
* **İstihlâl (Eserin Başı):** ${data.incipit || '-'}
* **Hatt-ı Hitâm (Eserin Sonu):** ${data.explicit || '-'}

---
*Tavsif Kaydı: Bitigey SEO Engine & Kodikoloji Tezgahı ile üretilmiştir (contact@bitigey.com).*
`;
    }

    /**
     * Akademik Dipnot (İSNAD 2 / Chicago) Metni Üretici
     */
    function generateCitation(data) {
        const lib = data.library || 'Kütüphane';
        const col = data.collection ? `, ${data.collection}` : '';
        const shelf = data.shelfmark ? `, ${data.shelfmark}` : '';
        const fol = data.folios ? `, vr. ${data.folios}` : '';
        const author = data.author ? `${data.author}, ` : '';
        const title = data.title ? `*${data.title}*` : '*Yazma Eser*';
        
        return `${author}${title}, ${lib}${col}${shelf}${fol}.`;
    }

    /**
     * Word (.doc) Dosyası Olarak Dışa Aktar
     */
    function downloadWordDoc(data, filename) {
        const fname = (filename || 'Bitigey-Kodikoloji-Tavsifi') + '.doc';
        const html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${data.title || 'Kodikoloji Tavsifi'}</title>
            <style>
                body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #111; }
                h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 5px; color: #1a2942; }
                .sub { font-size: 10pt; text-align: center; color: #666; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { border: 1px solid #777; padding: 6px 10px; font-size: 11pt; }
                th { background-color: #f2ede4; text-align: left; width: 28%; font-weight: bold; }
                .section-header { background-color: #1a2942; color: #ffffff; font-weight: bold; font-size: 12pt; }
            </style>
        </head>
        <body>
            <h1>KODİKOLOJİK YAZMA ESER TAVSİF RAPORU</h1>
            <div class='sub'>Bitigey Türkiyat Dijital Filoloji Laboratuvarı | contact@bitigey.com</div>
            <table>
                <tr class='section-header'><td colspan='2'>1. KİMLİK BİLGİLERİ</td></tr>
                <tr><th>Eser Adı</th><td>${data.title || '-'}</td></tr>
                <tr><th>Müellif</th><td>${data.author || '-'}</td></tr>
                <tr><th>Kütüphane & Koleksiyon</th><td>${data.library || '-'} / ${data.collection || '-'}</td></tr>
                <tr><th>Katalog / Demirbaş No</th><td>${data.shelfmark || '-'}</td></tr>

                <tr class='section-header'><td colspan='2'>2. MADDİ VE FİZİKSEL ÖZELLİKLER</td></tr>
                <tr><th>Varak / Sayfa Sayısı</th><td>${data.folios || '-'}</td></tr>
                <tr><th>Satır & Sütun Adedi</th><td>${data.lines || '-'}</td></tr>
                <tr><th>Ölçüler</th><td>${data.dimensions || '-'}</td></tr>
                <tr><th>Kağıt & Filigran</th><td>${data.paper || '-'}</td></tr>
                <tr><th>Cilt Tavsifi</th><td>${data.binding || '-'}</td></tr>

                <tr class='section-header'><td colspan='2'>3. YAZI, MÜREKKEP VE TEZYİNAT</td></tr>
                <tr><th>Hat Türü</th><td>${data.script || '-'}</td></tr>
                <tr><th>Mürekkep</th><td>${data.ink || '-'}</td></tr>
                <tr><th>Cetvel & Süsleme</th><td>${data.borders || '-'}</td></tr>

                <tr class='section-header'><td colspan='2'>4. TARİHÎ KAYITLAR VE PARATEKSTLER</td></tr>
                <tr><th>Ferağ (Ketebe) Kaydı</th><td>${data.colophon || '-'}</td></tr>
                <tr><th>Temellük & Mühürler</th><td>${data.provenance || '-'}</td></tr>
                <tr><th>Eserin Başı (İstihlâl)</th><td>${data.incipit || '-'}</td></tr>
                <tr><th>Eserin Sonu (Hatt-ı Hitâm)</th><td>${data.explicit || '-'}</td></tr>
            </table>
            <p style='margin-top:20px; font-size:10pt; font-style:italic;'>
                Akademik Atıf Formatı: ${generateCitation(data)}
            </p>
        </body>
        </html>
        `;

        const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return {
        getTemplates: function() { return MANUSCRIPT_TEMPLATES; },
        generateMarkdown: generateMarkdown,
        generateCitation: generateCitation,
        downloadWordDoc: downloadWordDoc
    };
}));
