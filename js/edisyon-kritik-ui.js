/**
 * BİTİGEY EDİSYON KRİTİK & VARYANT TEZGAHI (Kullanıcı Arayüzü & Etkileşim Yöneticisi)
 * Dosya: js/edisyon-kritik-ui.js
 * İletişim & Akademik İş Birliği: contact@bitigey.com
 */

(function() {
    'use strict';

    var currentActiveTextarea = null;
    var isSyncScrollEnabled = true;

    document.addEventListener('DOMContentLoaded', function() {
        initUI();
    });

    function initUI() {
        // DOM Elemanları
        var presetSelect = document.getElementById('ekPresetSelect');
        var btnRunCollation = document.getElementById('btnRunCollation');
        var btnExportModal = document.getElementById('btnExportModal');
        var btnThemeToggle = document.getElementById('btnThemeToggle');
        var btnAddWitness = document.getElementById('btnAddWitness');
        var btnCopyApparatus = document.getElementById('btnCopyApparatus');
        var colLayoutSelect = document.getElementById('colLayoutSelect');

        var modal = document.getElementById('ekExportModal');
        var modalClose = document.getElementById('ekModalClose');
        var btnDownloadWord = document.getElementById('btnDownloadWord');
        var btnDownloadTei = document.getElementById('btnDownloadTei');
        var btnDownloadJson = document.getElementById('btnDownloadJson');
        var btnPrint = document.getElementById('btnPrint');
        var fileJsonInput = document.getElementById('fileJsonInput');
        var btnImportJson = document.getElementById('btnImportJson');

        var textareas = [
            document.getElementById('textWitnessA'),
            document.getElementById('textWitnessB'),
            document.getElementById('textWitnessC'),
            document.getElementById('textWitnessD')
        ];

        // Son odaklanılan metin kutusunu takip et (Transkripsiyon klavyesi için)
        textareas.forEach(function(ta) {
            if (!ta) return;
            ta.addEventListener('focus', function() {
                currentActiveTextarea = this;
            });
            // Giriş yapıldığında otomatik senkron güncelleme ve cihaz hafızasına kaydetme
            ta.addEventListener('input', debounce(function() {
                updateWordStats();
                autoSaveEdisyonState();
            }, 300));
        });

        // Varsayılan odak Nüsha A olsun
        currentActiveTextarea = textareas[0];

        // 1. Çeviriyazı (Transkripsiyon) Klavye Butonları
        var charButtons = document.querySelectorAll('.ek-char-btn');
        charButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var charToInsert = this.getAttribute('data-char');
                insertCharToActiveInput(charToInsert);
            });
        });

        // 2. Preset (Hazır Proje) Değişimi
        if (presetSelect) {
            presetSelect.addEventListener('change', function() {
                loadPreset(this.value);
            });
        }

        // 3. Kolasyon ve Varyant Tespiti Çalıştır
        if (btnRunCollation) {
            btnRunCollation.addEventListener('click', function() {
                runCollation();
            });
        }

        // 4. Tab Geçişleri (Editör <-> Renkli Varyant)
        setupTabButtons();

        // 5. Senkron Kaydırma (Sync Scroll)
        setupSyncScroll();

        // 6. Tema Değiştirici (Akademi Siyahı <-> Parşömen Kağıdı)
        if (btnThemeToggle) {
            btnThemeToggle.addEventListener('click', function() {
                document.body.classList.toggle('parchment-mode');
                var isParchment = document.body.classList.contains('parchment-mode');
                this.innerHTML = isParchment 
                    ? '<i class="fa-solid fa-moon"></i> Koyu Tema' 
                    : '<i class="fa-solid fa-book-open"></i> Parşömen Modu';
                showToast(isParchment ? 'Açık Parşömen temasına geçildi.' : 'Koyu Akademi temasına geçildi.');
            });
        }

        // 7. Sütun Düzeni Değişimi
        if (colLayoutSelect) {
            colLayoutSelect.addEventListener('change', function() {
                var grid = document.getElementById('ekWitnessGrid');
                if (grid) {
                    grid.className = 'ek-witness-grid cols-' + this.value;
                }
            });
        }

        // 8. 4. Nüsha (D) Açma / Kapama
        if (btnAddWitness) {
            btnAddWitness.addEventListener('click', function() {
                var cardD = document.getElementById('cardWitnessD');
                if (!cardD) return;
                var isHidden = cardD.style.display === 'none';
                cardD.style.display = isHidden ? 'flex' : 'none';
                this.innerHTML = isHidden 
                    ? '<i class="fa-solid fa-minus"></i> 4. Nüshayı Gizle' 
                    : '<i class="fa-solid fa-plus"></i> 4. Nüshayı Ekle (D)';
                if (colLayoutSelect) {
                    colLayoutSelect.value = isHidden ? '4' : '3';
                    var grid = document.getElementById('ekWitnessGrid');
                    if (grid) grid.className = 'ek-witness-grid cols-' + colLayoutSelect.value;
                }
            });
        }

        // 9. Dışa Aktarım Modalı
        if (btnExportModal && modal) {
            btnExportModal.addEventListener('click', function() {
                // Önceden bir kez derleyelim
                runCollation();
                modal.classList.add('active');
            });
        }

        if (modalClose && modal) {
            modalClose.addEventListener('click', function() {
                modal.classList.remove('active');
            });
            modal.addEventListener('click', function(e) {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        // 10. İndirme Eylemleri
        if (btnDownloadWord) {
            btnDownloadWord.addEventListener('click', function() {
                exportWordDoc();
            });
        }

        if (btnDownloadTei) {
            btnDownloadTei.addEventListener('click', function() {
                exportTeiXml();
            });
        }

        if (btnDownloadJson) {
            btnDownloadJson.addEventListener('click', function() {
                exportJsonProject();
            });
        }

        if (btnImportJson && fileJsonInput) {
            btnImportJson.addEventListener('click', function() {
                fileJsonInput.click();
            });
            fileJsonInput.addEventListener('change', function(e) {
                importJsonProject(e);
            });
        }

        if (btnPrint) {
            btnPrint.addEventListener('click', function() {
                window.print();
            });
        }

        var btnDownloadLatex = document.getElementById('btnDownloadLatex');
        if (btnDownloadLatex) {
            btnDownloadLatex.addEventListener('click', function() {
                exportLatexDoc();
            });
        }

        var btnDownloadCsv = document.getElementById('btnDownloadCsv');
        if (btnDownloadCsv) {
            btnDownloadCsv.addEventListener('click', function() {
                exportCsvDoc();
            });
        }

        var btnDownloadTxt = document.getElementById('btnDownloadTxt');
        if (btnDownloadTxt) {
            btnDownloadTxt.addEventListener('click', function() {
                exportTxtDoc();
            });
        }

        var btnFontZoomIn = document.getElementById('btnFontZoomIn');
        if (btnFontZoomIn) {
            btnFontZoomIn.addEventListener('click', function() {
                changeFontSize(1);
            });
        }

        var btnFontZoomOut = document.getElementById('btnFontZoomOut');
        if (btnFontZoomOut) {
            btnFontZoomOut.addEventListener('click', function() {
                changeFontSize(-1);
            });
        }

        var selectFontFamily = document.getElementById('selectFontFamily');
        if (selectFontFamily) {
            selectFontFamily.addEventListener('change', function() {
                document.documentElement.style.setProperty('--font-serif', this.value);
                showToast('Yazı tipi değiştirildi: ' + this.options[this.selectedIndex].text);
            });
        }

        // 11. Aparatı Panoya Kopyala
        if (btnCopyApparatus) {
            btnCopyApparatus.addEventListener('click', function() {
                copyFullApparatusToClipboard();
            });
        }

        // Metaveri alanları değiştiğinde otomatik kaydet
        ['projTitle', 'projAuthor', 'witnessAName', 'witnessBName', 'witnessCName', 'witnessDName'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', debounce(function() {
                    autoSaveEdisyonState();
                }, 400));
            }
        });

        // Cihazda kayıtlı proje varsa geri yükle, yoksa Fuzûlî presetini yükle
        var savedState = null;
        try {
            savedState = JSON.parse(localStorage.getItem('bitigey_edisyon_custom_state') || 'null');
        } catch(e) {}

        if (savedState && (savedState.textA || savedState.title)) {
            restoreSavedProject(savedState);
        } else {
            loadPreset('fuzuli_su');
        }
    }

    /**
     * Edisyon projesini tarayıcı / cihaz hafızasına otomatik kaydeder
     */
    function autoSaveEdisyonState() {
        try {
            var state = {
                title: document.getElementById('projTitle') ? document.getElementById('projTitle').value : '',
                author: document.getElementById('projAuthor') ? document.getElementById('projAuthor').value : '',
                preset: document.getElementById('ekPresetSelect') ? document.getElementById('ekPresetSelect').value : '',
                colLayout: document.getElementById('colLayoutSelect') ? document.getElementById('colLayoutSelect').value : '',
                witnessAName: document.getElementById('witnessAName') ? document.getElementById('witnessAName').value : '',
                witnessBName: document.getElementById('witnessBName') ? document.getElementById('witnessBName').value : '',
                witnessCName: document.getElementById('witnessCName') ? document.getElementById('witnessCName').value : '',
                witnessDName: document.getElementById('witnessDName') ? document.getElementById('witnessDName').value : '',
                textA: document.getElementById('textWitnessA') ? document.getElementById('textWitnessA').value : '',
                textB: document.getElementById('textWitnessB') ? document.getElementById('textWitnessB').value : '',
                textC: document.getElementById('textWitnessC') ? document.getElementById('textWitnessC').value : '',
                textD: document.getElementById('textWitnessD') ? document.getElementById('textWitnessD').value : '',
                savedAt: Date.now()
            };
            localStorage.setItem('bitigey_edisyon_custom_state', JSON.stringify(state));
            if (window.flashSaveBadge) window.flashSaveBadge();
        } catch(e) {}
    }

    /**
     * Cihazda kayıtlı edisyon projesini arayüze geri yükler
     */
    function restoreSavedProject(s) {
        if (!s) return;
        if (document.getElementById('projTitle') && s.title) document.getElementById('projTitle').value = s.title;
        if (document.getElementById('projAuthor') && s.author) document.getElementById('projAuthor').value = s.author;
        if (document.getElementById('ekPresetSelect') && s.preset) document.getElementById('ekPresetSelect').value = s.preset;
        if (document.getElementById('colLayoutSelect') && s.colLayout) {
            document.getElementById('colLayoutSelect').value = s.colLayout;
            changeColumnLayout(s.colLayout);
        }
        if (document.getElementById('witnessAName') && s.witnessAName) document.getElementById('witnessAName').value = s.witnessAName;
        if (document.getElementById('witnessBName') && s.witnessBName) document.getElementById('witnessBName').value = s.witnessBName;
        if (document.getElementById('witnessCName') && s.witnessCName) document.getElementById('witnessCName').value = s.witnessCName;
        if (document.getElementById('witnessDName') && s.witnessDName) document.getElementById('witnessDName').value = s.witnessDName;

        if (document.getElementById('textWitnessA')) document.getElementById('textWitnessA').value = s.textA || '';
        if (document.getElementById('textWitnessB')) document.getElementById('textWitnessB').value = s.textB || '';
        if (document.getElementById('textWitnessC')) document.getElementById('textWitnessC').value = s.textC || '';
        if (document.getElementById('textWitnessD')) document.getElementById('textWitnessD').value = s.textD || '';

        updateWordStats();
        runCollation();
        showToast('✓ Cihazınızda kayıtlı son edisyon projesi geri yüklendi.');
    }

    /**
     * Aktif imleç pozisyonuna özel transkripsiyon harfini ekler
     */
    function insertCharToActiveInput(char) {
        if (!currentActiveTextarea) {
            currentActiveTextarea = document.getElementById('textWitnessA');
        }
        var ta = currentActiveTextarea;
        if (!ta) return;

        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var text = ta.value;

        ta.value = text.substring(0, start) + char + text.substring(end);
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + char.length;

        updateWordStats();
        autoSaveEdisyonState();
    }

    /**
     * Hazır Preset Yükler
     */
    function loadPreset(key) {
        if (!window.EdisyonKritikEngine) return;
        var p = window.EdisyonKritikEngine.presets[key];
        if (!p) return;

        document.getElementById('projTitle').value = p.title || '';
        document.getElementById('projAuthor').value = p.author || '';
        document.getElementById('witnessAName').value = p.baseWitness || '';
        document.getElementById('witnessBName').value = p.witnessBName || '';
        document.getElementById('witnessCName').value = p.witnessCName || '';

        document.getElementById('textWitnessA').value = p.textA || '';
        document.getElementById('textWitnessB').value = p.textB || '';
        document.getElementById('textWitnessC').value = p.textC || '';

        var textD = document.getElementById('textWitnessD');
        if (textD) textD.value = '';

        // Otomatik varyant analizini yap
        updateWordStats();
        runCollation();
        autoSaveEdisyonState();
        showToast('"' + p.title + '" başarıyla yüklendi.');
    }

    /**
     * Nüshaları Kolasyon Eder ve Sonuçları Arayüze Basar
     */
    function runCollation() {
        if (!window.EdisyonKritikEngine) return;

        var textA = document.getElementById('textWitnessA').value;
        var textB = document.getElementById('textWitnessB').value;
        var textC = document.getElementById('textWitnessC').value;
        var textD = (document.getElementById('textWitnessD') ? document.getElementById('textWitnessD').value : '');

        var meta = {
            title: document.getElementById('projTitle').value || 'Tenkitli Metin',
            author: document.getElementById('projAuthor').value || 'Müellif',
            baseWitness: document.getElementById('witnessAName').value || 'A (Esas Nüsha)',
            witnessBName: document.getElementById('witnessBName').value || 'B Nüshası',
            witnessCName: document.getElementById('witnessCName').value || 'C Nüshası',
            witnessDName: (document.getElementById('witnessDName') ? document.getElementById('witnessDName').value : '')
        };

        window.EdisyonKritikEngine.currentProject = meta;

        // Motoru çalıştır
        var collation = window.EdisyonKritikEngine.collateWitnesses(textA, textB, textC, textD);

        // 1. Aparat Listesini Doldur
        renderApparatus(collation.apparatusNotes);

        // 2. Renkli Varyant Görünümlerini Doldur
        renderDiffViews(collation);

        // 3. İstatistikleri Güncelle
        renderStats(collation.stats);

        // Kullanıcıyı bilgilendir
        showToast('Varyant analizi ve eleştirel aparat güncellendi (' + collation.apparatusNotes.length + ' varyant tespit edildi).');
    }

    /**
     * Aparat Çekmecesini Render Eder
     */
    function renderApparatus(notes) {
        var container = document.getElementById('ekApparatusList');
        if (!container) return;

        if (!notes || notes.length === 0) {
            container.innerHTML = '<div class="ek-app-empty"><i class="fa-solid fa-check-circle" style="color:#3fb950; margin-right:6px;"></i> Nüshalar arasında hiçbir metin farkı (varyant) bulunamadı. Metinler birebir mutabıktır.</div>';
            return;
        }

        var html = '';
        notes.forEach(function(item, idx) {
            var noteNum = idx + 1;
            item.footNoteNum = noteNum;

            var variantParts = [];
            item.variants.forEach(function(v) {
                var cls = v.type === 'omit' ? 'var-omit' : (v.type === 'add' ? 'var-add' : 'var-subst');
                var txt = v.text;
                if (v.type === 'omit') txt = '<em>om.</em>';
                if (v.type === 'add') txt = '<em>add.</em> ' + v.text;
                variantParts.push('<span class="' + cls + '">' + txt + '</span> <span class="ek-app-sigla">' + v.wit + '</span>');
            });

            html += '<div class="ek-apparatus-entry" id="app-entry-' + noteNum + '">';
            html += '  <span class="ek-app-num">[' + noteNum + ']</span>';
            html += '  <span class="ek-app-location">' + item.coord + '</span>';
            html += '  <span class="ek-app-lemma">' + escapeHtml(item.lemma) + '</span>';
            html += '  <span class="ek-app-bracket">]</span>';
            html += '  <span class="ek-app-readings">' + variantParts.join('; ') + '</span>';
            html += '  <button class="ek-btn" style="padding: 0.15rem 0.4rem; font-size:0.7rem;" onclick="window.BitigeyEKUI.copySingleApp(' + noteNum + ')" title="Bu dipnotu kopyala"><i class="fa-regular fa-copy"></i></button>';
            html += '</div>';
        });

        container.innerHTML = html;
        var countBadge = document.getElementById('ekApparatusCountBadge');
        if (countBadge) countBadge.textContent = notes.length + ' Madde';
    }

    /**
     * Nüsha Kartlarındaki Renkli Varyant Görünümlerini İnşa Eder
     */
    function renderDiffViews(collation) {
        var diffA = document.getElementById('diffWitnessA');
        var diffB = document.getElementById('diffWitnessB');
        var diffC = document.getElementById('diffWitnessC');
        var diffD = document.getElementById('diffWitnessD');

        var htmlA = '', htmlB = '', htmlC = '', htmlD = '';
        var noteCounter = 1;

        collation.verses.forEach(function(v) {
            if (v.isBreak) {
                var breakHtml = '<div style="height: 18px;"></div>';
                htmlA += breakHtml; htmlB += breakHtml; htmlC += breakHtml; htmlD += breakHtml;
                return;
            }

            // A (Esas Nüsha): Lemma vurguları ve dipnot numaraları
            htmlA += '<div class="ek-diff-line">';
            htmlA += '<span class="ek-diff-linenum">' + v.coord + '</span>';
            htmlA += '<span class="ek-diff-content">';
            v.tokensA.forEach(function(t) {
                var app = v.apparatus.find(function(a) { return a.lemma === t.word; });
                if (app) {
                    htmlA += '<span class="var-lemma-mark">' + escapeHtml(t.word) + '</span><sup class="ek-footnote-sup">[' + noteCounter + ']</sup> ';
                    noteCounter++;
                } else {
                    htmlA += escapeHtml(t.raw) + ' ';
                }
            });
            htmlA += '</span></div>';

            // B Nüshası: Farklar
            htmlB += buildWitnessDiffLine(v.coord, v.tokensB, collation.verses, 'B');

            // C Nüshası: Farklar
            htmlC += buildWitnessDiffLine(v.coord, v.tokensC, collation.verses, 'C');

            // D Nüshası
            if (diffD) {
                htmlD += buildWitnessDiffLine(v.coord, v.tokensD, collation.verses, 'D');
            }
        });

        if (diffA) diffA.innerHTML = htmlA;
        if (diffB) diffB.innerHTML = htmlB;
        if (diffC) diffC.innerHTML = htmlC;
        if (diffD) diffD.innerHTML = htmlD;
    }

    function buildWitnessDiffLine(coord, tokens, verses, siglum) {
        var lineHtml = '<div class="ek-diff-line">';
        lineHtml += '<span class="ek-diff-linenum">' + coord + '</span>';
        lineHtml += '<span class="ek-diff-content">';

        if (!tokens || tokens.length === 0) {
            lineHtml += '<span class="var-omit"><em>[Satır nüshada mefkuddur / om.]</em></span>';
        } else {
            tokens.forEach(function(t) {
                lineHtml += escapeHtml(t.raw) + ' ';
            });
        }
        lineHtml += '</span></div>';
        return lineHtml;
    }

    /**
     * İstatistik Özetini Günceller
     */
    function renderStats(stats) {
        if (!stats) return;
        var elTotalWords = document.getElementById('statTotalWords');
        var elTotalVariants = document.getElementById('statTotalVariants');
        var elSubst = document.getElementById('statSubst');
        var elOmit = document.getElementById('statOmit');
        var elAdd = document.getElementById('statAdd');
        var elAgreementB = document.getElementById('statAgreementB');
        var elAgreementC = document.getElementById('statAgreementC');

        if (elTotalWords) elTotalWords.textContent = stats.totalWords;
        if (elTotalVariants) elTotalVariants.textContent = stats.totalVariants;
        if (elSubst) elSubst.textContent = stats.substitutions;
        if (elOmit) elOmit.textContent = stats.omissions;
        if (elAdd) elAdd.textContent = stats.additions;
        if (elAgreementB) elAgreementB.textContent = '%' + stats.witBAgreement;
        if (elAgreementC) elAgreementC.textContent = '%' + stats.witCAgreement;
    }

    function updateWordStats() {
        var ta = document.getElementById('textWitnessA');
        if (!ta) return;
        var words = ta.value.trim().split(/\s+/).filter(Boolean).length;
        var lines = ta.value.split('\n').filter(Boolean).length;
        var footerA = document.getElementById('footerWitnessA');
        if (footerA) footerA.textContent = lines + ' Mısra / ' + words + ' Kelime';
    }

    /**
     * Editör ve Varyant Görünüm Sekmeleri
     */
    function setupTabButtons() {
        var tabBtns = document.querySelectorAll('.ek-card-tab');
        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetId = this.getAttribute('data-target');
                var viewType = this.getAttribute('data-view'); // 'edit' or 'diff'
                var card = this.closest('.ek-witness-card');
                if (!card) return;

                // Buton aktifliği
                card.querySelectorAll('.ek-card-tab').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                // Alan görünürlüğü
                var textarea = card.querySelector('.ek-witness-textarea');
                var diffview = card.querySelector('.ek-witness-diffview');

                if (viewType === 'diff') {
                    if (textarea) textarea.style.display = 'none';
                    if (diffview) {
                        diffview.classList.add('active');
                        diffview.style.display = 'block';
                    }
                } else {
                    if (diffview) {
                        diffview.classList.remove('active');
                        diffview.style.display = 'none';
                    }
                    if (textarea) textarea.style.display = 'block';
                }
            });
        });
    }

    /**
     * Senkron Kaydırma (Sync Scroll)
     */
    function setupSyncScroll() {
        var scrollables = document.querySelectorAll('.ek-witness-textarea, .ek-witness-diffview');
        var isSyncing = false;

        scrollables.forEach(function(element) {
            element.addEventListener('scroll', function() {
                if (!isSyncScrollEnabled || isSyncing) return;
                isSyncing = true;
                var scrollTop = this.scrollTop;
                var scrollHeight = this.scrollHeight - this.clientHeight;
                var percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

                scrollables.forEach(function(other) {
                    if (other !== element && other.offsetParent !== null) {
                        var otherMax = other.scrollHeight - other.clientHeight;
                        other.scrollTop = percentage * otherMax;
                    }
                });

                setTimeout(function() { isSyncing = false; }, 20);
            });
        });
    }

    /**
     * Dışa Aktarma Fonksiyonları (Word, TEI-XML, JSON)
     */
    function exportWordDoc() {
        if (!window.EdisyonKritikEngine) return;
        var meta = window.EdisyonKritikEngine.currentProject;
        var docHtml = window.EdisyonKritikEngine.exportToWordHtml(meta);
        var blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
        downloadBlob(blob, (meta.title || 'edisyon_kritik') + '_bitigey.doc');
        showToast('Word (.doc) dosyası dipnotlu olarak indirildi.');
    }

    function exportTeiXml() {
        if (!window.EdisyonKritikEngine) return;
        var meta = window.EdisyonKritikEngine.currentProject;
        var xmlContent = window.EdisyonKritikEngine.exportToTeiXml(meta);
        var blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
        downloadBlob(blob, (meta.title || 'tei_edition') + '_tei.xml');
        showToast('TEI-XML (Digital Humanities) standardı dosyası indirildi.');
    }

    function exportLatexDoc() {
        if (!window.EdisyonKritikEngine) return;
        var meta = window.EdisyonKritikEngine.currentProject;
        var content = window.EdisyonKritikEngine.exportToLatex(meta);
        var blob = new Blob([content], { type: 'application/x-latex;charset=utf-8' });
        downloadBlob(blob, (meta.title || 'edisyon_kritik') + '_reledmac.tex');
        showToast('LaTeX (reledmac) akademik kaynak dosyası (.tex) indirildi.');
    }

    function exportCsvDoc() {
        if (!window.EdisyonKritikEngine) return;
        var meta = window.EdisyonKritikEngine.currentProject;
        var content = window.EdisyonKritikEngine.exportToCsv(meta);
        var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        downloadBlob(blob, (meta.title || 'varyant_tablosu') + '_matris.csv');
        showToast('Excel / CSV varyant tahlil tablosu (.csv) indirildi.');
    }

    function exportTxtDoc() {
        if (!window.EdisyonKritikEngine) return;
        var meta = window.EdisyonKritikEngine.currentProject;
        var content = window.EdisyonKritikEngine.exportToPlainText(meta);
        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        downloadBlob(blob, (meta.title || 'tenkitli_metin') + '_aparat.txt');
        showToast('Düz metin ve dipnot dökümü (.txt) indirildi.');
    }

    var currentEditorFontSize = 17;
    function changeFontSize(delta) {
        currentEditorFontSize += delta;
        if (currentEditorFontSize < 13) currentEditorFontSize = 13;
        if (currentEditorFontSize > 28) currentEditorFontSize = 28;
        document.documentElement.style.setProperty('--editor-font-size', currentEditorFontSize + 'px');
        showToast('Yazı boyutu: ' + currentEditorFontSize + 'px');
    }

    function exportJsonProject() {
        var projectData = {
            version: "1.0",
            savedAt: new Date().toISOString(),
            meta: window.EdisyonKritikEngine.currentProject,
            witnesses: {
                textA: document.getElementById('textWitnessA').value,
                textB: document.getElementById('textWitnessB').value,
                textC: document.getElementById('textWitnessC').value,
                textD: document.getElementById('textWitnessD') ? document.getElementById('textWitnessD').value : ''
            }
        };
        var blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        downloadBlob(blob, 'bitigey_proje_' + Date.now() + '.json');
        showToast('Proje yedeği JSON formatında kaydedildi.');
    }

    function importJsonProject(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(evt) {
            try {
                var data = JSON.parse(evt.target.result);
                if (data.meta) {
                    document.getElementById('projTitle').value = data.meta.title || '';
                    document.getElementById('projAuthor').value = data.meta.author || '';
                    document.getElementById('witnessAName').value = data.meta.baseWitness || '';
                    document.getElementById('witnessBName').value = data.meta.witnessBName || '';
                    document.getElementById('witnessCName').value = data.meta.witnessCName || '';
                }
                if (data.witnesses) {
                    document.getElementById('textWitnessA').value = data.witnesses.textA || '';
                    document.getElementById('textWitnessB').value = data.witnesses.textB || '';
                    document.getElementById('textWitnessC').value = data.witnesses.textC || '';
                    if (document.getElementById('textWitnessD')) {
                        document.getElementById('textWitnessD').value = data.witnesses.textD || '';
                    }
                }
                runCollation();
                showToast('Proje başarıyla içe aktarıldı.');
            } catch (err) {
                showToast('Hata: JSON dosyası okunamadı.');
            }
        };
        reader.readAsText(file);
    }

    function copyFullApparatusToClipboard() {
        var engine = window.EdisyonKritikEngine;
        if (!engine || !engine.collationResult || !engine.collationResult.apparatusNotes) {
            showToast('Önce varyant analizini çalıştırınız.');
            return;
        }

        var lines = [];
        var meta = engine.currentProject;
        lines.push('=== ELEŞTİREL APARAT (APPARATUS CRITICUS) ===');
        lines.push('Eser: ' + (meta.title || '') + ' — ' + (meta.author || ''));
        lines.push('Esas Nüsha: ' + (meta.baseWitness || 'A'));
        lines.push('');

        engine.collationResult.apparatusNotes.forEach(function(item, idx) {
            var num = idx + 1;
            lines.push('[' + num + '] ' + item.coord + ' ' + item.apparatusText);
        });

        lines.push('');
        lines.push('Bitigey Edisyon Kritik & Varyant Tezgahı (contact@bitigey.com)');

        navigator.clipboard.writeText(lines.join('\n')).then(function() {
            showToast('Aparatın tamamı panoya kopyalandı.');
        }).catch(function() {
            showToast('Kopyalama başarısız oldu.');
        });
    }

    function copySingleApp(num) {
        var engine = window.EdisyonKritikEngine;
        if (!engine || !engine.collationResult) return;
        var note = engine.collationResult.apparatusNotes[num - 1];
        if (!note) return;

        var text = '[' + num + '] ' + note.coord + ' ' + note.apparatusText;
        navigator.clipboard.writeText(text).then(function() {
            showToast('Dipnot [' + num + '] kopyalandı.');
        });
    }

    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showToast(msg) {
        var toast = document.getElementById('ekToast');
        if (!toast) return;
        toast.innerHTML = '<i class="fa-solid fa-circle-info" style="color:var(--accent-gold);"></i> ' + escapeHtml(msg);
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function() {
            toast.classList.remove('show');
        }, 3200);
    }

    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Dışarıya fonksiyon sağla
    window.BitigeyEKUI = {
        copySingleApp: copySingleApp,
        runCollation: runCollation,
        showToast: showToast
    };

})();
