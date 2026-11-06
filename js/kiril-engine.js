/**
 * BİTİGEY TÜRKİYAT — ORTA ASYA TÜRK DİLLERİ KİRİL-LATİN ÇEVİRİ MOTORU
 * Dosya: js/kiril-engine.js
 * 
 * Kapsam:
 *  1. Kazak Türkçesi (Қазақ кирилл ⇄ Qazaqşa Latin)
 *  2. Kırgız Türkçesi (Кыргыз кирилл ⇄ Qırğız Latin)
 *  3. Özbek Türkçesi (Ўзбек кирилл ⇄ Oʻzbek Latin)
 *  4. Azerbaycan Türkçesi (Tarihî 1939-1991 Sovyet Kiril ⇄ Müasir Latin)
 *  5. Genel Türkoloji / Ortak Türk Alfabesi Standart Çevirisi
 * 
 * İletişim: contact@bitigey.com
 */

(function (global) {
  'use strict';

  // Standart Slav/Kiril temel tablosu
  const BASE_CYR_TO_LAT = {
    '\u0410': 'A',  '\u0430': 'a',
    '\u0411': 'B',  '\u0431': 'b',
    '\u0412': 'V',  '\u0432': 'v',
    '\u0413': 'G',  '\u0433': 'g',
    '\u0414': 'D',  '\u0434': 'd',
    '\u0415': 'E',  '\u0435': 'e',
    '\u0401': 'Yo', '\u0451': 'yo',
    '\u0416': 'J',  '\u0436': 'j',
    '\u0417': 'Z',  '\u0437': 'z',
    '\u0418': 'İ',  '\u0438': 'i',
    '\u0419': 'Y',  '\u0439': 'y',
    '\u041A': 'K',  '\u043A': 'k',
    '\u041B': 'L',  '\u043B': 'l',
    '\u041C': 'M',  '\u043C': 'm',
    '\u041D': 'N',  '\u043D': 'n',
    '\u041E': 'O',  '\u043E': 'o',
    '\u041F': 'P',  '\u043F': 'p',
    '\u0420': 'R',  '\u0440': 'r',
    '\u0421': 'S',  '\u0441': 's',
    '\u0422': 'T',  '\u0442': 't',
    '\u0423': 'U',  '\u0443': 'u',
    '\u0424': 'F',  '\u0444': 'f',
    '\u0425': 'X',  '\u0445': 'x',
    '\u0426': 'Ts', '\u0446': 'ts',
    '\u0427': 'Ç',  '\u0447': 'ç',
    '\u0428': 'Ş',  '\u0448': 'ş',
    '\u0429': 'Şş', '\u0449': 'şş',
    '\u042A': '',   '\u044A': '',
    '\u042B': 'I',  '\u044B': 'ı',
    '\u042C': '',   '\u044C': '',
    '\u042D': 'E',  '\u044D': 'e',
    '\u042E': 'Yu', '\u044E': 'yu',
    '\u042F': 'Ya', '\u044F': 'ya'
  };

  const BASE_LAT_TO_CYR = {
    'A': '\u0410', 'a': '\u0430',
    'B': '\u0411', 'b': '\u0431',
    'V': '\u0412', 'v': '\u0432',
    'G': '\u0413', 'g': '\u0433',
    'D': '\u0414', 'd': '\u0434',
    'E': '\u0415', 'e': '\u0435',
    'Z': '\u0417', 'z': '\u0437',
    'Y': '\u0419', 'y': '\u0439',
    'K': '\u041A', 'k': '\u043A',
    'L': '\u041B', 'l': '\u043B',
    'M': '\u041C', 'm': '\u043C',
    'N': '\u041D', 'n': '\u043D',
    'O': '\u041E', 'o': '\u043E',
    'P': '\u041F', 'p': '\u043F',
    'R': '\u0420', 'r': '\u0440',
    'S': '\u0421', 's': '\u0441',
    'T': '\u0422', 't': '\u0442',
    'U': '\u0423', 'u': '\u0443',
    'F': '\u0424', 'f': '\u0444',
    'İ': '\u0418', 'i': '\u0438',
    'I': '\u042B', 'ı': '\u044B',
    'J': '\u0416', 'j': '\u0436',
    'Ç': '\u0427', 'ç': '\u0447',
    'Ş': '\u0428', 'ş': '\u0448',
    'X': '\u0425', 'x': '\u0445'
  };

  function buildMap(overridesCyr, overridesLat) {
    const c2l = Object.assign({}, BASE_CYR_TO_LAT, overridesCyr);
    const l2c = Object.assign({}, BASE_LAT_TO_CYR, overridesLat);
    return { c2l, l2c };
  }

  // 1. Kazakça
  const kazakhMaps = buildMap({
    '\u04D8': 'Ä', '\u04D9': 'ä', // Ә, ә
    '\u0492': 'Ğ', '\u0493': 'ğ', // Ғ, ғ
    '\u049A': 'Q', '\u049B': 'q', // Қ, қ
    '\u04A2': 'Ñ', '\u04A3': 'ñ', // Ң, ң
    '\u04E8': 'Ö', '\u04E9': 'ö', // Ө, ө
    '\u04B0': 'U', '\u04B1': 'u', // Ұ, ұ
    '\u04AE': 'Ü', '\u04AF': 'ü', // Ү, ү
    '\u04BA': 'H', '\u04BB': 'h', // Һ, һ
    '\u0406': 'İ', '\u0456': 'i', // І, і
    '\u0423': 'W', '\u0443': 'w', // У, у (Kazakçada ünlü ardında w)
    '\u042B': 'I', '\u044B': 'ı',
    '\u0418': 'İ', '\u0438': 'i'
  }, {
    'Ä': '\u04D8', 'ä': '\u04D9',
    'Ğ': '\u0492', 'ğ': '\u0493',
    'Q': '\u049A', 'q': '\u049B',
    'Ñ': '\u04A2', 'ñ': '\u04A3',
    'Ö': '\u04E8', 'ö': '\u04E9',
    'U': '\u04B0', 'u': '\u04B1',
    'Ü': '\u04AE', 'ü': '\u04AF',
    'H': '\u04BA', 'h': '\u04BB',
    'İ': '\u0406', 'i': '\u0456',
    'I': '\u042B', 'ı': '\u044B',
    'W': '\u0423', 'w': '\u0443'
  });

  // 2. Kırgızca
  const kyrgyzMaps = buildMap({
    '\u04E8': 'Ö', '\u04E9': 'ö',
    '\u04AE': 'Ü', '\u04AF': 'ü',
    '\u04A2': 'Ñ', '\u04A3': 'ñ',
    '\u0416': 'J', '\u0436': 'j'
  }, {
    'Ö': '\u04E8', 'ö': '\u04E9',
    'Ü': '\u04AE', 'ü': '\u04AF',
    'Ñ': '\u04A2', 'ñ': '\u04A3',
    'J': '\u0416', 'j': '\u0436',
    'C': '\u0416', 'c': '\u0436'
  });

  // 3. Özbekçe
  const uzbekMaps = buildMap({
    '\u040E': "Oʻ", '\u045E': "oʻ", // Ў, ў
    '\u0492': "Gʻ", '\u0493': "gʻ", // Ғ, ғ
    '\u049A': 'Q',  '\u049B': 'q',  // Қ, қ
    '\u04B2': 'H',  '\u04B3': 'h',  // Ҳ, ҳ
    '\u0425': 'X',  '\u0445': 'x',  // Х, х
    '\u0418': 'I',  '\u0438': 'i',
    '\u0427': 'Ch', '\u0447': 'ch',
    '\u0428': 'Sh', '\u0448': 'sh',
    '\u042A': "’",  '\u044A': "’"
  }, {
    'Q': '\u049A', 'q': '\u049B',
    'H': '\u04B2', 'h': '\u04B3',
    'X': '\u0425', 'x': '\u0445',
    'I': '\u0418', 'i': '\u0438'
  });

  // 4. Azerbaycan (Sovyet 1939-1991)
  const azerbaijaniMaps = buildMap({
    '\u04D8': 'Ə', '\u04D9': 'ə',
    '\u0492': 'Ğ', '\u0493': 'ğ',
    '\u04F8': 'C', '\u04F9': 'c', // Ҹ, ҹ (Cyrillic capital/small letter che with vertical stroke)
    '\u04B6': 'C', '\u04B7': 'c', // Ҷ, ҷ (Cyrillic che with descender)
    '\u0496': 'C', '\u0497': 'c', // Җ, җ (Cyrillic zhe with descender)
    '\u0427': 'Ç', '\u0447': 'ç',
    '\u0408': 'Y', '\u0458': 'y', // Ј, ј
    '\u0413': 'Q', '\u0433': 'q',
    '\u04BA': 'H', '\u04BB': 'h',
    '\u04E8': 'Ö', '\u04E9': 'ö',
    '\u04AE': 'Ü', '\u04AF': 'ü',
    '\u042B': 'I', '\u044B': 'ı',
    '\u0418': 'İ', '\u0438': 'i'
  }, {
    'Ə': '\u04D8', 'ə': '\u04D9',
    'Ä': '\u04D8', 'ä': '\u04D9',
    'C': '\u04F8', 'c': '\u04F9',
    'Ğ': '\u0492', 'ğ': '\u0493',
    'Q': '\u0413', 'q': '\u0433',
    'Y': '\u0408', 'y': '\u0458',
    'H': '\u04BA', 'h': '\u04BB',
    'Ö': '\u04E8', 'ö': '\u04E9',
    'Ü': '\u04AE', 'ü': '\u04AF',
    'I': '\u042B', 'ı': '\u044B',
    'İ': '\u0418', 'i': '\u0438'
  });

  // 5. Genel Türkoloji
  const turkicMaps = buildMap({
    '\u04D8': 'Ä',  '\u04D9': 'ä',
    '\u0492': 'Ğ',  '\u0493': 'ğ',
    '\u049A': 'Q',  '\u049B': 'q',
    '\u04A2': 'Ñ',  '\u04A3': 'ñ',
    '\u04E8': 'Ö',  '\u04E9': 'ö',
    '\u04AE': 'Ü',  '\u04AF': 'ü',
    '\u04B0': 'U',  '\u04B1': 'u',
    '\u040E': "Oʻ", '\u045E': "oʻ",
    '\u04F8': 'C',  '\u04F9': 'c',
    '\u0496': 'C',  '\u0497': 'c', // Җ, җ
    '\u04BA': 'H',  '\u04BB': 'h',
    '\u0406': 'İ',  '\u0456': 'i',
    '\u042B': 'I',  '\u044B': 'ı'
  }, {
    'Ä': '\u04D8', 'ä': '\u04D9',
    'Ğ': '\u0492', 'ğ': '\u0493',
    'Q': '\u049A', 'q': '\u049B',
    'Ñ': '\u04A2', 'ñ': '\u04A3',
    'Ö': '\u04E8', 'ö': '\u04E9',
    'Ü': '\u04AE', 'ü': '\u04AF',
    'C': '\u0496', 'c': '\u0497',
    'H': '\u04BA', 'h': '\u04BB'
  });

  const KirilEngine = {
    dialects: {
      kazakh: {
        id: 'kazakh',
        name: 'Kazak Türkçesi (Қазақша / Qazaqşa)',
        flag: '🇰🇿',
        desc: 'Kazakistan resmi Kiril alfabesi ile Türkoloji / Yeni Latin standardı.',
        multiLatToCyr: [
          ['Şş', '\u0429'], ['şş', '\u0449'],
          ['Ts', '\u0426'], ['ts', '\u0446'],
          ['Yu', '\u042E'], ['yu', '\u044E'],
          ['Ya', '\u042F'], ['ya', '\u044F'],
          ['Yo', '\u0401'], ['yo', '\u0451']
        ],
        multiCyrToLat: [
          ['\u0429', 'Şş'], ['\u0449', 'şş'],
          ['\u0426', 'Ts'], ['\u0446', 'ts'],
          ['\u042E', 'Yu'], ['\u044E', 'yu'],
          ['\u042F', 'Ya'], ['\u044F', 'ya'],
          ['\u0401', 'Yo'], ['\u0451', 'yo']
        ],
        maps: kazakhMaps,
        sample: {
          title: 'Abay Qunanbayulı — Qara Sözder (1. Söz)',
          cyrillic: 'Бұл жасқа келгенше жақсы өткіздік пе, жаман өткіздік пе, әйтеуір бірталай өмірімізді өткіздік: алыстық, жұлыстық, айтыстық, тартыстық — әурешілікті көре-көре келдік. Енді жер ортасы жасқа келдік: қажыдық, жалықтық; қылып жүрген ісіміздің бәрі баянсыз, байлаусыз екенін көрдік.',
          latin: 'Bwl jasqa kelgenşe jaqsı ötkizdik pe, jaman ötkizdik pe, äytewir birtalay ömirimizdi ötkizdik: alıstıq, julıstıq, aytıstıq, tartıstıq — äwreşilikti köre-köre keldik. Endi jer ortası jasqa keldik: qajıdıq, jalıqtıq; qılıp jürgen isimizdiñ bäri bayansız, baylawsız ekenin kördik.'
        }
      },

      kyrgyz: {
        id: 'kyrgyz',
        name: 'Kırgız Türkçesi (Кыргызча / Qırğızça)',
        flag: '🇰🇬',
        desc: 'Manas Destanı ve Kırgız yazın geleneği Kiril standardı.',
        multiLatToCyr: [
          ['Şş', '\u0429'], ['şş', '\u0449'],
          ['Ts', '\u0426'], ['ts', '\u0446'],
          ['Yu', '\u042E'], ['yu', '\u044E'],
          ['Ya', '\u042F'], ['ya', '\u044F'],
          ['Yo', '\u0401'], ['yo', '\u0451']
        ],
        multiCyrToLat: [
          ['\u0429', 'Şş'], ['\u0449', 'şş'],
          ['\u0426', 'Ts'], ['\u0446', 'ts'],
          ['\u042E', 'Yu'], ['\u044E', 'yu'],
          ['\u042F', 'Ya'], ['\u044F', 'ya'],
          ['\u0401', 'Yo'], ['\u0451', 'yo']
        ],
        maps: kyrgyzMaps,
        sample: {
          title: 'Manas Destanı — Giriş Beyitleri',
          cyrillic: 'Байыркынын баяны, бабалардын аяны. Кара тоо кулап том болду, каргыштуу найза жоо болду. Атадан калган чоң санат, асыл баатыр эр Манас!',
          latin: 'Bayırkının bayanı, babalardın检查ayanı. Kara too kulap tom boldu, kargıştuu nayza joo boldu. Atadan kalgan çoñ sanat, asıl baatır er Manas!'
        }
      },

      uzbek: {
        id: 'uzbek',
        name: 'Özbek Türkçesi (Ўзбекча / Oʻzbekcha)',
        flag: '🇺🇿',
        desc: 'Özbekistan resmi Latin alfabesi (oʻ, gʻ, sh, ch) ile klasik Kiril standardı.',
        multiLatToCyr: [
          ["Oʻ", '\u040E'], ["oʻ", '\u045E'],
          ["O'", '\u040E'], ["o'", '\u045E'],
          ["Gʻ", '\u0492'], ["gʻ", '\u0493'],
          ["G'", '\u0492'], ["g'", '\u0493'],
          ['Sh', '\u0428'], ['sh', '\u0448'],
          ['Ch', '\u0427'], ['ch', '\u0447'],
          ['Ts', '\u0426'], ['ts', '\u0446'],
          ['Yu', '\u042E'], ['yu', '\u044E'],
          ['Ya', '\u042F'], ['ya', '\u044F'],
          ['Yo', '\u0401'], ['yo', '\u0451']
        ],
        multiCyrToLat: [
          ['\u040E', "Oʻ"], ['\u045E', "oʻ"],
          ['\u0492', "Gʻ"], ['\u0493', "gʻ"],
          ['\u0428', 'Sh'],  ['\u0448', 'sh'],
          ['\u0427', 'Ch'],  ['\u0447', 'ch'],
          ['\u0426', 'Ts'],  ['\u0446', 'ts'],
          ['\u042E', 'Yu'],  ['\u044E', 'yu'],
          ['\u042F', 'Ya'],  ['\u044F', 'ya'],
          ['\u0401', 'Yo'],  ['\u0451', 'yo']
        ],
        maps: uzbekMaps,
        sample: {
          title: 'Alisher Navoiy — Hayrat ul-Abror',
          cyrillic: 'Олам аҳли билингизким, иш эмас душманлик, ёр ўлунг бир-бирингизгаким, эрур ёрлиқ иш. Кимки бир кўнгли бузуқнинг хотирини шод айлагай, Тангри ул бандасини икки жаҳонда шод этар.',
          latin: "Olam ahli bilingizkim, ish emas dushmanlik, yor oʻlung bir-biringizgakim, erur yorliq ish. Kimki bir koʻngli buzuqning xotirini shod aylagay, Tangri ul bandasini ikki jahonda shod etar."
        }
      },

      azerbaijani: {
        id: 'azerbaijani',
        name: 'Azerbaycan Türkçesi (Tarihî 1939-1991 Sovyet Kiril)',
        flag: '🇦🇿',
        desc: 'Sovyet dönemi Bakü neşirleri, klasik divanların Kiril baskıları için filolojik çevrim.',
        multiLatToCyr: [],
        multiCyrToLat: [],
        maps: azerbaijaniMaps,
        sample: {
          title: 'Bəxtiyar Vahabzadə — Ana Dili',
          cyrillic: 'Ана дили, ана дили! Бу дил бизим тарихимиз, вүҹудумуз, бу дил бизим бабалардан мирас галан ҝөз нурумуз.',
          latin: 'Ana dili, ana dili! Bu dil bizim tariximiz, vücudumuz, bu dil bizim babalardan miras qalan göz nurumuz.'
        }
      },

      turkic: {
        id: 'turkic',
        name: 'Genel Türkoloji & Türk Dünyası Standart',
        flag: '🏛️',
        desc: 'Ortak Türk Alfabesi (34 harf) ile ortak Kiril neşirleri.',
        multiLatToCyr: [
          ['Ts', '\u0426'], ['ts', '\u0446'],
          ['Yu', '\u042E'], ['yu', '\u044E'],
          ['Ya', '\u042F'], ['ya', '\u044F'],
          ['Yo', '\u0401'], ['yo', '\u0451']
        ],
        multiCyrToLat: [
          ['\u0426', 'Ts'], ['\u0446', 'ts'],
          ['\u042E', 'Yu'], ['\u044E', 'yu'],
          ['\u042F', 'Ya'], ['\u044F', 'ya'],
          ['\u0401', 'Yo'], ['\u0451', 'yo']
        ],
        maps: turkicMaps,
        sample: {
          title: 'Türk Dünyası — Dilde, Fikirde, İşte Birlik',
          cyrillic: 'Тилде, пикирде, иште бирлик! Түрк дүнйәси тарыхтан бүгүнге улу бир медениетиң, ортак тил ве әдебият байлыкларының варисидир.',
          latin: 'Tilde, pikirde, işte birlik! Türk dünyası tarihtan bügünge ulu bir medeniyetiñ, ortak til ve edebiyat baylıklarınıñ varisidir.'
        }
      }
    },

    /**
     * Kiril -> Latin Çeviri
     */
    toLatin: function (text, dialectId) {
      if (!text || typeof text !== 'string') return '';
      const dialect = this.dialects[dialectId] || this.dialects.turkic;

      let result = text;
      // 1. Çoklu harfler
      if (dialect.multiCyrToLat) {
        for (let i = 0; i < dialect.multiCyrToLat.length; i++) {
          const [cyr, lat] = dialect.multiCyrToLat[i];
          result = result.split(cyr).join(lat);
        }
      }

      // 2. Tek harfler
      const map = dialect.maps.c2l;
      let chars = result.split('');
      for (let j = 0; j < chars.length; j++) {
        const c = chars[j];
        if (map[c] !== undefined) {
          chars[j] = map[c];
        }
      }

      return chars.join('');
    },

    /**
     * Latin -> Kiril Çeviri
     */
    toCyrillic: function (text, dialectId) {
      if (!text || typeof text !== 'string') return '';
      const dialect = this.dialects[dialectId] || this.dialects.turkic;

      let result = text;
      // 1. Çoklu harfler
      if (dialect.multiLatToCyr) {
        for (let i = 0; i < dialect.multiLatToCyr.length; i++) {
          const [lat, cyr] = dialect.multiLatToCyr[i];
          result = result.split(lat).join(cyr);
        }
      }

      // 2. Tek harfler
      const map = dialect.maps.l2c;
      let chars = result.split('');
      for (let j = 0; j < chars.length; j++) {
        const c = chars[j];
        if (map[c] !== undefined) {
          chars[j] = map[c];
        }
      }

      return chars.join('');
    },

    detectScript: function (text) {
      if (!text) return 'empty';
      const cyrillicMatch = text.match(/[\u0400-\u04FF]/g);
      const cyrillicCount = cyrillicMatch ? cyrillicMatch.length : 0;
      const latinMatch = text.match(/[A-Za-zÇçĞğİıÖöŞşÜüÄäƏəÑñQqWw]/g);
      const latinCount = latinMatch ? latinMatch.length : 0;

      if (cyrillicCount > latinCount) return 'cyrillic';
      if (latinCount > cyrillicCount) return 'latin';
      return 'mixed';
    },

    detectDialect: function (text) {
      if (!text) return 'turkic';
      if (/[\u040E\u045E\u04B2\u04B3]/i.test(text) || /Oʻ|Gʻ|oʻ|gʻ/.test(text)) return 'uzbek';
      if (/[\u04B0\u04B1\u0406\u0456]/i.test(text)) return 'kazakh';
      if (/[\u04F8\u04F9\u0408\u0458\u018F\u0259]/.test(text)) return 'azerbaijani';
      if (/[\u04AE\u04AF\u04E8\u04E9\u04A2\u04A3]/.test(text)) {
        if (/([а-яА-Я\u0400-\u04FF])\1{1}/.test(text)) return 'kyrgyz';
        return 'kazakh';
      }
      return 'turkic';
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KirilEngine;
  } else {
    global.KirilEngine = KirilEngine;
  }

})(typeof window !== 'undefined' ? window : this);
