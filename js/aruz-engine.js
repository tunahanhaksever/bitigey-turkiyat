/**
 * BİTİGEY TÜRKİYAT — DİJİTAL ARUZ VEZNİ & ŞİİR ÖLÇER MOTORU
 * Dosya: js/aruz-engine.js
 * Klasik Türk Edebiyatı (Divan), Fars ve Arap şiirinde kullanılan Aruz vezinlerini
 * hece hece (açık / kapalı) tahlil eden, medd ve imâle durumlarını hesaplayan bilimsel motor.
 * İletişim: contact@bitigey.com
 */

(function(root) {
    'use strict';

    // Klasik Türk Edebiyatı'nda En Sık Kullanılan 32 Aruz Kalıbı
    var ARUZ_METERS = [
        // Bahr-i Hezec
        { id: 'hezec_1', name: 'Mef‘ûlü Mefâ‘îlün Fe‘ûlün', pattern: '--. / .--- / .--', tefiles: ['Mef‘ûlü', 'Mefâ‘îlün', 'Fe‘ûlün'], bahr: 'Hezec' },
        { id: 'hezec_2', name: 'Mefâ‘îlün Mefâ‘îlün Mefâ‘îlün Mefâ‘îlün', pattern: '.--- / .--- / .--- / .---', tefiles: ['Mefâ‘îlün', 'Mefâ‘îlün', 'Mefâ‘îlün', 'Mefâ‘îlün'], bahr: 'Hezec' },
        { id: 'hezec_3', name: 'Mef‘ûlü Mefâ‘îlü Mefâ‘îlü Fe‘ûlün', pattern: '--. / .--. / .--. / .--', tefiles: ['Mef‘ûlü', 'Mefâ‘îlü', 'Mefâ‘îlü', 'Fe‘ûlün'], bahr: 'Hezec' },
        { id: 'hezec_4', name: 'Mef‘ûlü Mefâ‘îlün Mef‘ûlü Mefâ‘îlün', pattern: '--. / .--- / --. / .---', tefiles: ['Mef‘ûlü', 'Mefâ‘îlün', 'Mef‘ûlü', 'Mefâ‘îlün'], bahr: 'Hezec' },
        { id: 'hezec_5', name: 'Mefâ‘îlün Fe‘ûlün Mefâ‘îlün Fe‘ûlün', pattern: '.--- / .-- / .--- / .--', tefiles: ['Mefâ‘îlün', 'Fe‘ûlün', 'Mefâ‘îlün', 'Fe‘ûlün'], bahr: 'Hezec' },

        // Bahr-i Remel
        { id: 'remel_1', name: 'Fâ‘ilâtün Fâ‘ilâtün Fâ‘ilâtün Fâ‘ilün', pattern: '-.-. / -.-. / -.-. / -.-', tefiles: ['Fâ‘ilâtün', 'Fâ‘ilâtün', 'Fâ‘ilâtün', 'Fâ‘ilün'], bahr: 'Remel' },
        { id: 'remel_2', name: 'Fâ‘ilâtün Fâ‘ilâtün Fâ‘ilün', pattern: '-.-. / -.-. / -.-', tefiles: ['Fâ‘ilâtün', 'Fâ‘ilâtün', 'Fâ‘ilün'], bahr: 'Remel' },
        { id: 'remel_3', name: 'Fe‘ilâtün Fe‘ilâtün Fe‘ilâtün Fe‘ilün', pattern: '..-. / ..-. / ..-. / ..-', tefiles: ['Fe‘ilâtün', 'Fe‘ilâtün', 'Fe‘ilâtün', 'Fe‘ilün'], bahr: 'Remel' },
        { id: 'remel_4', name: 'Fe‘ilâtün Mefâ‘ilün Fe‘ilün', pattern: '..-. / .--. / ..-', tefiles: ['Fe‘ilâtün', 'Mefâ‘ilün', 'Fe‘ilün'], bahr: 'Remel' },

        // Bahr-i Muzâri
        { id: 'muzari_1', name: 'Mef‘ûlü Fâ‘ilâtü Mefâ‘îlü Fâ‘ilün', pattern: '--. / -.-. / .--. / -.-', tefiles: ['Mef‘ûlü', 'Fâ‘ilâtü', 'Mefâ‘îlü', 'Fâ‘ilün'], bahr: 'Muzâri' },
        { id: 'muzari_2', name: 'Mef‘ûlü Fâ‘ilâtün Mef‘ûlü Fâ‘ilâtün', pattern: '--. / -.-. / --. / -.-.', tefiles: ['Mef‘ûlü', 'Fâ‘ilâtün', 'Mef‘ûlü', 'Fâ‘ilâtün'], bahr: 'Muzâri' },

        // Bahr-i Recez
        { id: 'recez_1', name: 'Müstef‘ilün Müstef‘ilün Müstef‘ilün Müstef‘ilün', pattern: '--.- / --.- / --.- / --.-', tefiles: ['Müstef‘ilün', 'Müstef‘ilün', 'Müstef‘ilün', 'Müstef‘ilün'], bahr: 'Recez' },
        { id: 'recez_2', name: 'Müfte‘ilün Mefâ‘ilün Müfte‘ilün Mefâ‘ilün', pattern: '-..- / .--. / -..- / .--.', tefiles: ['Müfte‘ilün', 'Mefâ‘ilün', 'Müfte‘ilün', 'Mefâ‘ilün'], bahr: 'Recez' },

        // Bahr-i Hafîf
        { id: 'hafif_1', name: 'Fâ‘ilâtün Mefâ‘ilün Fe‘ilün', pattern: '-.-. / .--. / ..-', tefiles: ['Fâ‘ilâtün', 'Mefâ‘ilün', 'Fe‘ilün'], bahr: 'Hafîf' },
        { id: 'hafif_2', name: 'Fâ‘ilâtün Mefâ‘ilün Fâ‘ilün', pattern: '-.-. / .--. / -.-', tefiles: ['Fâ‘ilâtün', 'Mefâ‘ilün', 'Fâ‘ilün'], bahr: 'Hafîf' },

        // Bahr-i Müctes
        { id: 'muctes_1', name: 'Mefâ‘ilün Fe‘ilâtün Mefâ‘ilün Fe‘ilün', pattern: '.--. / ..-. / .--. / ..-', tefiles: ['Mefâ‘ilün', 'Fe‘ilâtün', 'Mefâ‘ilün', 'Fe‘ilün'], bahr: 'Müctes' },
        { id: 'muctes_2', name: 'Mefâ‘ilün Fe‘ilâtün Mefâ‘ilün Fa‘lün', pattern: '.--. / ..-. / .--. / --', tefiles: ['Mefâ‘ilün', 'Fe‘ilâtün', 'Mefâ‘ilün', 'Fa‘lün'], bahr: 'Müctes' },

        // Bahr-i Mütekârib (Şehnâme & Kutadgu Bilig Vezni)
        { id: 'mutekarib_1', name: 'Fe‘ûlün Fe‘ûlün Fe‘ûlün Fe‘ûl', pattern: '.-- / .-- / .-- / .-', tefiles: ['Fe‘ûlün', 'Fe‘ûlün', 'Fe‘ûlün', 'Fe‘ûl'], bahr: 'Mütekârib' },
        { id: 'mutekarib_2', name: 'Fe‘ûlün Fe‘ûlün Fe‘ûlün Fe‘ûlün', pattern: '.-- / .-- / .-- / .--', tefiles: ['Fe‘ûlün', 'Fe‘ûlün', 'Fe‘ûlün', 'Fe‘ûlün'], bahr: 'Mütekârib' },

        // Bahr-i Serî
        { id: 'seri_1', name: 'Müfte‘ilün Müfte‘ilün Fâ‘ilün', pattern: '-..- / -..- / -.-', tefiles: ['Müfte‘ilün', 'Müfte‘ilün', 'Fâ‘ilün'], bahr: 'Serî' }
    ];

    var VOWELS = 'aeıioöuüAEIİOÖUÜâîûÂÎÛ';
    var LONG_VOWELS = 'âîûÂÎÛ';

    /**
     * Bir mısrayı hecelerine ve Açık (.) / Kapalı (-) işaretlerine dönüştürür.
     */
    function scanVerseSyllables(line) {
        if (!line) return [];
        var clean = line.trim().replace(/[.,;:!?«»"()\[\]]/g, '');
        var words = clean.split(/\s+/).filter(Boolean);
        var syllables = [];

        words.forEach(function(word, wIdx) {
            var wordSyls = hyphenateWord(word);
            var isLastWordInVerse = (wIdx === words.length - 1);

            wordSyls.forEach(function(syl, sIdx) {
                var isLastSylInWord = (sIdx === wordSyls.length - 1);
                var isLastSylInVerse = isLastWordInVerse && isLastSylInWord;

                var type = '-'; // default kapalı
                var lastChar = syl[syl.length - 1];

                // Eğer son hece mısra sonundaysa kural gereği daima KAPALIDIR (-)
                if (isLastSylInVerse) {
                    type = '-';
                } else if (VOWELS.indexOf(lastChar) !== -1) {
                    // Ünlüyle bitiyor
                    if (LONG_VOWELS.indexOf(lastChar) !== -1) {
                        type = '-'; // Uzun ünlü daima KAPALI (-)
                    } else {
                        // Kısa ünlüyle bitiyor: Eğer sonraki kelime ünlüyle başlıyorsa ulama (vasl) olabilir
                        type = '.'; // AÇIK
                    }
                } else {
                    // Ünsüzle bitiyor: KAPALI (-)
                    type = '-';
                }

                syllables.push({
                    text: syl,
                    type: type,
                    word: word
                });
            });
        });

        return syllables;
    }

    /**
     * Türkçe heceleme kuralı (Vokal merkezli ayrıştırma)
     */
    function hyphenateWord(word) {
        var clean = word.replace(/[-_']/g, '');
        if (!clean) return [word];
        var syls = [];
        var curr = '';

        for (var i = 0; i < clean.length; i++) {
            var ch = clean[i];
            curr += ch;

            if (VOWELS.indexOf(ch) !== -1) {
                // Ünlü bulduk, sonrasına bak
                var next1 = clean[i + 1];
                var next2 = clean[i + 2];

                if (!next1) {
                    // Kelime bitti
                    syls.push(curr);
                    curr = '';
                } else if (VOWELS.indexOf(next1) !== -1) {
                    // Peş peşe iki ünlü (nâ-il, şâ-ir)
                    syls.push(curr);
                    curr = '';
                } else if (next2 && VOWELS.indexOf(next2) !== -1) {
                    // Ünlü + Tek ünsüz + Ünlü (ba-ba, se-vgi)
                    syls.push(curr);
                    curr = '';
                } else if (next2 && VOWELS.indexOf(next2) === -1 && clean[i + 3] && VOWELS.indexOf(clean[i + 3]) !== -1) {
                    // Ünlü + Çift ünsüz + Ünlü (sev-gi, der-gâh)
                    curr += next1;
                    i++;
                    syls.push(curr);
                    curr = '';
                }
            }
        }
        if (curr) {
            if (syls.length > 0) {
                syls[syls.length - 1] += curr;
            } else {
                syls.push(curr);
            }
        }
        return syls.length > 0 ? syls : [word];
    }

    /**
     * Bir mısranın hece yapısını Aruz kalıplarıyla kıyaslar ve en yüksek eşleşmeyi bulur
     */
    function findBestAruzMeter(verseLine) {
        var syllables = scanVerseSyllables(verseLine);
        if (syllables.length === 0) return null;

        var scannedPattern = syllables.map(function(s) { return s.type; }).join('');
        var candidates = [];

        ARUZ_METERS.forEach(function(meter) {
            var rawMeterPattern = meter.pattern.replace(/[\s\/]/g, '');
            var score = 0;
            var maxLen = Math.max(scannedPattern.length, rawMeterPattern.length);
            var minLen = Math.min(scannedPattern.length, rawMeterPattern.length);

            var diffs = [];
            for (var i = 0; i < minLen; i++) {
                if (scannedPattern[i] === rawMeterPattern[i]) {
                    score++;
                } else {
                    diffs.push({
                        index: i,
                        syllable: syllables[i].text,
                        expected: rawMeterPattern[i],
                        found: scannedPattern[i],
                        defect: rawMeterPattern[i] === '-' ? 'İmâle (Uzatma Gerekir)' : 'Zihâf (Kısaltma Gerekir)'
                    });
                }
            }

            // Uzunluk farkı cezası
            var lenPenalty = Math.abs(scannedPattern.length - rawMeterPattern.length) * 1.5;
            var matchPct = Math.max(0, Math.round(((score - lenPenalty) / rawMeterPattern.length) * 100));

            candidates.push({
                meter: meter,
                score: score,
                matchPct: matchPct,
                diffs: diffs,
                expectedLen: rawMeterPattern.length,
                foundLen: scannedPattern.length
            });
        });

        candidates.sort(function(a, b) { return b.matchPct - a.matchPct; });

        return {
            verse: verseLine,
            syllables: syllables,
            scannedPattern: scannedPattern,
            bestMatch: candidates[0],
            topCandidates: candidates.slice(0, 3)
        };
    }

    var AruzEngine = {
        meters: ARUZ_METERS,
        scanVerseSyllables: scanVerseSyllables,
        findBestAruzMeter: findBestAruzMeter,

        /**
         * İki mısralık beyti analiz eder
         */
        analyzeCouplet: function(misra1, misra2) {
            var r1 = findBestAruzMeter(misra1);
            var r2 = misra2 ? findBestAruzMeter(misra2) : null;
            return {
                misra1Result: r1,
                misra2Result: r2,
                bestMeter: r1 ? r1.bestMatch.meter : (r2 ? r2.bestMatch.meter : null)
            };
        }
    };

    root.AruzEngine = AruzEngine;
    if (typeof window !== 'undefined') window.AruzEngine = AruzEngine;
    if (typeof module !== 'undefined' && module.exports) module.exports = AruzEngine;

})(typeof window !== 'undefined' ? window : this);
