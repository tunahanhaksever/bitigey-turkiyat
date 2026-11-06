/**
 * Bitigey Türkiyat - Ebced Hesabı & Tarih Düşürme Çözücü Motoru
 * (c) 2026 Bitigey Dijital Filoloji Laboratuvarı - contact@bitigey.com
 * Bitigey SEO ile Güçlendirilmiştir.
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EbcedEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // Ebced-i Kebîr Standart Tablosu (Arapça / Osmanlıca Harfler)
    const ARABIC_EBCED_MAP = {
        'ا': 1, 'آ': 1, 'أ': 1, 'إ': 1, 'ء': 1,
        'ب': 2, 'پ': 2, // Pe harfi be gibi 2 kabul edilir
        'ج': 3, 'چ': 3, // Çim harfi cim gibi 3 kabul edilir
        'د': 4,
        'ه': 5,
        'و': 6, 'ؤ': 6,
        'ز': 7, 'ژ': 7, // Je harfi ze gibi 7 kabul edilir
        'ح': 8,
        'ط': 9,
        'ى': 10, 'ي': 10, 'ی': 10, 'ئ': 10, // Ye varyantları
        'ك': 20, 'ک': 20, 'گ': 20, 'ڭ': 20, // Kef, gef, nef harfleri 20 kabul edilir
        'ل': 30,
        'م': 40,
        'ن': 50,
        'س': 60,
        'ع': 70,
        'ف': 80,
        'ص': 90,
        'ق': 100,
        'ر': 200,
        'ش': 300,
        'ت': 400, 'ة': 400, // Tâ-i merbûta Osmanlı tarih düşürme geleneğinde te (400) sayılır
        'ث': 500,
        'خ': 600,
        'ذ': 700,
        'ض': 800,
        'ظ': 900,
        'غ': 1000
    };

    // Latin / Transkripsiyon Harfleri Ebced Karşılıkları
    const LATIN_EBCED_RULES = [
        { patterns: [/gay[ıi]n/gi, /ġ/gi, /gh/gi], value: 1000, char: 'غ (Ġayn)' },
        { patterns: [/z[ıi]/gi, /ẓ/gi], value: 900, char: 'ظ (Ẓı)' },
        { patterns: [/d[âa]d/gi, /ż/gi, /ḍ/gi], value: 800, char: 'ض (Żâd)' },
        { patterns: [/z[âa]l/gi, /ẕ/gi, /dh/gi], value: 700, char: 'ذ (Ẕâl)' },
        { patterns: [/h[ıi]/gi, /ḫ/gi, /kh/gi], value: 600, char: 'خ (Ḫı)' },
        { patterns: [/s[âa]/gi, /s\xcc\xa7/gi, /ṯ/gi, /th/gi], value: 500, char: 'ث (Ṯe)' },
        { patterns: [/t[ae]/gi, /t/gi], value: 400, char: 'ت (Te)' },
        { patterns: [/ş/gi, /sh/gi, /š/gi], value: 300, char: 'ش (Şın)' },
        { patterns: [/r[ae]/gi, /r/gi], value: 200, char: 'ر (Rı)' },
        { patterns: [/ḳ/gi, /q/gi], value: 100, char: 'ق (Ḳaf)' },
        { patterns: [/ṣ/gi], value: 90, char: 'ص (Ṣad)' },
        { patterns: [/f[ae]/gi, /f/gi], value: 80, char: 'ف (Fe)' },
        { patterns: [/ʿ/gi, /'/gi, /ayn/gi], value: 70, char: 'ع (ʿAyn)' },
        { patterns: [/s[ıi]/gi, /s/gi], value: 60, char: 'س (Sin)' },
        { patterns: [/n[uü]/gi, /n/gi], value: 50, char: 'ن (Nun)' },
        { patterns: [/m[ie]/gi, /m/gi], value: 40, char: 'م (Mim)' },
        { patterns: [/l[ae]/gi, /l/gi], value: 30, char: 'ل (Lam)' },
        { patterns: [/k/gi, /g/gi, /ñ/gi, /ŋ/gi], value: 20, char: 'ك (Kef/Gef)' },
        { patterns: [/y/gi, /î/gi, /i/gi, /ı/gi], value: 10, char: 'ى (Ye)' },
        { patterns: [/ṭ/gi], value: 9, char: 'ط (Ṭı)' },
        { patterns: [/ḥ/gi], value: 8, char: 'ح (Ḥa)' },
        { patterns: [/z/gi, /j/gi], value: 7, char: 'ز (Ze)' },
        { patterns: [/v/gi, /w/gi, /û/gi, /u/gi, /ü/gi, /o/gi, /ö/gi], value: 6, char: 'و (Vav)' },
        { patterns: [/h/gi], value: 5, char: 'ه (He)' },
        { patterns: [/d/gi], value: 4, char: 'د (Dal)' },
        { patterns: [/c/gi, /ç/gi], value: 3, char: 'ج (Cim/Çim)' },
        { patterns: [/b/gi, /p/gi], value: 2, char: 'ب (Be/Pe)' },
        { patterns: [/a/gi, /e/gi, /â/gi, /ā/gi, /ʾ/gi], value: 1, char: 'ا (Elif)' }
    ];

    // Klasik Tarih Düşürme Örnekleri
    const CLASSICAL_CHRONOGRAMS = [
        {
            title: "İstanbul'un Fethine Düşürülen Meşhur Ayet Tarihi (H. 857 / M. 1453)",
            poet: "Molla Câmî / Akşemseddin Çevresi",
            misra: "Beldetün Tayyibetün",
            arabic: "بلدة طيبة",
            yearHijri: 857,
            yearMiladi: 1453,
            explanation: "Sebe Suresi 15. ayetindeki 'Beldetün tayyibetün' (Güzel ve pak bir belde) ibaresinin ebced karşılığı tam olarak Fatih Sultan Mehmed'in fethettiği Hicri 857 (Miladi 1453) yılıdır."
        },
        {
            title: "Mostar Köprüsü'nün İnşası (H. 974 / M. 1566)",
            poet: "Derviş Paşa",
            misra: "Kudret Kemeri",
            arabic: "قدرت كمری",
            yearHijri: 974,
            yearMiladi: 1566,
            explanation: "Mimar Sinan'ın talebesi Mimar Hayreddin'in Bosna'da inşa ettiği abidevi köprünün tamamlanma tarihini verir."
        },
        {
            title: "Sultan I. Mahmud Vefat Tarihi (H. 1168 / M. 1754)",
            poet: "Koca Râgıb Paşa",
            misra: "Cennet-i a'lâ makâm ede Hudâ Mahmud Han'a",
            arabic: "جنت اعلا مقام ايده خدا محمود خانه",
            yearHijri: 1168,
            yearMiladi: 1754,
            explanation: "Koca Râgıb Paşa'nın Sultan Mahmud için düşürdüğü tâm (eksiksiz) tarih manzumesidir."
        },
        {
            title: "Süleymaniye Camii Tamamlanma Tarihi (H. 964 / M. 1557)",
            poet: "Dâ'î",
            misra: "Târîh-i itmâm-ı bünyân-ı Süleymân",
            arabic: "تاریخ اتمام بنیان سلیمان",
            yearHijri: 964,
            yearMiladi: 1557,
            explanation: "Mimar Sinan'ın başyapıtı Süleymaniye Camii'nin ibadete açılış tarihini gösterir."
        }
    ];

    function isArabicText(text) {
        return /[\u0600-\u06FF]/.test(text);
    }

    function hijriToMiladi(h) {
        if (!h || h <= 0) return null;
        const m = Math.round(h - (h / 33) + 622);
        return m;
    }

    function miladiToHijri(m) {
        if (!m || m <= 622) return null;
        const h = Math.round(((m - 622) * 33) / 32);
        return h;
    }

    function calculateArabicEbced(str) {
        let total = 0;
        const breakdown = [];
        const words = str.trim().split(/\s+/);

        words.forEach(w => {
            let wordTotal = 0;
            const letters = [];
            for (let char of w) {
                if (ARABIC_EBCED_MAP[char]) {
                    const val = ARABIC_EBCED_MAP[char];
                    wordTotal += val;
                    total += val;
                    letters.push({ char, val });
                }
            }
            if (letters.length > 0) {
                breakdown.push({
                    word: w,
                    letters: letters,
                    wordTotal: wordTotal
                });
            }
        });

        return {
            originalText: str,
            total: total,
            yearMiladi: hijriToMiladi(total),
            breakdown: breakdown,
            script: 'arabic'
        };
    }

    function calculateLatinEbced(str) {
        let total = 0;
        const breakdown = [];
        const words = str.trim().split(/\s+/);

        words.forEach(rawWord => {
            let cleanWord = rawWord.toLowerCase().replace(/[^a-zıiüöçşğâîûʿʾṭḍṣẓḫġḳḥẕṯ]/gi, '');
            if (!cleanWord) return;

            let wordTotal = 0;
            const letters = [];
            let i = 0;
            while (i < cleanWord.length) {
                let matched = false;
                for (let rule of LATIN_EBCED_RULES) {
                    for (let pat of rule.patterns) {
                        pat.lastIndex = 0;
                        const sub = cleanWord.substring(i);
                        const match = pat.exec(sub);
                        if (match && match.index === 0) {
                            const matchStr = match[0];
                            letters.push({
                                char: matchStr,
                                val: rule.value,
                                label: rule.char
                            });
                            wordTotal += rule.value;
                            total += rule.value;
                            i += matchStr.length;
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }
                if (!matched) {
                    i++;
                }
            }

            if (letters.length > 0) {
                breakdown.push({
                    word: rawWord,
                    letters: letters,
                    wordTotal: wordTotal
                });
            }
        });

        return {
            originalText: str,
            total: total,
            yearMiladi: hijriToMiladi(total),
            breakdown: breakdown,
            script: 'latin'
        };
    }

    function calculate(text) {
        if (!text || !text.trim()) {
            return { total: 0, yearMiladi: null, breakdown: [], originalText: '' };
        }
        if (isArabicText(text)) {
            return calculateArabicEbced(text);
        } else {
            return calculateLatinEbced(text);
        }
    }

    return {
        calculate: calculate,
        isArabicText: isArabicText,
        hijriToMiladi: hijriToMiladi,
        miladiToHijri: miladiToHijri,
        getExamples: function() { return CLASSICAL_CHRONOGRAMS; },
        ARABIC_EBCED_MAP: ARABIC_EBCED_MAP
    };
}));
