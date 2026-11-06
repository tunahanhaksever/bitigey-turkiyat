/**
 * BİTİGEY — DİJİTAL FİLOLOJİ & EDİSYON KRİTİK MOTORU (js/edisyon-kritik-engine.js)
 * Türk Dili ve Edebiyatı (TDE) ve Tarih Lisansüstü Tezleri ve Akademik Metin Neşirleri İçin
 * Çoklu Nüsha Kolasyon, Varyant Tespiti, Otomatik Aparat (Apparatus Criticus) ve TEI-XML Üreticisi.
 *
 * Standartlar: TDV İslâm Ansiklopedisi (İA), TÜBA ve YÖK Edisyon Kritik Kılavuzu uyumlu.
 * İletişim: contact@bitigey.com
 */

(function(root) {
    'use strict';

    // 1. HAZIR KLASİK EDEBÎ VE METİN NEŞRİ ÖRNEKLERİ (DEMO PROJELERİ)
    var PRESET_PROJECTS = {
        fuzuli_su: {
            title: "Fuzûlî — Su Kasidesi (Nüsha Farkları Tahlili)",
            author: "Fuzûlî (XVI. Yüzyıl)",
            baseWitness: "A: Süleymaniye Ktp. Fatih Nu. 3794 (Esas Nüsha)",
            witnessBName: "B: Millet Ktp. Ali Emîrî Nu. 345",
            witnessCName: "C: İstanbul Üniv. Nadir Eserler Nu. 2872",
            notes: "Fuzûlî Divanı'nın en meşhur kasidesi. Nüshalar arasındaki imla ve kelime tasarrufları.",
            textA: "Saçma ey göz eşkden gönlümdeki odlara su\nKim bu denli tutuşan odlara kılmaz çâre su\n\nÂb-gûndur günbed-i devvâr rengi bilmezem\nYâ muhît olmuş gözümden günbed-i devvâra su\n\nZevk-ı tîğından aceb yok olsa dil çâk-i girîbân\nÂb-revân eyler hemişe gül-fem-i gül-zâra su",
            textB: "Saçma ey dil eşkden bağrımdaki odlara su\nKim bu denli tutuşan odlara kılmaz çâre su\n\nÂb-gûndur günbed-i devvâr rengi bilmezem\nYâ muhît olmuş dökülen yaş ile devvâra su\n\nZevk-ı tîğından aceb yok olsa dil çâk-i girîbân\nÂb-revân eyler hemişe gül-şen-i gül-zâra su",
            textC: "Saçma ey göz yaş ile gönlümdeki odlara su\nKim bu resme tutuşan odlara kılmaz çâre su\n\nÂb-gûndur günbed-i eflâk rengi bilmezem\nYâ muhît olmuş gözümden günbed-i devvâra su\n\nZevk-ı tîğından aceb yok olsa dil çâk-i girîbân\nÂb-revân eyler hemişe gül-ruhsâr-ı zâra su"
        },
        baki_gazel: {
            title: "Bâkî — 'Âvâzeyi Bu Âleme Dâvûd Gibi Sal' Gazeli",
            author: "Bâkî (Sultânü'ş-Şuarâ, XVI. Yüzyıl)",
            baseWitness: "A: Nuruosmaniye Ktp. Nu. 3811 (Esas Nüsha)",
            witnessBName: "B: Süleymaniye Ayasofya Nu. 3892",
            witnessCName: "C: Viyana Millî Ktp. Mxt. 412",
            notes: "Bâkî'nin şairlik kudretini ve ebedi ses mefhumunu vurguladığı ünlü gazeli.",
            textA: "Bâkî çemende hayli perîşân imiş varak\nBenzer ki bir kitâb-ı perîşândır bu bâğ\n\nMinnet Hudâ'ya devlet-i dünyâ fenâ bulur\nBâkî kalır sahîfe-i âlemde âdımız\n\nÂvâzeyi bu âleme Dâvûd gibi sal\nBâkî kalan bu kubbede bir hoş sadâ imiş",
            textB: "Bâkî çemende hayli perîşân imiş gazel\nBenzer ki bir sahîfe-i pür-düzddür bu bâğ\n\nŞükr-i Hudâ'ya câh-ı cihân bî-bekâ bulur\nBâkî kalır cerîde-i âlemde âdımız\n\nÂvâzeyi bu âleme Dâvûd gibi sal\nBâkî kalan bu kubbede bir hoş sadâ imiş",
            textC: "Bâkî çemende hayli perîşân imiş varak\nBenzer ki bir kitâb-ı perîşândır bu bâğ\n\nMinnet Hudâ'ya devlet-i dünyâ fenâ bulur\nBâkî kalır sahîfe-i dilde bu nâmımız\n\nÂvâzeyi bu dehre melekler gibi duyur\nBâkî kalan bu kubbede bir hoş sadâ imiş"
        },
        dede_korkut: {
            title: "Dede Korkut Kitabı — Salur Kazan'ın Evinin Yağmalanması",
            author: "Anonim / Dede Korkut Sözlü Geleneği",
            baseWitness: "D: Dresden Kraliyet Ktp. (Esas Nüsha)",
            witnessBName: "V: Vatikan Ktp. Borg. Turc. 102",
            witnessCName: "G: Türkistan Günbed Nüshası",
            notes: "Dede Korkut destanlarının üç ana yazma nüshasındaki mukayeseli varyant tabakası.",
            textA: "Ulaş oğlu Salur Kazan yerinden örü durmuş idi\nKara yerin üstüne ağ ban evler dikdirmiş idi\nBin yerde ipek halıcalar döşetmiş idi\nDoksan tümende çadırlar dikilmiş idi",
            textB: "Ulaş oğlu Kazan Han yatağından örü durmuş idi\nKara yerin yüzüne ak otağlar kurdurmuş idi\nBin yerde halıcalar serdirmiş idi\nDoksan tümen alaca çadırlar kurulmuş idi",
            textC: "Ulaş oğlu Salur Kazan yerinden kalkmış idi\nKara toprağın üstüne ak evler diktirmiş idi\nBin yerde ipek halılar döşenmiş idi\nYetmiş tümen çadırlar kurulmuş idi"
        }
    };

    // 2. KELİME AYRIŞTIRICI & NORMALİZASYON MOTORU
    // Osmanlıca izafet tirelerini (-i, -ı, -ü, -e), Arapça tenvin ve kesmeleri korur
    function tokenizeVerse(line) {
        if (!line) return [];
        // Noktalama işaretlerini kelimeden nazikçe ayır ama izafet tirelerini koru
        var rawTokens = line.trim().split(/\s+/);
        var tokens = [];

        rawTokens.forEach(function(token) {
            // Baş ve sondaki tırnak/parantez/noktaları ayıkla
            var leadingPunct = '';
            var trailingPunct = '';
            var cleanWord = token;

            var startMatch = cleanWord.match(/^[«"'({\[]+/);
            if (startMatch) {
                leadingPunct = startMatch[0];
                cleanWord = cleanWord.slice(leadingPunct.length);
            }

            var endMatch = cleanWord.match(/[,.;:!?"')}\]]+$/);
            if (endMatch) {
                trailingPunct = endMatch[0];
                cleanWord = cleanWord.slice(0, -trailingPunct.length);
            }

            if (cleanWord.length > 0) {
                tokens.push({
                    raw: token,
                    word: cleanWord,
                    leading: leadingPunct,
                    trailing: trailingPunct,
                    norm: cleanWord.toLowerCase()
                        .replace(/[âā]/g, 'a')
                        .replace(/[îī]/g, 'i')
                        .replace(/[ûū]/g, 'u')
                        .replace(/[ḫhḥ]/g, 'h')
                        .replace(/[ġg]/g, 'g')
                        .replace(/[ṣsşs̱]/g, 's')
                        .replace(/[żzẓẕ]/g, 'z')
                        .replace(/[ṭt]/g, 't')
                        .replace(/[ḳk]/g, 'k')
                        .replace(/[ʿʾ']/g, '')
                });
            }
        });

        return tokens;
    }

    // 3. İKİ DİZE ARASINDAKİ ASGARİ DİFF / KOLASYON ALGORİTMASI (Levenshtein / LCS Tabanlı)
    function alignTokens(baseTokens, witTokens) {
        var dp = [];
        var m = baseTokens.length;
        var n = witTokens.length;

        for (var i = 0; i <= m; i++) {
            dp[i] = [];
            for (var j = 0; j <= n; j++) {
                if (i === 0) dp[i][j] = j;
                else if (j === 0) dp[i][j] = i;
                else {
                    var cost = (baseTokens[i - 1].word.toLowerCase() === witTokens[j - 1].word.toLowerCase()) ? 0 : 1;
                    // Eğer normalize halleri tamamen aynıysa (sadece şapka farkı) maliyet 0.5
                    if (cost !== 0 && baseTokens[i - 1].norm === witTokens[j - 1].norm) {
                        cost = 0.4;
                    }
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,       // Omission (Esasta var, tanıkta yok)
                        dp[i][j - 1] + 1,       // Addition (Tanıkta eklenmiş)
                        dp[i - 1][j - 1] + cost // Match or Substitution
                    );
                }
            }
        }

        // Backtrack
        var alignments = [];
        var ci = m;
        var cj = n;

        while (ci > 0 || cj > 0) {
            if (ci > 0 && cj > 0) {
                var isMatch = baseTokens[ci - 1].word.toLowerCase() === witTokens[cj - 1].word.toLowerCase();
                var cost = isMatch ? 0 : ((baseTokens[ci - 1].norm === witTokens[cj - 1].norm) ? 0.4 : 1);
                if (dp[ci][cj] === dp[ci - 1][cj - 1] + cost) {
                    alignments.unshift({
                        type: isMatch ? 'equal' : 'subst',
                        base: baseTokens[ci - 1],
                        wit: witTokens[cj - 1]
                    });
                    ci--;
                    cj--;
                    continue;
                }
            }
            if (cj > 0 && dp[ci][cj] === dp[ci][cj - 1] + 1) {
                alignments.unshift({
                    type: 'add',
                    base: null,
                    wit: witTokens[cj - 1]
                });
                cj--;
            } else if (ci > 0 && dp[ci][cj] === dp[ci - 1][cj] + 1) {
                alignments.unshift({
                    type: 'omit',
                    base: baseTokens[ci - 1],
                    wit: null
                });
                ci--;
            }
        }

        return alignments;
    }

    // 4. BİTİGEY EDİSYON KRİTİK ANA NESNESİ
    var EdisyonKritikEngine = {
        presets: PRESET_PROJECTS,

        currentProject: {
            title: '',
            author: '',
            baseWitness: 'A (Esas Nüsha)',
            witnessBName: 'B Nüshası',
            witnessCName: 'C Nüshası',
            witnessDName: 'D Nüshası',
            activeWitnessCount: 3,
            notes: ''
        },

        collationResult: null,

        /**
         * Nüshaları Kolasyon Eder ve Aparatı Üretir
         */
        collateWitnesses: function(textA, textB, textC, textD) {
            var linesA = (textA || '').split('\n');
            var linesB = (textB || '').split('\n');
            var linesC = (textC || '').split('\n');
            var linesD = (textD || '').split('\n');

            var maxLines = Math.max(linesA.length, linesB.length, linesC.length, linesD.length);
            var verses = [];
            var apparatusNotes = [];
            var variantStats = {
                totalWords: 0,
                totalVariants: 0,
                substitutions: 0,
                omissions: 0,
                additions: 0,
                witBAgreement: 0,
                witCAgreement: 0,
                witDAgreement: 0
            };

            var witBTotalWords = 0;
            var witBMatches = 0;
            var witCTotalWords = 0;
            var witCMatches = 0;
            var witDTotalWords = 0;
            var witDMatches = 0;

            for (var i = 0; i < maxLines; i++) {
                var lA = linesA[i] || '';
                var lB = linesB[i] || '';
                var lC = linesC[i] || '';
                var lD = linesD[i] || '';

                // Boş satır (beyit ayracı) kontrolü
                if (!lA.trim() && !lB.trim() && !lC.trim() && !lD.trim()) {
                    verses.push({ isBreak: true, lineNum: i + 1 });
                    continue;
                }

                var tokA = tokenizeVerse(lA);
                var tokB = tokenizeVerse(lB);
                var tokC = tokenizeVerse(lC);
                var tokD = tokenizeVerse(lD);

                variantStats.totalWords += tokA.length;

                // Nüsha A ile B/C/D arasında ikili hizalama
                var alignB = alignTokens(tokA, tokB);
                var alignC = alignTokens(tokA, tokC);
                var alignD = alignTokens(tokA, tokD);

                // Bu satırdaki aparat maddeleri
                var lineApparatus = [];
                var verseNumDisplay = Math.floor(i / 2) + 1;
                var misraNumDisplay = (i % 2 === 0) ? 'a' : 'b';
                var verseCoord = verseNumDisplay + misraNumDisplay;

                // Satırdaki her esas kelime (Lemma) için varyantları topla
                for (var t = 0; t < tokA.length; t++) {
                    var baseTok = tokA[t];
                    var variantsForWord = [];

                    // B Nüshasındaki varyant
                    var matchB = alignB.find(function(al) { return al.base === baseTok; });
                    if (matchB) {
                        witBTotalWords++;
                        if (matchB.type === 'equal') {
                            witBMatches++;
                        } else if (matchB.type === 'subst') {
                            variantsForWord.push({ wit: 'B', text: matchB.wit.word, type: 'subst' });
                            variantStats.substitutions++;
                            variantStats.totalVariants++;
                        } else if (matchB.type === 'omit') {
                            variantsForWord.push({ wit: 'B', text: 'om.', type: 'omit' });
                            variantStats.omissions++;
                            variantStats.totalVariants++;
                        }
                    } else {
                        // Omission
                        variantsForWord.push({ wit: 'B', text: 'om.', type: 'omit' });
                        variantStats.omissions++;
                        variantStats.totalVariants++;
                    }

                    // C Nüshasındaki varyant
                    var matchC = alignC.find(function(al) { return al.base === baseTok; });
                    if (matchC) {
                        witCTotalWords++;
                        if (matchC.type === 'equal') {
                            witCMatches++;
                        } else if (matchC.type === 'subst') {
                            variantsForWord.push({ wit: 'C', text: matchC.wit.word, type: 'subst' });
                            variantStats.substitutions++;
                            variantStats.totalVariants++;
                        } else if (matchC.type === 'omit') {
                            variantsForWord.push({ wit: 'C', text: 'om.', type: 'omit' });
                            variantStats.omissions++;
                            variantStats.totalVariants++;
                        }
                    } else {
                        variantsForWord.push({ wit: 'C', text: 'om.', type: 'omit' });
                        variantStats.omissions++;
                        variantStats.totalVariants++;
                    }

                    // D Nüshasındaki varyant (eğer metin varsa)
                    if (lD.trim()) {
                        var matchD = alignD.find(function(al) { return al.base === baseTok; });
                        if (matchD) {
                            witDTotalWords++;
                            if (matchD.type === 'equal') {
                                witDMatches++;
                            } else if (matchD.type === 'subst') {
                                variantsForWord.push({ wit: 'D', text: matchD.wit.word, type: 'subst' });
                                variantStats.substitutions++;
                                variantStats.totalVariants++;
                            } else if (matchD.type === 'omit') {
                                variantsForWord.push({ wit: 'D', text: 'om.', type: 'omit' });
                                variantStats.omissions++;
                                variantStats.totalVariants++;
                            }
                        } else {
                            variantsForWord.push({ wit: 'D', text: 'om.', type: 'omit' });
                            variantStats.omissions++;
                            variantStats.totalVariants++;
                        }
                    }

                    // Eğer bir veya birden fazla nüshada fark varsa, akademik aparat oluştur
                    if (variantsForWord.length > 0) {
                        // Grupla: Aynı kelimeyi okuyan nüshaları birleştir (Örn: "gül-şen B, C")
                        var grouped = {};
                        variantsForWord.forEach(function(v) {
                            if (!grouped[v.text]) grouped[v.text] = [];
                            grouped[v.text].push(v.wit);
                        });

                        var varStrings = [];
                        for (var wordRead in grouped) {
                            varStrings.push(wordRead + ' ' + grouped[wordRead].join(', '));
                        }

                        var appEntry = {
                            lineNum: i + 1,
                            coord: verseCoord,
                            lemma: baseTok.word,
                            apparatusText: baseTok.word + '] ' + varStrings.join('; '),
                            variants: variantsForWord
                        };

                        lineApparatus.push(appEntry);
                        apparatusNotes.push(appEntry);
                    }
                }

                // Satıra eklenmiş zâid (addition) kelimeleri kontrol et
                alignB.forEach(function(al) {
                    if (al.type === 'add') {
                        var addEntry = {
                            lineNum: i + 1,
                            coord: verseCoord,
                            lemma: '—',
                            apparatusText: '—] add. ' + al.wit.word + ' B',
                            variants: [{ wit: 'B', text: al.wit.word, type: 'add' }]
                        };
                        lineApparatus.push(addEntry);
                        apparatusNotes.push(addEntry);
                        variantStats.additions++;
                        variantStats.totalVariants++;
                    }
                });

                alignC.forEach(function(al) {
                    if (al.type === 'add') {
                        var addEntry = {
                            lineNum: i + 1,
                            coord: verseCoord,
                            lemma: '—',
                            apparatusText: '—] add. ' + al.wit.word + ' C',
                            variants: [{ wit: 'C', text: al.wit.word, type: 'add' }]
                        };
                        lineApparatus.push(addEntry);
                        apparatusNotes.push(addEntry);
                        variantStats.additions++;
                        variantStats.totalVariants++;
                    }
                });

                verses.push({
                    isBreak: false,
                    lineNum: i + 1,
                    coord: verseCoord,
                    tokensA: tokA,
                    tokensB: tokB,
                    tokensC: tokC,
                    tokensD: tokD,
                    apparatus: lineApparatus
                });
            }

            variantStats.witBAgreement = witBTotalWords > 0 ? Math.round((witBMatches / witBTotalWords) * 100) : 100;
            variantStats.witCAgreement = witCTotalWords > 0 ? Math.round((witCMatches / witCTotalWords) * 100) : 100;
            variantStats.witDAgreement = witDTotalWords > 0 ? Math.round((witDMatches / witDTotalWords) * 100) : 100;

            var result = {
                verses: verses,
                apparatusNotes: apparatusNotes,
                stats: variantStats
            };

            this.collationResult = result;
            return result;
        },

        /**
         * TEI-XML (Digital Humanities Standartı) Çıktısı Üretir
         */
        exportToTeiXml: function(projectMeta) {
            var self = this;
            var meta = projectMeta || self.currentProject;
            var coll = self.collationResult;
            if (!coll) return '';

            var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<TEI xmlns="http://www.tei-c.org/ns/1.0">\n';
            xml += '  <teiHeader>\n';
            xml += '    <fileDesc>\n';
            xml += '      <titleStmt>\n';
            xml += '        <title>' + escapeXml(meta.title || 'Tenkitli Metin') + '</title>\n';
            xml += '        <author>' + escapeXml(meta.author || 'Müellif') + '</author>\n';
            xml += '        <editor>Bitigey Edisyon Kritik Tezgahı</editor>\n';
            xml += '      </titleStmt>\n';
            xml += '      <sourceDesc>\n';
            xml += '        <listWit>\n';
            xml += '          <witness xml:id="witA">' + escapeXml(meta.baseWitness) + '</witness>\n';
            xml += '          <witness xml:id="witB">' + escapeXml(meta.witnessBName) + '</witness>\n';
            xml += '          <witness xml:id="witC">' + escapeXml(meta.witnessCName) + '</witness>\n';
            if (meta.witnessDName) xml += '          <witness xml:id="witD">' + escapeXml(meta.witnessDName) + '</witness>\n';
            xml += '        </listWit>\n';
            xml += '      </sourceDesc>\n';
            xml += '    </fileDesc>\n';
            xml += '  </teiHeader>\n';
            xml += '  <text>\n';
            xml += '    <body>\n';
            xml += '      <div type="poem">\n';

            coll.verses.forEach(function(v) {
                if (v.isBreak) {
                    xml += '        <gap reason="strophe-break"/>\n';
                    return;
                }
                xml += '        <l n="' + v.coord + '">\n';
                v.tokensA.forEach(function(t) {
                    var app = v.apparatus.find(function(a) { return a.lemma === t.word; });
                    if (app) {
                        xml += '          <app>\n';
                        xml += '            <lem wit="#witA">' + escapeXml(t.word) + '</lem>\n';
                        app.variants.forEach(function(vr) {
                            xml += '            <rdg wit="#wit' + vr.wit + '">' + escapeXml(vr.text) + '</rdg>\n';
                        });
                        xml += '          </app> ';
                    } else {
                        xml += '          ' + escapeXml(t.raw) + ' ';
                    }
                });
                xml += '\n        </l>\n';
            });

            xml += '      </div>\n';
            xml += '    </body>\n';
            xml += '  </text>\n';
            xml += '</TEI>';

            return xml;
        },

        /**
         * Word / DOCX Uyumlu Dipnotlu HTML İndirme Paketi
         */
        exportToWordHtml: function(projectMeta) {
            var self = this;
            var meta = projectMeta || self.currentProject;
            var coll = self.collationResult;
            if (!coll) return '';

            var html = '<!DOCTYPE html>\n<html><head><meta charset="utf-8">';
            html += '<title>' + escapeXml(meta.title) + '</title>';
            html += '<style>';
            html += 'body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.8; margin: 2.5cm; }';
            html += 'h1 { text-align: center; font-size: 16pt; margin-bottom: 6pt; }';
            html += 'h2 { text-align: center; font-size: 13pt; font-weight: normal; margin-bottom: 24pt; font-style: italic; }';
            html += '.sigla-table { width: 100%; border-collapse: collapse; margin-bottom: 24pt; font-size: 10pt; }';
            html += '.sigla-table td, .sigla-table th { border: 1px solid #ccc; padding: 4pt 8pt; }';
            html += '.poem-block { margin: 20pt auto; width: 85%; font-size: 13pt; }';
            html += '.verse-line { margin-bottom: 4pt; }';
            html += '.line-num { font-size: 9pt; color: #666; width: 30pt; display: inline-block; }';
            html += '.footnote-mark { font-size: 9pt; vertical-align: super; color: #b45309; }';
            html += '.apparatus-divider { border-top: 1px solid #000; width: 40%; margin: 30pt 0 10pt; }';
            html += '.apparatus-list { font-size: 9.5pt; line-height: 1.5; }';
            html += '</style></head><body>';

            html += '<h1>' + escapeXml(meta.title) + '</h1>';
            html += '<h2>' + escapeXml(meta.author) + '</h2>';

            html += '<table class="sigla-table">';
            html += '<tr><th>Rumuz (Sigla)</th><th>Kütüphane / Nüsha Tavsifi</th></tr>';
            html += '<tr><td><strong>A (Esas Nüsha)</strong></td><td>' + escapeXml(meta.baseWitness) + '</td></tr>';
            html += '<tr><td><strong>B</strong></td><td>' + escapeXml(meta.witnessBName) + '</td></tr>';
            html += '<tr><td><strong>C</strong></td><td>' + escapeXml(meta.witnessCName) + '</td></tr>';
            if (meta.witnessDName) html += '<tr><td><strong>D</strong></td><td>' + escapeXml(meta.witnessDName) + '</td></tr>';
            html += '</table>';

            html += '<div class="poem-block">';
            var noteIndex = 1;

            coll.verses.forEach(function(v) {
                if (v.isBreak) {
                    html += '<div style="height: 16pt;"></div>';
                    return;
                }
                html += '<div class="verse-line">';
                html += '<span class="line-num">' + v.coord + '</span>';
                v.tokensA.forEach(function(t) {
                    var app = v.apparatus.find(function(a) { return a.lemma === t.word; });
                    if (app) {
                        html += t.word + '<span class="footnote-mark">[' + noteIndex + ']</span> ';
                        app.footNoteNum = noteIndex;
                        noteIndex++;
                    } else {
                        html += t.raw + ' ';
                    }
                });
                html += '</div>';
            });
            html += '</div>';

            html += '<div class="apparatus-divider"></div>';
            html += '<div class="apparatus-list">';
            html += '<h4>ELEŞTİREL APARAT (APPARATUS CRITICUS)</h4>';

            coll.apparatusNotes.forEach(function(app) {
                html += '<div><strong>[' + (app.footNoteNum || app.coord) + ']</strong> <em>' + app.coord + '</em> ' + escapeXml(app.apparatusText) + '</div>';
            });

            html += '</div>';
            html += '<div style="margin-top: 40pt; font-size: 8pt; color: #888; text-align: right;">Bitigey Edisyon Kritik & Varyant Tezgahı ile üretilmiştir • contact@bitigey.com</div>';
            html += '</body></html>';

            return html;
        },

        /**
         * LaTeX (reledmac Akademik Eleştirel Neşir Paketi) Çıktısı
         */
        exportToLatex: function(projectMeta) {
            var self = this;
            var meta = projectMeta || self.currentProject;
            var coll = self.collationResult;
            if (!coll) return '';

            var tex = '% Bitigey Edisyon Kritik & Varyant Tezgahı (contact@bitigey.com)\n';
            tex += '% Derleme: xelatex veya lualatex ile derlenmesi tavsiye edilir.\n';
            tex += '\\documentclass[12pt,a4paper]{article}\n';
            tex += '\\usepackage[utf8]{inputenc}\n';
            tex += '\\usepackage[T1]{fontenc}\n';
            tex += '\\usepackage{fontspec}\n';
            tex += '\\usepackage{reledmac}\n';
            tex += '\\usepackage{geometry}\n';
            tex += '\\geometry{left=3cm,right=2.5cm,top=2.5cm,bottom=2.5cm}\n\n';
            tex += '\\setmainfont{EB Garamond}\n\n';
            tex += '\\title{' + (meta.title || 'Tenkitli Metin') + '}\n';
            tex += '\\author{' + (meta.author || 'Müellif') + '}\n';
            tex += '\\date{\\today}\n\n';
            tex += '\\begin{document}\n';
            tex += '\\maketitle\n\n';
            tex += '\\section*{Nüshalar ve Rumuzlar (Sigla)}\n';
            tex += '\\begin{description}\n';
            tex += '  \\item[\\textbf{A (Esas)}] ' + (meta.baseWitness || 'Esas Nüsha') + '\n';
            tex += '  \\item[\\textbf{B}] ' + (meta.witnessBName || 'B Nüshası') + '\n';
            tex += '  \\item[\\textbf{C}] ' + (meta.witnessCName || 'C Nüshası') + '\n';
            if (meta.witnessDName) {
                tex += '  \\item[\\textbf{D}] ' + meta.witnessDName + '\n';
            }
            tex += '\\end{description}\n\n';
            tex += '\\vspace{1cm}\n';
            tex += '\\begin{numbering}\n';
            tex += '\\pstart\n';

            coll.verses.forEach(function(v) {
                if (v.isBreak) {
                    tex += '\\pend\\vspace{0.5cm}\\pstart\n';
                    return;
                }
                tex += '% ' + v.coord + '\n';
                v.tokensA.forEach(function(t) {
                    var app = v.apparatus.find(function(a) { return a.lemma === t.word; });
                    if (app) {
                        var varStr = app.variants.map(function(vr) {
                            return vr.text + ' \\textbf{' + vr.wit + '}';
                        }).join(', ');
                        tex += '\\edtext{' + t.word + '}{\\Avariant{' + varStr + '}} ';
                    } else {
                        tex += t.raw + ' ';
                    }
                });
                tex += '\\\\\n';
            });

            tex += '\\pend\n';
            tex += '\\end{numbering}\n\n';
            tex += '\\vfill\n';
            tex += '{\\footnotesize \\noindent Bitigey Edisyon Kritik \\& Varyant Tezgahı ile üretilmiştir. İletişim: contact@bitigey.com}\n';
            tex += '\\end{document}\n';

            return tex;
        },

        /**
         * Excel / CSV (Tablo Halinde Varyant Tahlili)
         */
        exportToCsv: function(projectMeta) {
            var self = this;
            var coll = self.collationResult;
            if (!coll) return '';

            // UTF-8 BOM ekle ki Excel Türkçe ve Transkripsiyon harflerini doğru açsın
            var csv = '\ufeff';
            csv += 'No;Mısra/Beyit;Esas Nüsha (Lemma);Nüsha B;Nüsha C;Nüsha D;Varyant Türü;Akademik Aparat İfadesi\n';

            coll.apparatusNotes.forEach(function(app, idx) {
                var num = idx + 1;
                var witB = '';
                var witC = '';
                var witD = '';
                var types = [];

                app.variants.forEach(function(vr) {
                    if (vr.wit === 'B') witB = vr.text;
                    if (vr.wit === 'C') witC = vr.text;
                    if (vr.wit === 'D') witD = vr.text;
                    if (types.indexOf(vr.type) === -1) types.push(vr.type);
                });

                var typeLabel = types.map(function(t) {
                    if (t === 'subst') return 'Kelime Farkı';
                    if (t === 'omit') return 'Düşme (Omissio)';
                    if (t === 'add') return 'İlave (Additio)';
                    return t;
                }).join(', ');

                var row = [
                    num,
                    '"' + app.coord + '"',
                    '"' + (app.lemma || '').replace(/"/g, '""') + '"',
                    '"' + witB.replace(/"/g, '""') + '"',
                    '"' + witC.replace(/"/g, '""') + '"',
                    '"' + witD.replace(/"/g, '""') + '"',
                    '"' + typeLabel + '"',
                    '"' + (app.apparatusText || '').replace(/"/g, '""') + '"'
                ];

                csv += row.join(';') + '\n';
            });

            return csv;
        },

        /**
         * Düz Metin (TXT) Tez Notları Formatı
         */
        exportToPlainText: function(projectMeta) {
            var self = this;
            var meta = projectMeta || self.currentProject;
            var coll = self.collationResult;
            if (!coll) return '';

            var txt = '======================================================================\n';
            txt += (meta.title || 'TENKİTLİ METİN NEŞRİ').toUpperCase() + '\n';
            txt += 'Müellif: ' + (meta.author || 'Bilinmiyor') + '\n';
            txt += 'Bitigey Edisyon Kritik & Varyant Tezgahı (contact@bitigey.com)\n';
            txt += '======================================================================\n\n';
            txt += 'NÜSHA TAVSİFLERİ (SIGLA):\n';
            txt += 'A: ' + (meta.baseWitness || 'Esas Nüsha') + '\n';
            txt += 'B: ' + (meta.witnessBName || 'B Nüshası') + '\n';
            txt += 'C: ' + (meta.witnessCName || 'C Nüshası') + '\n';
            if (meta.witnessDName) txt += 'D: ' + meta.witnessDName + '\n';
            txt += '\n----------------------------------------------------------------------\n';
            txt += 'TENKİTLİ METİN (A ESAS ALINMIŞTIR):\n';
            txt += '----------------------------------------------------------------------\n\n';

            var noteCounter = 1;
            coll.verses.forEach(function(v) {
                if (v.isBreak) {
                    txt += '\n';
                    return;
                }
                var lineTxt = v.coord + '\t';
                v.tokensA.forEach(function(t) {
                    var app = v.apparatus.find(function(a) { return a.lemma === t.word; });
                    if (app) {
                        lineTxt += t.word + '[' + noteCounter + '] ';
                        noteCounter++;
                    } else {
                        lineTxt += t.raw + ' ';
                    }
                });
                txt += lineTxt.trim() + '\n';
            });

            txt += '\n----------------------------------------------------------------------\n';
            txt += 'ELEŞTİREL APARAT (APPARATUS CRITICUS DIPNOTLARI):\n';
            txt += '----------------------------------------------------------------------\n\n';

            coll.apparatusNotes.forEach(function(app, idx) {
                var num = idx + 1;
                txt += '[' + num + '] ' + app.coord + ' ' + app.apparatusText + '\n';
            });

            txt += '\n======================================================================\n';
            txt += 'Hazırlayan: Bitigey Dijital Filoloji Suiti • contact@bitigey.com\n';

            return txt;
        }
    };

    function escapeXml(str) {
        if (!str) return '';
        return String(str).replace(/[<>&'"]/g, function(c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }

    root.EdisyonKritikEngine = EdisyonKritikEngine;
    if (typeof window !== 'undefined') {
        window.EdisyonKritikEngine = EdisyonKritikEngine;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EdisyonKritikEngine;
    }

})(typeof window !== 'undefined' ? window : this);
