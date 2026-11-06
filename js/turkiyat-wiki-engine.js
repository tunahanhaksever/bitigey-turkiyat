/**
 * BİTİGEY TÜRKİYAT — VİKİPEDİ & AKADEMİK ANSİKLOPEDİ ARAŞTIRMA MOTORU
 * Dosya: js/turkiyat-wiki-engine.js
 * 
 * Özellikler:
 *  - Canlı Türkçe Vikipedi REST API arama ve özet çekimi
 *  - Edebi ve filolojik ana maddeler için çevrimdışı önbellek (Offline Fallback)
 *  - Otomatik akademik kaynakça (TDV İA & APA 7) alıntı kartı üretimi
 *  - TDV İslâm Ansiklopedisi ve TEİS çapraz arama bağlantıları
 * 
 * İletişim: contact@bitigey.com
 */

(function (global) {
  'use strict';

  const WikiEngine = {
    // Çevrimdışı zengin Türkoloji ve Edebiyat ansiklopedi veritabanı
    curatedArticles: {
      'fuzuli': {
        title: 'Fuzûlî (Mehmed bin Süleyman)',
        description: 'XVI. yüzyıl klasik Türk edebiyatının en büyük lirik şairi.',
        extract: 'Fuzûlî (d. 1494, Hille - ö. 1556, Kerbela), Azerbaycan sahası Türk edebiyatının ve klasik divan şiirinin zirve isimlerindendir. Türkçe, Farsça ve Arapça divan kaleme almış; lirik şiirlerinde ilahi ve beşerî aşkı, ıstırabı ve tasavvufi vuslatı işlemiştir. En meşhur eserleri Su Kasîdesi, Leylâ vü Mecnûn mesnevisi, Şikâyetnâme ve Beng ü Bâde’dir.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Fuzuli_Monument_in_Baku.jpg/240px-Fuzuli_Monument_in_Baku.jpg',
        url: 'https://tr.wikipedia.org/wiki/Fuz%C3%BBl%C3%AE',
        tdvUrl: 'https://islamansiklopedisi.org.tr/fuzuli'
      },
      'baki': {
        title: 'Bâkî (Mahmud Abdülbâkî)',
        description: 'Sultânü’ş-Şuarâ unvanlı XVI. yüzyıl Osmanlı divan şairi.',
        extract: 'Bâkî (d. 1526, İstanbul - ö. 1600, İstanbul), Kanûnî Sultan Süleyman devrinin kudretli şairi ve kadıaskeridir. Şiirlerinde dili son derece ahenkli, pürüzsüz ve rindâne bir edayla kullanmış, Kanûnî Mersiyesi ile edebiyatımızın en tesirli mersiyelerinden birini vücuda getirmiştir.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Baki_poet.jpg/220px-Baki_poet.jpg',
        url: 'https://tr.wikipedia.org/wiki/B%C3%A2k%C3%AE',
        tdvUrl: 'https://islamansiklopedisi.org.tr/baki'
      },
      'nedim': {
        title: 'Nedîm (Ahmed Nedîm)',
        description: 'Lâle Devri’nin neşeli, samimi ve İstanbul Türkçesini şiirleştiren şairi.',
        extract: 'Nedîm (d. 1681, İstanbul - ö. 1730, İstanbul), XVIII. yüzyıl klasik edebiyatının mahallîleşme cereyanı öncüsüdür. Şarkı nazım şekline getirdiği taze hava, İstanbul’un köşk ve bahçelerini, Sa’dâbâd eğlencelerini lirik mısralarla ebedileştirmesiyle tanınır.',
        image: '',
        url: 'https://tr.wikipedia.org/wiki/Ned%C3%AEm',
        tdvUrl: 'https://islamansiklopedisi.org.tr/nedim'
      },
      'seyh-galib': {
        title: 'Şeyh Gâlib (Mehmed Esad)',
        description: 'Sebk-i Hindî üslubunun büyük üstadı, Galata Mevlevîhânesi şeyhi.',
        extract: 'Şeyh Gâlib (d. 1757, İstanbul - ö. 1799, İstanbul), Divan şiirinin son büyük klasiğidir. Genç yaşta tertip ettiği Divan’ı ve alegorik tasavvufi başyapıtı Hüsn ü Aşk mesnevisiyle imge zenginliği ve musiki derinliğinde zirveye ulaşmıştır.',
        image: '',
        url: 'https://tr.wikipedia.org/wiki/%C5%9Eeyh_G%C3%A2lib',
        tdvUrl: 'https://islamansiklopedisi.org.tr/seyh-galib'
      },
      'ali-sir-nevai': {
        title: 'Ali Şîr Nevâî (Nizâmeddin Mir Alî Şîr)',
        description: 'Çağatay edebiyatının kurucusu ve Türk dilinin büyük savunucusu.',
        extract: 'Ali Şîr Nevâî (d. 1441, Herat - ö. 1501, Herat), Türkçenin Farsça kadar zengin, musikiye ve edebiyata elverişli bir dil olduğunu Muhâkemetü’l-Lugateyn adlı eseriyle ispatlayan dahi vezir, şair ve tezkirecidir. Hamse sahibi ilk Türk şairidir.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Ali-Shir_Nava%27i_portrait.jpg/240px-Ali-Shir_Nava%27i_portrait.jpg',
        url: 'https://tr.wikipedia.org/wiki/Ali_%C5%9E%C3%AEr_Nev%C3%A2%C3%AE',
        tdvUrl: 'https://islamansiklopedisi.org.tr/ali-sir-nevai'
      },
      'orhun-yazitlari': {
        title: 'Orhun Yazıtları (Göktürk Kitabeleri)',
        description: 'Türk dilinin, tarihinin ve edebiyatının bilinen ilk yazılı anıtları.',
        extract: 'Orhun Yazıtları (VIII. yüzyıl), Moğolistan’daki Orhun Vadisi’nde Bilge Kağan, Kül Tigin ve Tonyukuk adına dikilmiş bengü taşlardır. Türk milletinin devlet anlayışını, bağımsızlık mücadelesini ve hitabet sanatını Orhun alfabesiyle taşa kazımıştır.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Orkhon_inscriptions.jpg/240px-Orkhon_inscriptions.jpg',
        url: 'https://tr.wikipedia.org/wiki/Orhun_Yaz%C4%B1tlar%C4%B1',
        tdvUrl: 'https://islamansiklopedisi.org.tr/orhun-abideleri'
      },
      'divanu-lugatit-turk': {
        title: 'Dîvânu Lugâti’t-Türk',
        description: 'Kaşgarlı Mahmud tarafından yazılan ilk Türk dili sözlüğü ve ansiklopedisi.',
        extract: 'Kaşgarlı Mahmud’un 1072-1074 yıllarında Bağdat’ta Abbâsî halifesine sunduğu eser; Türk boylarının dillerini, atasözlerini, şiirlerini, coğrafyasını ve dünya haritasını ihtiva eden emsalsiz bir abidevi kaynaktır. Tek el yazma nüshası Millet Kütüphanesi’ndedir.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Divanu_Lugatit_Turk.jpg/240px-Divanu_Lugatit_Turk.jpg',
        url: 'https://tr.wikipedia.org/wiki/D%C3%AEv%C3%A2nu_Lug%C3%A2ti%27t-T%C3%BCrk',
        tdvUrl: 'https://islamansiklopedisi.org.tr/divanu-lugatit-turk'
      },
      'kutadgu-bilig': {
        title: 'Kutadgu Bilig (Mutluluk Veren Bilgi)',
        description: 'Yusuf Has Hâcib tarafından 1069’da Karahanlı Türkçesiyle yazılan siyasetnâme.',
        extract: 'Kutadgu Bilig, İslâmî dönem Türk edebiyatının ilk mesnevisi ve aruz vezniyle (Feûlün feûlün feûlün feûl) yazılmış ilk manzum eseridir. Adalet (Kün Togdı), Saadet (Ay Toldı), Akıl (Ögdülmiş) ve Akıbeti (Odgurmış) temsil eden dört sembolik şahsiyet üzerinden devlet idaresini anlatır.',
        image: '',
        url: 'https://tr.wikipedia.org/wiki/Kutadgu_Bilig',
        tdvUrl: 'https://islamansiklopedisi.org.tr/kutadgu-bilig'
      },
      'edisyon-kritik': {
        title: 'Edisyon Kritik (Metin Tenkidi / Textual Criticism)',
        description: 'El yazması eserlerin nüshalarını karşılaştırarak müellif nüshasına en yakın metni kurma ilmi.',
        extract: 'Edisyon kritik, bir eserin günümüze ulaşan farklı yazma veya matbu nüshalarının satır satır karşılaştırılması (kolasyon), farkların (varyant) tespit edilmesi ve sayfa altında eleştirel aparat (apparatus criticus) ile kaydedilerek bilimsel neşir haline getirilmesi yöntemidir.',
        image: '',
        url: 'https://tr.wikipedia.org/wiki/Metin_ele%C5%9Ftirisi',
        tdvUrl: 'https://islamansiklopedisi.org.tr/tashih'
      },
      'aruz-vezni': {
        title: 'Aruz Vezni (İlm-i Arûz)',
        description: 'Arap, Fars ve Türk klasik edebiyatlarında hecelerin uzunluk ve kısalığına dayanan şiir ölçüsü.',
        extract: 'Aruz ölçüsü, hecelerin açık (kısa / .) ve kapalı (uzun / -) oluşları esasına dayanır. Hezec, Remel, Recez, Muzâri, Hafîf gibi bahr adı verilen kalıplar üzerine bina edilmiştir. Türk edebiyatına XI. yüzyılda Kutadgu Bilig ile girmiş ve Divan şiirinin temel ölçüsü olmuştur.',
        image: '',
        url: 'https://tr.wikipedia.org/wiki/Aruz_%C3%B6l%C3%A7%C3%BCs%C3%BC',
        tdvUrl: 'https://islamansiklopedisi.org.tr/aruz'
      }
    },

    /**
     * Vikipedi REST API üzerinden Canlı Madde Özetini Çeker
     * @param {string} query - Aranacak konu başlığı
     * @returns {Promise<Object>}
     */
    fetchArticle: async function (query) {
      if (!query || !query.trim()) {
        throw new Error('Arama terimi boş olamaz.');
      }

      const cleanQuery = query.trim();
      const normalizedKey = cleanQuery
        .toLowerCase()
        .replace(/[âîû]/g, m => ({ 'â': 'a', 'î': 'i', 'û': 'u' })[m] || m)
        .replace(/[^a-z0-9]/g, '-');

      // 1. Önce yerel zengin Türkoloji hafızasına bak
      for (const k in this.curatedArticles) {
        if (normalizedKey.includes(k) || k.includes(normalizedKey)) {
          return Object.assign({ source: 'curated' }, this.curatedArticles[k]);
        }
      }

      // 2. Canlı Wikipedia REST API sorgula
      try {
        const summaryUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
        const res = await fetch(summaryUrl);
        if (res.ok) {
          const data = await res.json();
          return {
            source: 'wikipedia_live',
            title: data.title,
            description: data.description || 'Vikipedi Maddesi',
            extract: data.extract,
            image: data.thumbnail ? data.thumbnail.source : '',
            url: data.content_urls ? data.content_urls.desktop.page : `https://tr.wikipedia.org/wiki/${encodeURIComponent(cleanQuery)}`,
            tdvUrl: `https://islamansiklopedisi.org.tr/arama/?q=${encodeURIComponent(cleanQuery)}`
          };
        }
      } catch (e) {
        console.warn('Wikipedia API summary direct query error, falling back to search API:', e);
      }

      // 3. Arama API üzerinden en yakın başlığı bul
      try {
        const searchUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&utf8=&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
            const firstResult = searchData.query.search[0];
            const cleanSnippet = firstResult.snippet.replace(/<\/?[^>]+(>|$)/g, '');
            return {
              source: 'wikipedia_search',
              title: firstResult.title,
              description: 'Vikipedi Arama Sonucu',
              extract: cleanSnippet + '...',
              image: '',
              url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`,
              tdvUrl: `https://islamansiklopedisi.org.tr/arama/?q=${encodeURIComponent(firstResult.title)}`
            };
          }
        }
      } catch (err) {
        console.error('Wikipedia Search API failed:', err);
      }

      // 4. Bulunamadıysa jenerik araştırma kartı döndür
      return {
        source: 'external_portal',
        title: cleanQuery,
        description: 'Akademik Portallarda Araştırma',
        extract: `"${cleanQuery}" konusu için anlık özet alınamadı. Aşağıdaki doğrudan bağlantıları kullanarak TDV İslâm Ansiklopedisi, Vikipedi ve TEİS kütüphanelerinde arama yapabilirsiniz.`,
        image: '',
        url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(cleanQuery)}`,
        tdvUrl: `https://islamansiklopedisi.org.tr/arama/?q=${encodeURIComponent(cleanQuery)}`
      };
    },

    /**
     * Akademik Kaynakça Atıf Metni Üretici
     */
    generateCitation: function (article) {
      const year = new Date().getFullYear();
      return {
        tdv: `"${article.title}", TDV İslâm Ansiklopedisi / Vikipedi Araştırma İstasyonu, Erişim Tarihi: ${new Date().toLocaleDateString('tr-TR')}, ${article.url}`,
        apa: `Vikipedi Katkıcıları. (${year}). ${article.title}. Bitigey Türkiyat Dijital Araştırma İstasyonu. Alındığı adres: ${article.url}`
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WikiEngine;
  } else {
    global.WikiEngine = WikiEngine;
  }

})(typeof window !== 'undefined' ? window : this);
