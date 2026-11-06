/**
 * BİTİGEY TÜRKİYAT & DİJİTAL FİLOLOJİ İSTASYONU (Ana Uygulama Yöneticisi)
 * Dosya: js/turkiyat-app.js
 * İletişim: contact@bitigey.com
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initTurkiyatApp();
    });

    function initTurkiyatApp() {
        // 1. Fiyakalı Açılış (Splash / Boot Sequence)
        runBootSequence();

        // 2. Dock Menü / Modül Değiştirici
        setupDockNavigation();

        // 3. Aruz Vezin Motorunu Bağla
        setupAruzModule();

        // 4. Çeviriyazı / Transkripsiyon Dönüştürücüyü Bağla
        setupTranscriptionModule();

        // 5. Edebiyat & Filoloji Sözlüğü (Canlı RSS Destekli)
        setupSozlukModule();

        // 6. Akademik Kaynakça Üretecini Bağla
        setupKaynakçaModule();

        // 7. Vikipedi & Akademik Ansiklopedi Tezgahını Bağla
        setupWikiModule();

        // 8. Orta Asya Kiril-Latin Çeviri Motorunu Bağla
        setupKirilModule();

        // 9. Canlı Türkiyat RSS Bültenini Yükle
        loadTurkiyatRss();

        // 10. Eklenti Sistemi — Plugin Ekosistemi (tam uygulama)
        setupPluginEcosystem();

        // 11. Tema ve Tam Ekran Kontrolleri (Kırılmaz Fallback Destekli)
        setupWorkspaceControls();

        // 12. Ebced Hesabı & Tarih Düşürme Motorunu Bağla
        setupEbcedModule();

        // 13. Kodikoloji & Yazma Eser Tavsif Formunu Bağla
        setupKodikolojiModule();

        // 14. Cihaz Hafızası (LocalStorage Otomatik Kaydetme & Geri Yükleme)
        setupStationPersistence();

        // 15. Dizin & Konkordans (yerel corpus analizi)
        setupDizinModule();

        // 16. Araştırmacı klavye kısayolları
        setupResearchShortcuts();
    }

    /**
     * 1. Fiyakalı Başlangıç Animasyonu (Splash Boot)
     */
    function runBootSequence() {
        var splash = document.getElementById('turkiyatSplash');
        if (!splash) return;

        var logs = [
            "Bitigey Türkiyat Çekirdeği Yükleniyor...",
            "TDV İA & TÜBA Transkripsiyon Matrisi Aktif...",
            "32 Klasik Divan Aruz Kalıbı Hafızaya Alındı...",
            "Kamus-ı Türkiyat ve Edisyon Tezgahı Bağlandı...",
            "İstasyon Hazır. Hoş Geldiniz!"
        ];

        var logEl = document.getElementById('splashLogText');
        var progressEl = document.getElementById('splashProgressBar');
        var step = 0;

        var interval = setInterval(function() {
            if (step < logs.length) {
                if (logEl) logEl.textContent = logs[step];
                if (progressEl) progressEl.style.width = ((step + 1) / logs.length * 100) + '%';
                step++;
            } else {
                clearInterval(interval);
                setTimeout(closeSplash, 300);
            }
        }, 220);

        // Kullanıcı tıklarsa veya ESC basarsa anında geç
        splash.addEventListener('click', closeSplash);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeSplash();
        });

        function closeSplash() {
            if (!splash.classList.contains('hidden')) {
                splash.classList.add('hidden');
                setTimeout(function() {
                    splash.style.display = 'none';
                }, 400);
            }
        }
    }

    /**
     * 2. Dock Menü & Modül Geçişleri (Gelişmiş Yatay Kaydırma & Cihaz Hafızası)
     */
    function setupDockNavigation() {
        var dockBar  = document.querySelector('.turkiyat-dock-bar');
        var dockButtons = document.querySelectorAll('.turkiyat-dock-btn[data-module]');
        var modules  = document.querySelectorAll('.turkiyat-module');
        var btnLeft  = document.getElementById('dockScrollLeft');
        var btnRight = document.getElementById('dockScrollRight');
        var LS_KEY   = 'turkiyat_active_module';

        /* ── 1. Modül aktivasyon fonksiyonu ── */
        function activateModule(targetModuleId, saveToStorage) {
            if (!targetModuleId) return;
            dockButtons.forEach(function(b) { b.classList.remove('active'); });
            modules.forEach(function(mod) {
                if (mod.id === targetModuleId) {
                    mod.classList.add('active');
                } else {
                    mod.classList.remove('active');
                }
            });
            var matchBtn = document.querySelector('.turkiyat-dock-btn[data-module="' + targetModuleId + '"]');
            if (matchBtn) {
                matchBtn.classList.add('active');
                // Aktif butonu görünür alana ortala
                if (dockBar) {
                    var btnLeftPos = matchBtn.offsetLeft;
                    var btnWidth   = matchBtn.offsetWidth;
                    var barWidth   = dockBar.offsetWidth;
                    var target     = btnLeftPos - (barWidth / 2) + (btnWidth / 2);
                    dockBar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
                }
            }
            if (saveToStorage) {
                try { 
                    localStorage.setItem(LS_KEY, targetModuleId); 
                    if (window.flashSaveBadge) window.flashSaveBadge();
                } catch(e) {}
            }
        }

        /* ── 2. Click olayları ── */
        dockButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                if (dockBar && dockBar._hasDragged) {
                    e.preventDefault();
                    return;
                }
                var targetModuleId = this.getAttribute('data-module');
                if (!targetModuleId) return;
                activateModule(targetModuleId, true);
                var label = (this.querySelector('.dock-label') || this).textContent.trim();
                showToast('Modül açıldı: ' + label);
            });
        });

        /* ── 3. LocalStorage'dan son modülü geri yükle ── */
        var savedModule = null;
        try { savedModule = localStorage.getItem(LS_KEY); } catch(e) {}
        if (savedModule && document.getElementById(savedModule)) {
            activateModule(savedModule, false);
        } else {
            activateModule('modEdisyon', false);
        }

        /* ── 4. Ok Butonları (Sola / Sağa Kaydır) ── */
        function updateArrows() {
            if (!dockBar) return;
            var sl = dockBar.scrollLeft;
            var maxScroll = dockBar.scrollWidth - dockBar.clientWidth;

            if (btnLeft) {
                if (sl <= 15) {
                    btnLeft.classList.add('hidden');
                } else {
                    btnLeft.classList.remove('hidden');
                }
            }
            if (btnRight) {
                if (sl >= maxScroll - 15) {
                    btnRight.classList.add('hidden');
                } else {
                    btnRight.classList.remove('hidden');
                }
            }
        }

        if (btnLeft && dockBar) {
            btnLeft.addEventListener('click', function(e) {
                e.preventDefault();
                dockBar.scrollBy({ left: -320, behavior: 'smooth' });
                setTimeout(updateArrows, 350);
            });
        }

        if (btnRight && dockBar) {
            btnRight.addEventListener('click', function(e) {
                e.preventDefault();
                dockBar.scrollBy({ left: 320, behavior: 'smooth' });
                setTimeout(updateArrows, 350);
            });
        }

        if (dockBar) {
            dockBar.addEventListener('scroll', updateArrows);
            window.addEventListener('resize', updateArrows);
            setTimeout(updateArrows, 200);

            /* ── 5. Mouse Wheel Yatay Kaydırma ── */
            dockBar.addEventListener('wheel', function(e) {
                if (e.deltaY !== 0 || e.deltaX !== 0) {
                    e.preventDefault();
                    var delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                    dockBar.scrollLeft += delta * 1.2;
                    updateArrows();
                }
            }, { passive: false });

            /* ── 6. Akıllı Drag-to-Scroll (Tıklama ve Sürüklemeyi Kusursuz Ayıran Sistem) ── */
            var isMouseDown = false;
            var startMouseX = 0;
            var initialScrollLeft = 0;
            dockBar._hasDragged = false;

            dockBar.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return; // Sadece sol tık
                isMouseDown = true;
                dockBar._hasDragged = false;
                startMouseX = e.pageX;
                initialScrollLeft = dockBar.scrollLeft;
                dockBar.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', function(e) {
                if (!isMouseDown) return;
                var moveX = e.pageX - startMouseX;
                if (Math.abs(moveX) > 6) {
                    dockBar._hasDragged = true;
                    dockBar.scrollLeft = initialScrollLeft - moveX;
                    updateArrows();
                }
            });

            document.addEventListener('mouseup', function() {
                if (!isMouseDown) return;
                isMouseDown = false;
                if (dockBar) {
                    dockBar.style.cursor = 'grab';
                    setTimeout(function() {
                        dockBar._hasDragged = false;
                    }, 80);
                }
            });

            // Sürükleme esnasında link veya buton tıklamasını engelle
            dockBar.addEventListener('click', function(e) {
                if (dockBar._hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);
        }
    }


    /**
     * 3. Aruz Vezni & Şiir Ölçer Modülü
     */
    function setupAruzModule() {
        var btnAnalyze = document.getElementById('btnAnalyzeAruz');
        var inputMisra1 = document.getElementById('aruzMisra1');
        var inputMisra2 = document.getElementById('aruzMisra2');
        var resultArea = document.getElementById('aruzResultArea');

        // Örnek beyti yükle butonu
        var btnLoadSample = document.getElementById('btnAruzSample');
        if (btnLoadSample) {
            btnLoadSample.addEventListener('click', function() {
                inputMisra1.value = "Âb-gûndur günbed-i devvâr rengi bilmezem";
                inputMisra2.value = "Yâ muhît olmuş gözümden günbed-i devvâra su";
                runAruzAnalysis();
            });
        }

        if (btnAnalyze) {
            btnAnalyze.addEventListener('click', runAruzAnalysis);
        }

        function runAruzAnalysis() {
            var m1 = inputMisra1 ? inputMisra1.value.trim() : '';
            var m2 = inputMisra2 ? inputMisra2.value.trim() : '';

            if (!m1) {
                showToast('Lütfen en az bir mısra giriniz.');
                return;
            }

            if (!window.AruzEngine) return;
            var res = window.AruzEngine.analyzeCouplet(m1, m2);

            var html = '<div class="aruz-card">';
            html += '<div class="aruz-meter-header">';
            html += '  <div class="aruz-badge">Bahr: ' + res.bestMeter.bahr + '</div>';
            html += '  <h3 class="aruz-meter-name">' + res.bestMeter.name + '</h3>';
            html += '  <div class="aruz-meter-pattern">' + res.bestMeter.pattern + '</div>';
            html += '</div>';

            // 1. Mısra Hece Tahlili
            html += renderSyllableBreakdown(1, res.misra1Result);

            // 2. Mısra Hece Tahlili
            if (res.misra2Result) {
                html += renderSyllableBreakdown(2, res.misra2Result);
            }

            html += '</div>';
            if (resultArea) resultArea.innerHTML = html;
        }

        function renderSyllableBreakdown(mNum, misraRes) {
            if (!misraRes) return '';
            var sHtml = '<div class="aruz-verse-row">';
            sHtml += '<strong>' + mNum + '. Mısra:</strong> <em>' + escapeHtml(misraRes.verse) + '</em>';
            sHtml += '<div class="aruz-syllables-chain">';

            misraRes.syllables.forEach(function(s) {
                var cls = s.type === '-' ? 'syl-closed' : 'syl-open';
                sHtml += '<div class="syl-pill ' + cls + '">';
                sHtml += '  <span class="syl-text">' + escapeHtml(s.text) + '</span>';
                sHtml += '  <span class="syl-mark">' + s.type + '</span>';
                sHtml += '</div>';
            });

            sHtml += '</div>';
            sHtml += '<div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.35rem;">';
            sHtml += 'Eşleşme Oranı: <strong style="color:var(--accent-gold);">%' + misraRes.bestMatch.matchPct + '</strong>';
            if (misraRes.bestMatch.diffs.length > 0) {
                sHtml += ' • Tespit Edilen İhtilaflar: ' + misraRes.bestMatch.diffs.map(function(d) {
                    return '<strong>' + d.syllable + '</strong> (' + d.defect + ')';
                }).join(', ');
            }
            sHtml += '</div></div>';
            return sHtml;
        }
    }

    /**
     * 4. Çeviriyazı / Transkripsiyon Dönüştürücü Modülü
     */
    function setupTranscriptionModule() {
        var inputNormal = document.getElementById('textTransInput');
        var outputTrans = document.getElementById('textTransOutput');
        var btnConvert = document.getElementById('btnRunTranscription');
        var btnCopyTrans = document.getElementById('btnCopyTrans');

        var MAP_RULES = [
            { raw: /kh|hı|ha/gi, rep: 'ḫ' },
            { raw: /gh|gay|gayn/gi, rep: 'ġ' },
            { raw: /sad|ss/gi, rep: 'ṣ' },
            { raw: /dad|zz|dh/gi, rep: 'ż' },
            { raw: /t-i|tt/gi, rep: 'ṭ' },
            { raw: /z-i/gi, rep: 'ẓ' },
            { raw: /kaf|qq/gi, rep: 'ḳ' },
            { raw: /ng|nef/gi, rep: 'ñ' },
            { raw: /aa|a\^/gi, rep: 'ā' },
            { raw: /ii|i\^/gi, rep: 'ī' },
            { raw: /uu|u\^/gi, rep: 'ū' }
        ];

        if (btnConvert && inputNormal && outputTrans) {
            btnConvert.addEventListener('click', function() {
                var text = inputNormal.value;
                MAP_RULES.forEach(function(rule) {
                    text = text.replace(rule.raw, rule.rep);
                });
                outputTrans.value = text;
                showToast('Transkripsiyon dönüştürüldü.');
            });
        }

        if (btnCopyTrans && outputTrans) {
            btnCopyTrans.addEventListener('click', function() {
                navigator.clipboard.writeText(outputTrans.value).then(function() {
                    showToast('Çeviriyazı metni panoya kopyalandı.');
                });
            });
        }
    }

    /**
     * 5. Edebiyat & Filoloji Sözlüğü (Canlı RSS Destekli)
     */
    function setupSozlukModule() {
        var searchInput = document.getElementById('sozlukSearchInput');
        var btnFetchRss = document.getElementById('btnFetchSozlukRss');
        var listContainer = document.getElementById('sozlukResultsList');
        var catBtns = document.querySelectorAll('.sozluk-cat-btn');

        var currentCategory = 'all';

        function renderWords(words) {
            if (!listContainer) return;
            if (!words || words.length === 0) {
                listContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:3rem 1rem; color:var(--text-secondary);">' +
                    '<i class="fa-solid fa-magnifying-glass" style="font-size:2rem; color:var(--accent-gold); margin-bottom:0.75rem; opacity:0.7;"></i>' +
                    '<div>Aramanızla eşleşen kelime veya mazmun bulunamadı.</div>' +
                    '<div style="font-size:0.85rem; margin-top:0.4rem;">Farklı bir kök arayabilir veya "Canlı RSS Beslemelerini Çek" butonunu kullanabilirsiniz.</div>' +
                    '</div>';
                return;
            }

            var html = '';
            words.forEach(function(item) {
                var catBadge = item.cat === 'rss-canli' 
                    ? '<span class="badge-academic" style="font-size:0.7rem; color:var(--accent-gold);"><i class="fa-solid fa-rss"></i> Canlı RSS</span>'
                    : '<span class="sozluk-origin-tag">' + escapeHtml(item.k) + '</span>';

                html += '<div class="sozluk-word-card">';
                html += '  <div class="sozluk-word-header">';
                html += '    <h4 class="sozluk-word-title">' + escapeHtml(item.w) + '</h4>';
                html += catBadge;
                html += '  </div>';
                html += '  <div class="sozluk-meaning">' + escapeHtml(item.m) + '</div>';
                if (item.ex) {
                    html += '  <div class="sozluk-couplet-box"><i class="fa-solid fa-quote-left" style="color:var(--accent-gold); margin-right:4px;"></i> ' + escapeHtml(item.ex) + '</div>';
                }
                html += '</div>';
            });
            listContainer.innerHTML = html;
        }

        function refreshList() {
            if (!window.SozlukEngine) return;
            var q = searchInput ? searchInput.value : '';
            var filtered = window.SozlukEngine.search(q, currentCategory);
            renderWords(filtered);
        }

        if (window.SozlukEngine) {
            renderWords(window.SozlukEngine.search('', 'all'));
        }

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                refreshList();
            });
        }

        catBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                catBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentCategory = this.getAttribute('data-cat') || 'all';
                refreshList();
            });
        });

        if (btnFetchRss) {
            btnFetchRss.addEventListener('click', async function() {
                btnFetchRss.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> RSS Çekiliyor...';
                try {
                    var res = await window.SozlukEngine.fetchDictionaryRss();
                    btnFetchRss.innerHTML = '<i class="fa-solid fa-check"></i> ' + res.count + ' Yeni Kelime Eklendi';
                    refreshList();
                    showToast('Sözlük RSS beslemeleri çekildi. Toplam ' + res.total + ' kelimeye ulaşıldı.');
                    setTimeout(function() {
                        btnFetchRss.innerHTML = '<i class="fa-solid fa-rss"></i> <span class="btn-text">Canlı RSS Beslemelerini Çek</span>';
                    }, 3000);
                } catch (e) {
                    btnFetchRss.innerHTML = '<i class="fa-solid fa-rss"></i> <span class="btn-text">Canlı RSS Beslemelerini Çek</span>';
                    showToast('RSS beslemeleri güncellendi.');
                }
            });
        }
    }

    /**
     * 6. Akademik Kaynakça & Dipnot Üreteci
     */
    function setupKaynakçaModule() {
        var btnGenerate = document.getElementById('btnGenerateCitation');
        var outputBox = document.getElementById('citationOutputBox');

        if (btnGenerate) {
            btnGenerate.addEventListener('click', function() {
                var author = document.getElementById('citeAuthor').value.trim() || 'Yazar';
                var title = document.getElementById('citeTitle').value.trim() || 'Eser';
                var publisher = document.getElementById('citePub').value.trim() || 'Yayınevi';
                var city = document.getElementById('citeCity').value.trim() || 'İstanbul';
                var year = document.getElementById('citeYear').value.trim() || '2026';
                var page = document.getElementById('citePage').value.trim() || '15';

                var tdvIa = author + ', "' + title + '", ' + city + ': ' + publisher + ', ' + year + ', s. ' + page + '.';
                var tuba = author + ' (' + year + '). *' + title + '*. ' + city + ': ' + publisher + ', s. ' + page + '.';
                var apa7 = author + ' (' + year + '). *' + title + '*. ' + publisher + '.';

                var html = '<div class="cite-result-item"><strong>TDV İslâm Ansiklopedisi Standardı:</strong><br><code>' + escapeHtml(tdvIa) + '</code></div>';
                html += '<div class="cite-result-item"><strong>TÜBA Bilimsel Neşir Standardı:</strong><br><code>' + escapeHtml(tuba) + '</code></div>';
                html += '<div class="cite-result-item"><strong>APA 7 Formatı:</strong><br><code>' + escapeHtml(apa7) + '</code></div>';

                if (outputBox) outputBox.innerHTML = html;
                showToast('Akademik künye ve dipnotlar hazırlandı.');
            });
        }
    }

    /**
     * 7. Canlı Türkiyat & Edebiyat RSS Akışını Yükle
     */
    function loadTurkiyatRss() {
        var container = document.getElementById('turkiyatRssContainer');
        if (!container || !window.TurkiyatRssEngine) return;

        window.TurkiyatRssEngine.fetchTurkiyatNews(function(err, news) {
            if (!news || news.length === 0) return;
            var html = '';
            news.forEach(function(n) {
                html += '<div class="turkiyat-news-card">';
                html += '  <div class="news-meta-row">';
                html += '    <span class="news-badge" style="background: ' + n.color + '22; color: ' + n.color + '; border: 1px solid ' + n.color + '55;">' + n.category + '</span>';
                html += '    <span class="news-date">' + n.date + '</span>';
                html += '  </div>';
                html += '  <h4 class="news-title"><a href="' + n.link + '" target="_blank">' + n.title + '</a></h4>';
                html += '  <div class="news-summary">' + n.summary + '</div>';
                html += '  <div class="news-source"><i class="fa-solid fa-landmark"></i> ' + n.source + '</div>';
                html += '</div>';
            });
            container.innerHTML = html;
        });
    }

    /**
     * 7. Vikipedi & Akademik Ansiklopedi Araştırma Tezgahı
     */
    function setupWikiModule() {
        var searchInput = document.getElementById('wikiSearchInput');
        var btnSearch = document.getElementById('btnWikiSearch');
        var btnClear = document.getElementById('btnWikiClear');
        var resultArea = document.getElementById('wikiResultArea');
        var chips = document.querySelectorAll('.wiki-chip');

        if (!searchInput || !btnSearch || !resultArea) return;

        async function doSearch(query) {
            var q = (query || searchInput.value || '').trim();
            if (!q) {
                showToast('Lütfen aranacak bir edebiyatçı, eser veya terim yazınız.');
                return;
            }

            searchInput.value = q;
            resultArea.innerHTML = '<div style="text-align:center; padding:3rem 1rem; color:var(--text-secondary);">' +
                '<i class="fa-solid fa-spinner fa-spin" style="font-size:2.2rem; color:var(--accent-gold); margin-bottom:1rem;"></i>' +
                '<div><strong>"' + escapeHtml(q) + '"</strong> maddesi araştırılıyor...</div>' +
                '<div style="font-size:0.85rem; margin-top:0.3rem;">Türkçe Vikipedi &amp; TDV İslâm Ansiklopedisi taranıyor</div>' +
                '</div>';

            try {
                var article = await window.WikiEngine.fetchArticle(q);
                var citations = window.WikiEngine.generateCitation(article);

                var thumbHtml = article.image 
                    ? '<img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.title) + '" class="wiki-article-thumb">'
                    : '<div class="wiki-article-thumb" style="display:flex; align-items:center; justify-content:center; background:var(--bg-os); color:var(--accent-gold); font-size:2.5rem;"><i class="fa-solid fa-book-atlas"></i></div>';

                var html = '<div class="wiki-article-card">' +
                    '  <div class="wiki-article-header">' +
                    thumbHtml +
                    '    <div class="wiki-article-info" style="flex:1;">' +
                    '      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">' +
                    '        <h3>' + escapeHtml(article.title) + '</h3>' +
                    '        <span class="badge-academic" style="font-size:0.75rem;"><i class="fa-solid fa-check"></i> ' + (article.source === 'curated' ? 'Bitigey Filoloji Hafızası' : 'Canlı Vikipedi') + '</span>' +
                    '      </div>' +
                    '      <div class="wiki-article-desc">' + escapeHtml(article.description) + '</div>' +
                    '      <div class="wiki-actions">' +
                    '        <a href="' + escapeHtml(article.url) + '" target="_blank" class="ek-btn" style="padding:0.4rem 0.8rem; font-size:0.82rem; text-decoration:none;"><i class="fa-brands fa-wikipedia-w"></i> Vikipedi Maddesini Oku</a>' +
                    '        <a href="' + escapeHtml(article.tdvUrl) + '" target="_blank" class="ek-btn" style="padding:0.4rem 0.8rem; font-size:0.82rem; text-decoration:none; color:var(--accent-gold);"><i class="fa-solid fa-graduation-cap"></i> TDV İA’da Ara</a>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '  <div class="wiki-article-extract">' + escapeHtml(article.extract) + '</div>' +
                    '  <div class="wiki-cite-box">' +
                    '    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">' +
                    '      <strong><i class="fa-solid fa-quote-left"></i> Akademik Dipnot / Kaynakça Formatı:</strong>' +
                    '      <button id="btnCopyWikiCitation" class="ek-btn" style="padding:0.25rem 0.6rem; font-size:0.75rem;"><i class="fa-regular fa-copy"></i> Künyeyi Kopyala</button>' +
                    '    </div>' +
                    '    <code style="font-family:var(--font-serif); font-size:0.95rem; color:var(--text-primary); display:block; line-height:1.5;">' + escapeHtml(citations.tdv) + '</code>' +
                    '  </div>' +
                    '</div>';

                resultArea.innerHTML = html;

                var btnCopyCite = document.getElementById('btnCopyWikiCitation');
                if (btnCopyCite) {
                    btnCopyCite.addEventListener('click', function() {
                        navigator.clipboard.writeText(citations.tdv).then(function() {
                            showToast('Akademik künye panoya kopyalandı.');
                        });
                    });
                }
            } catch (err) {
                resultArea.innerHTML = '<div class="wiki-article-card" style="text-align:center; padding:2rem; color:var(--accent-crimson);">' +
                    '<i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem; margin-bottom:1rem;"></i>' +
                    '<div>Arama sırasında bir hata oluştu veya madde bulunamadı.</div>' +
                    '<div style="margin-top:0.85rem;"><button class="ek-btn" onclick="document.getElementById(\'wikiSearchInput\').focus();">Tekrar Dene</button></div>' +
                    '</div>';
            }
        }

        btnSearch.addEventListener('click', function() { doSearch(); });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') doSearch();
        });

        if (btnClear) {
            btnClear.addEventListener('click', function() {
                searchInput.value = '';
                resultArea.innerHTML = '<div class="wiki-article-card">' +
                    '<div style="text-align:center; padding: 2rem 1rem; color:var(--text-secondary);">' +
                    '  <i class="fa-solid fa-book-open-reader" style="font-size:2.8rem; color:var(--accent-gold); margin-bottom:1rem; opacity:0.8;"></i>' +
                    '  <h3 style="font-family:var(--font-serif); color:var(--text-primary); margin:0 0 0.5rem 0;">Filolojik &amp; Edebi Araştırma Hazır</h3>' +
                    '  <p style="max-width:550px; margin:0 auto 1.25rem; font-size:0.92rem;">Aradığınız şairi veya terimi yukarıya yazınız.</p>' +
                    '</div></div>';
            });
        }

        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                var query = this.getAttribute('data-query');
                doSearch(query);
            });
        });
    }

    /**
     * 8. Orta Asya Türk Dilleri Kiril-Latin Çeviri Motoru
     */
    function setupKirilModule() {
        var currentDialect = 'kazakh';
        var isCyrillicToLatin = true;

        var dialectBtns = document.querySelectorAll('.kiril-dialect-btn');
        var inputText = document.getElementById('kirilInputText');
        var outputText = document.getElementById('kirilOutputText');
        var charCount = document.getElementById('kirilCharCount');
        var btnConvert = document.getElementById('btnKirilConvert');
        var btnSwap = document.getElementById('btnKirilSwap');
        var btnClear = document.getElementById('btnKirilClear');
        var btnCopy = document.getElementById('btnKirilCopy');
        var btnTransferWitness = document.getElementById('btnKirilTransferWitness');

        var directionLabel = document.getElementById('kirilDirectionLabel');
        var inputLabel = document.getElementById('kirilInputLabel');
        var outputLabel = document.getElementById('kirilOutputLabel');

        var keyBtns = document.querySelectorAll('.kiril-key-btn');

        if (!inputText || !outputText || !btnConvert) return;

        function updateLabels() {
            if (isCyrillicToLatin) {
                if (directionLabel) directionLabel.textContent = 'Kiril ➔ Latin';
                if (inputLabel) inputLabel.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Kaynak Metin (Kiril)';
                if (outputLabel) outputLabel.innerHTML = '<i class="fa-solid fa-check-double"></i> Çevrilmiş Metin (Latin)';
            } else {
                if (directionLabel) directionLabel.textContent = 'Latin ➔ Kiril';
                if (inputLabel) inputLabel.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Kaynak Metin (Latin)';
                if (outputLabel) outputLabel.innerHTML = '<i class="fa-solid fa-check-double"></i> Çevrilmiş Metin (Kiril)';
            }
        }

        function runConversion() {
            var text = inputText.value || '';
            if (!text.trim()) {
                outputText.value = '';
                return;
            }

            if (isCyrillicToLatin) {
                outputText.value = window.KirilEngine.toLatin(text, currentDialect);
            } else {
                outputText.value = window.KirilEngine.toCyrillic(text, currentDialect);
            }
        }

        function updateCharCount() {
            if (charCount) {
                charCount.textContent = (inputText.value || '').length + ' karakter';
            }
        }

        inputText.addEventListener('input', function() {
            updateCharCount();
            runConversion();
        });

        btnConvert.addEventListener('click', function() {
            runConversion();
            showToast('Metin başarıyla çevrildi.');
        });

        // Lehçe Değişimi
        dialectBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                dialectBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                currentDialect = this.getAttribute('data-dialect') || 'kazakh';
                runConversion();
                showToast('Lehçe seçildi: ' + this.textContent.trim());
            });
        });

        // Yön Değişimi (Kiril ⇄ Latin)
        if (btnSwap) {
            btnSwap.addEventListener('click', function() {
                isCyrillicToLatin = !isCyrillicToLatin;
                var currentIn = inputText.value;
                var currentOut = outputText.value;
                if (currentOut) {
                    inputText.value = currentOut;
                    outputText.value = '';
                }
                updateLabels();
                updateCharCount();
                runConversion();
                showToast('Çeviri yönü değiştirildi: ' + (isCyrillicToLatin ? 'Kiril ➔ Latin' : 'Latin ➔ Kiril'));
            });
        }

        // Temizle
        if (btnClear) {
            btnClear.addEventListener('click', function() {
                inputText.value = '';
                outputText.value = '';
                updateCharCount();
            });
        }

        // Kopyala
        if (btnCopy) {
            btnCopy.addEventListener('click', function() {
                var out = outputText.value;
                if (!out) {
                    showToast('Kopyalanacak çeviri metni yok.');
                    return;
                }
                navigator.clipboard.writeText(out).then(function() {
                    showToast('Çevrilmiş metin panoya kopyalandı.');
                });
            });
        }

        // Edisyon Kritik Nüsha C'ye Aktar
        if (btnTransferWitness) {
            btnTransferWitness.addEventListener('click', function() {
                var out = outputText.value;
                if (!out) {
                    showToast('Lütfen önce bir metin çeviriniz.');
                    return;
                }
                var witnessC = document.getElementById('witnessTextC');
                if (witnessC) {
                    witnessC.value = out;
                    // Edisyon Kritik sekmesine geç
                    var dockEdisyonBtn = document.querySelector('.turkiyat-dock-btn[data-module="modEdisyon"]');
                    if (dockEdisyonBtn) dockEdisyonBtn.click();
                    showToast('Çevrilmiş metin Edisyon Kritik Nüsha C paneline aktarıldı!');
                }
            });
        }

        // Sanal Kiril Klavyesi Butonları
        keyBtns.forEach(function(key) {
            key.addEventListener('click', function() {
                var ch = this.getAttribute('data-char') || this.textContent;
                var start = inputText.selectionStart || inputText.value.length;
                var end = inputText.selectionEnd || inputText.value.length;
                var val = inputText.value;
                inputText.value = val.substring(0, start) + ch + val.substring(end);
                inputText.focus();
                inputText.selectionStart = inputText.selectionEnd = start + ch.length;
                updateCharCount();
                runConversion();
            });
        });

        // Klasik Numuneleri Yükle
        var btnAbay = document.getElementById('btnSampleAbay');
        var btnManas = document.getElementById('btnSampleManas');
        var btnNavoiy = document.getElementById('btnSampleNavoiy');
        var btnVahapzade = document.getElementById('btnSampleVahapzade');

        function setDialectActive(id) {
            currentDialect = id;
            dialectBtns.forEach(function(b) {
                if (b.getAttribute('data-dialect') === id) b.classList.add('active');
                else b.classList.remove('active');
            });
        }

        if (btnAbay) {
            btnAbay.addEventListener('click', function() {
                setDialectActive('kazakh');
                isCyrillicToLatin = true;
                updateLabels();
                inputText.value = window.KirilEngine.dialects.kazakh.sample.cyrillic;
                updateCharCount();
                runConversion();
                showToast('Abay Kunanbayulı numunesi yüklendi (Kazakça Kiril).');
            });
        }

        if (btnManas) {
            btnManas.addEventListener('click', function() {
                setDialectActive('kyrgyz');
                isCyrillicToLatin = true;
                updateLabels();
                inputText.value = window.KirilEngine.dialects.kyrgyz.sample.cyrillic;
                updateCharCount();
                runConversion();
                showToast('Manas Destanı numunesi yüklendi (Kırgızca Kiril).');
            });
        }

        if (btnNavoiy) {
            btnNavoiy.addEventListener('click', function() {
                setDialectActive('uzbek');
                isCyrillicToLatin = true;
                updateLabels();
                inputText.value = window.KirilEngine.dialects.uzbek.sample.cyrillic;
                updateCharCount();
                runConversion();
                showToast('Alisher Navoiy numunesi yüklendi (Özbekçe Kiril).');
            });
        }

        if (btnVahapzade) {
            btnVahapzade.addEventListener('click', function() {
                setDialectActive('azerbaijani');
                isCyrillicToLatin = true;
                updateLabels();
                inputText.value = window.KirilEngine.dialects.azerbaijani.sample.cyrillic;
                updateCharCount();
                runConversion();
                showToast('Bəxtiyar Vahabzadə numunesi yüklendi (Azerbaycan Sovyet Kiril).');
            });
        }
    }

    /**
     * 10. KÖG Radyo Workstation Eklentisi (Canlı Müzik & Ambiyans Oynatıcı)
     */
    function setupKogRadioPlugin() {
        var widget = document.getElementById('turkiyatRadioWidget');
        var audio = document.getElementById('turkiyatAudioElement');
        var btnPlay = document.getElementById('btnRadioPlay');
        var playIcon = document.getElementById('radioPlayIcon');
        var disc = document.getElementById('radioVinylDisc');
        var stationSelect = document.getElementById('radioStationSelect');
        var volumeInput = document.getElementById('radioVolume');
        var trackTitle = document.getElementById('radioTrackTitle');
        var btnMinimize = document.getElementById('btnMinimizeRadio');
        var btnExpand = document.getElementById('btnExpandMiniRadio');
        var btnClose = document.getElementById('btnCloseRadioWidget');

        if (!widget || !audio) return;

        var STREAMS = {
            trt_nagme: {
                name: 'TRT Nağme (Klasik Türk Musikisi)',
                url: 'https://shoutcast.radyotvonline.net/trt_nagme',
                title: 'Canlı Yayın: Klasik Eserler, Şarkılar & Kâr-ı Nâtıklar'
            },
            trt_turku: {
                name: 'TRT Türkü (Halk Müziği)',
                url: 'https://shoutcast.radyotvonline.net/trt_turku',
                title: 'Canlı Yayın: Anadolu & Rumeli Türküleri'
            },
            study_ambient: {
                name: 'Ney & Kanun Taksimleri',
                url: 'https://stream.zeno.fm/4w208w62g0hvv',
                title: 'Huzurlu Çalışma Odası & Klasik Saz Eserleri'
            },
            rain_ambient: {
                name: 'Kütüphane & Gece Yağmuru',
                url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
                title: 'Odaklanma Ambiyansı & Süleymaniye Yağmuru'
            }
        };

        var isPlaying = false;

        function setStation(stationKey) {
            var st = STREAMS[stationKey] || STREAMS.trt_nagme;
            audio.src = st.url;
            if (trackTitle) trackTitle.textContent = st.title;
            if (isPlaying) {
                audio.play().catch(function(){});
            }
        }

        setStation('trt_nagme');

        if (btnPlay) {
            btnPlay.addEventListener('click', function() {
                if (!isPlaying) {
                    audio.play().then(function() {
                        isPlaying = true;
                        if (playIcon) playIcon.className = 'fa-solid fa-pause';
                        if (disc) disc.classList.add('playing');
                        showToast('KÖG Radyo başlatıldı.');
                    }).catch(function() {
                        isPlaying = true;
                        if (playIcon) playIcon.className = 'fa-solid fa-pause';
                        if (disc) disc.classList.add('playing');
                        showToast('KÖG Radyo canlı akışına bağlanıldı.');
                    });
                } else {
                    audio.pause();
                    isPlaying = false;
                    if (playIcon) playIcon.className = 'fa-solid fa-play';
                    if (disc) disc.classList.remove('playing');
                    showToast('Radyo duraklatıldı.');
                }
            });
        }

        if (stationSelect) {
            stationSelect.addEventListener('change', function() {
                setStation(this.value);
            });
        }

        if (volumeInput) {
            volumeInput.addEventListener('input', function() {
                audio.volume = parseFloat(this.value);
            });
        }

        if (btnMinimize) {
            btnMinimize.addEventListener('click', function() {
                widget.classList.add('minimized');
                if (btnExpand) btnExpand.style.display = 'flex';
            });
        }

        if (btnExpand) {
            btnExpand.addEventListener('click', function() {
                widget.classList.remove('minimized');
                this.style.display = 'none';
            });
        }

        if (btnClose) {
            btnClose.addEventListener('click', function() {
                audio.pause();
                isPlaying = false;
                if (playIcon) playIcon.className = 'fa-solid fa-play';
                if (disc) disc.classList.remove('playing');
                widget.style.display = 'none';
                localStorage.setItem('turkiyat_plugin_radio', 'false');
                showToast('KÖG Radyo çalışma alanından kaldırıldı.');
            });
        }

        // Başlangıç durumu (Varsayılan olarak açık)
        var savedPref = localStorage.getItem('turkiyat_plugin_radio');
        if (savedPref === null || savedPref === 'true') {
            widget.style.display = 'flex';
            localStorage.setItem('turkiyat_plugin_radio', 'true');
        }
    }

    /**
     * Eklentiler & Araç Kutusu Modalı
     */
    function setupPluginsModal() {
        var btnOpen = document.getElementById('btnStationPlugins');
        var modal = document.getElementById('turkiyatPluginsModal');
        var btnClose = document.getElementById('btnPluginsModalClose');
        var btnToggleRadio = document.getElementById('btnToggleRadioPlugin');
        var radioWidget = document.getElementById('turkiyatRadioWidget');

        if (!modal) return;

        function updateModalState() {
            var isRadioActive = radioWidget && radioWidget.style.display !== 'none';
            if (btnToggleRadio) {
                btnToggleRadio.textContent = isRadioActive ? 'İstasyondan Kaldır' : 'İstasyona Ekle';
                btnToggleRadio.className = isRadioActive ? 'ek-btn' : 'ek-btn ek-btn-primary';
            }
        }

        if (btnOpen) {
            btnOpen.addEventListener('click', function() {
                updateModalState();
                modal.classList.add('show');
            });
        }

        if (btnClose) {
            btnClose.addEventListener('click', function() {
                modal.classList.remove('show');
            });
        }

        if (btnToggleRadio && radioWidget) {
            btnToggleRadio.addEventListener('click', function() {
                var isHidden = radioWidget.style.display === 'none';
                if (isHidden) {
                    radioWidget.style.display = 'flex';
                    radioWidget.classList.remove('minimized');
                    localStorage.setItem('turkiyat_plugin_radio', 'true');
                    showToast('KÖG Radyo istasyonunuza eklendi!');
                } else {
                    radioWidget.style.display = 'none';
                    localStorage.setItem('turkiyat_plugin_radio', 'false');
                    showToast('KÖG Radyo istasyonunuzdan kaldırıldı.');
                }
                updateModalState();
            });
        }
    }

    /**
     * 11. İstasyon Tema & Ekran Kontrolleri (Kırılmaz Fallback Destekli)
     */
    function setupWorkspaceControls() {
        var btnTheme = document.getElementById('btnStationTheme');
        var btnFullscreen = document.getElementById('btnStationFullscreen');

        if (btnTheme) {
            btnTheme.addEventListener('click', function() {
                document.body.classList.toggle('parchment-mode');
                var isParch = document.body.classList.contains('parchment-mode');
                this.innerHTML = isParch 
                    ? '<i class="fa-solid fa-moon"></i> <span class="btn-text">Koyu Tema</span>' 
                    : '<i class="fa-solid fa-book-open"></i> <span class="btn-text">Parşömen Modu</span>';
                showToast(isParch ? 'Açık Parşömen çalışma moduna geçildi.' : 'Koyu Mürekkep moduna geçildi.');
            });
        }

        if (btnFullscreen) {
            function updateFullscreenUI(isFull) {
                btnFullscreen.innerHTML = isFull
                    ? '<i class="fa-solid fa-compress"></i> <span class="btn-text">Tam Ekrandan Çık</span>'
                    : '<i class="fa-solid fa-expand"></i> <span class="btn-text">Tam Ekran</span>';
            }

            btnFullscreen.addEventListener('click', function() {
                var isNativeFull = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
                var isCssFull = document.body.classList.contains('station-fullscreen-active');

                if (!isNativeFull && !isCssFull) {
                    var el = document.documentElement;
                    var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                    if (rfs) {
                        try {
                            rfs.call(el).then(function() {
                                updateFullscreenUI(true);
                                showToast('Tam Ekran Modu Aktif.');
                            }).catch(function() {
                                document.body.classList.add('station-fullscreen-active');
                                updateFullscreenUI(true);
                                showToast('Tam Ekran Modu Aktif (ESC ile çıkabilirsiniz).');
                            });
                        } catch (e) {
                            document.body.classList.add('station-fullscreen-active');
                            updateFullscreenUI(true);
                            showToast('Tam Ekran Modu Aktif (ESC ile çıkabilirsiniz).');
                        }
                    } else {
                        document.body.classList.add('station-fullscreen-active');
                        updateFullscreenUI(true);
                        showToast('Tam Ekran Modu Aktif (ESC ile çıkabilirsiniz).');
                    }
                } else {
                    if (isNativeFull) {
                        var efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                        if (efs) {
                            try { efs.call(document); } catch (e) {}
                        }
                    }
                    document.body.classList.remove('station-fullscreen-active');
                    updateFullscreenUI(false);
                    showToast('Tam ekrandan çıkıldı.');
                }
            });

            document.addEventListener('fullscreenchange', function() {
                var isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
                updateFullscreenUI(isFull);
            });
            document.addEventListener('webkitfullscreenchange', function() {
                var isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
                updateFullscreenUI(isFull);
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.body.classList.contains('station-fullscreen-active')) {
                    document.body.classList.remove('station-fullscreen-active');
                    updateFullscreenUI(false);
                }
            });
        }
    }

    /**
     * 12. Ebced Hesabı ve Tarih Düşürme Modülü
     */
    function setupEbcedModule() {
        var input = document.getElementById('stationEbcedInput');
        if (!input) return;

        var resTotal = document.getElementById('stationEbcedTotal');
        var resHijri = document.getElementById('stationEbcedHijri');
        var resMiladi = document.getElementById('stationEbcedMiladi');
        var resWords = document.getElementById('stationEbcedWordCount');
        var tbody = document.getElementById('tbodyStationEbced');
        var btnCopy = document.getElementById('btnStationCopyEbced');

        function runCalc() {
            var txt = input.value.trim();
            if (!txt || !window.EbcedEngine) {
                if (resTotal) resTotal.textContent = '0';
                if (resHijri) resHijri.textContent = '-';
                if (resMiladi) resMiladi.textContent = '-';
                if (resWords) resWords.textContent = '0';
                if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 1rem;">Mısra girdiğinizde analiz dökümü burada belirecektir.</td></tr>';
                return;
            }

            var res = EbcedEngine.calculate(txt);
            if (resTotal) resTotal.textContent = res.total;
            if (resHijri) resHijri.textContent = res.total > 0 ? ('H. ' + res.total) : '-';
            if (resMiladi) resMiladi.textContent = res.yearMiladi ? ('M. ' + res.yearMiladi) : '-';
            if (resWords) resWords.textContent = res.breakdown.length;

            if (tbody) {
                if (res.breakdown.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 1rem;">Tanımlı harf tespit edilemedi.</td></tr>';
                    return;
                }

                tbody.innerHTML = res.breakdown.map(function(item, idx) {
                    var badges = item.letters.map(function(l) {
                        return '<span style="display:inline-block; padding: 2px 6px; margin: 2px; border-radius: 4px; background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3); font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-gold);">' +
                            '<strong>' + (l.label || l.char) + '</strong>=' + l.val + '</span>';
                    }).join(' ');

                    return '<tr>' +
                        '<td style="color:var(--text-secondary); font-family:var(--font-mono);">' + (idx + 1) + '</td>' +
                        '<td style="font-family:var(--font-serif); font-size:1.15rem; color:var(--text-primary); font-weight:600;">' + escapeHtml(item.word) + '</td>' +
                        '<td>' + badges + '</td>' +
                        '<td style="font-family:var(--font-mono); font-weight:bold; color:var(--accent-gold); font-size:1.1rem;">' + item.wordTotal + '</td>' +
                        '</tr>';
                }).join('');
            }
        }

        input.addEventListener('input', runCalc);

        if (btnCopy) {
            btnCopy.addEventListener('click', function() {
                var txt = input.value.trim();
                if (!txt || !window.EbcedEngine) return;
                var res = EbcedEngine.calculate(txt);
                var report = 'BİTİGEY EBCED VE TARİH RAPORU\nMetin: ' + txt + '\nEbced-i Kebîr: ' + res.total + '\nHicrî: H. ' + res.total + '\nMilâdî: M. ' + (res.yearMiladi || '-') + '\n(Bitigey SEO ile Güçlendirilmiştir - https://www.bitigey.com/html/turkiyat-ebced-hesabi.html)';
                navigator.clipboard.writeText(report).then(function() {
                    showToast('Ebced analiz raporu kopyalandı.');
                });
            });
        }
    }

    /**
     * 13. Kodikoloji & Yazma Eser Tavsif Modülü
     */
    function setupKodikolojiModule() {
        var btnWord = document.getElementById('btnStationDownloadWord');
        var btnCit = document.getElementById('btnStationCopyCitation');
        if (!btnWord && !btnCit) return;

        function getForm() {
            return {
                title: (document.getElementById('stKodTitle') || {}).value || '',
                author: (document.getElementById('stKodAuthor') || {}).value || '',
                library: (document.getElementById('stKodLibrary') || {}).value || '',
                folios: (document.getElementById('stKodFolios') || {}).value || '',
                paper: (document.getElementById('stKodPaper') || {}).value || '',
                binding: (document.getElementById('stKodBinding') || {}).value || '',
                script: (document.getElementById('stKodScript') || {}).value || "Nesta'lîk",
                colophon: (document.getElementById('stKodColophon') || {}).value || '',
                provenance: (document.getElementById('stKodProvenance') || {}).value || ''
            };
        }

        if (btnWord) {
            btnWord.addEventListener('click', function() {
                if (!window.KodikolojiEngine) return;
                var d = getForm();
                var fname = (d.title || 'Kodikoloji-Tavsifi').replace(/[^a-zA-Z0-9_-]/g, '_');
                KodikolojiEngine.downloadWordDoc(d, fname);
                showToast('Akademik Word belgesi indirildi.');
            });
        }

        if (btnCit) {
            btnCit.addEventListener('click', function() {
                if (!window.KodikolojiEngine) return;
                var d = getForm();
                var cit = KodikolojiEngine.generateCitation(d);
                navigator.clipboard.writeText(cit).then(function() {
                    showToast('Tez dipnotu kopyalandı.');
                });
            });
        }
    }

    /**
     * 14. Dizin & Konkordans
     * Analiz tamamen yerelde çalışır; araştırma metni hiçbir sunucuya gönderilmez.
     */
    function setupDizinModule() {
        var input = document.getElementById('dizinInput');
        var analyzeButton = document.getElementById('btnDizinAnalyze');
        var clearButton = document.getElementById('btnDizinClear');
        var exportButton = document.getElementById('btnDizinExport');
        var wordButton = document.getElementById('btnDizinWord');
        var summary = document.getElementById('dizinSummary');
        var results = document.getElementById('dizinResults');
        var ignoreStopwords = document.getElementById('dizinIgnoreStopwords');
        var minLength = document.getElementById('dizinMinLength');
        if (!input || !analyzeButton || !summary || !results) return;

        var stopwords = {
            've': true, 'ile': true, 'bir': true, 'bu': true, 'şu': true, 'o': true,
            'da': true, 'de': true, 'ki': true, 'mi': true, 'mı': true, 'mu': true,
            'mü': true, 'için': true, 'gibi': true, 'dahi': true, 'ise': true,
            'ama': true, 'fakat': true, 'lakin': true, 'ne': true, 'ya': true
        };
        var latestRows = [];
        var storageKey = 'bitigey_dizin_corpus';

        try {
            input.value = localStorage.getItem(storageKey) || '';
        } catch (error) {
            showToast('Dizin metni cihaz hafızasından okunamadı.');
        }

        function normalizeWord(word) {
            return word.toLocaleLowerCase('tr-TR')
                .replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, '');
        }

        function buildRows(text) {
            var counts = Object.create(null);
            var contexts = Object.create(null);
            var lines = text.split(/\r?\n/);
            lines.forEach(function(line, lineIndex) {
                var words = line.split(/\s+/);
                words.forEach(function(rawWord, wordIndex) {
                    var word = normalizeWord(rawWord);
                    if (!word || word.length < Math.max(1, Number(minLength.value) || 2)) return;
                    if (ignoreStopwords.checked && stopwords[word]) return;
                    counts[word] = (counts[word] || 0) + 1;
                    if (!contexts[word]) contexts[word] = [];
                    if (contexts[word].length < 3) {
                        var start = Math.max(0, wordIndex - 4);
                        var end = Math.min(words.length, wordIndex + 5);
                        contexts[word].push({
                            line: lineIndex + 1,
                            text: words.slice(start, end).join(' ')
                        });
                    }
                });
            });
            return Object.keys(counts).map(function(word) {
                return { word: word, count: counts[word], contexts: contexts[word] || [] };
            }).sort(function(a, b) {
                return b.count - a.count || a.word.localeCompare(b.word, 'tr');
            });
        }

        function render(rows, text) {
            latestRows = rows;
            var totalWords = text.trim() ? text.trim().split(/\s+/).length : 0;
            var uniqueWords = rows.length;
            var sentences = text.split(/[.!?]+/).filter(function(sentence) {
                return sentence.trim().length > 0;
            }).length;
            summary.innerHTML =
                '<div class="dizin-stat-grid">' +
                '<div class="dizin-stat"><b>' + totalWords + '</b><span>Toplam kelime</span></div>' +
                '<div class="dizin-stat"><b>' + uniqueWords + '</b><span>Tekil kelime</span></div>' +
                '<div class="dizin-stat"><b>' + sentences + '</b><span>Cümle / bölüm</span></div>' +
                '<div class="dizin-stat"><b>' + (totalWords ? Math.round(uniqueWords / totalWords * 100) : 0) + '%</b><span>Kelime çeşitliliği</span></div>' +
                '</div>';
            if (!rows.length) {
                results.innerHTML = '<div class="dizin-empty"><strong>Analiz edilecek kelime bulunamadı.</strong><span>Daha uzun bir metin veya daha düşük bir harf sınırı deneyin.</span></div>';
                return;
            }
            var body = rows.map(function(row) {
                var context = row.contexts.map(function(item) {
                    return 's.' + item.line + ': ' + escapeHtml(item.text);
                }).join('<br>');
                return '<tr><td>' + escapeHtml(row.word) + '</td><td>' + row.count + '</td><td class="dizin-context">' + context + '</td></tr>';
            }).join('');
            results.innerHTML = '<div class="dizin-table-wrap"><table class="dizin-table"><thead><tr><th>Kelime</th><th>Sıklık</th><th>Bağlam / satır</th></tr></thead><tbody>' + body + '</tbody></table></div>';
        }

        function analyze() {
            var text = input.value;
            if (!text.trim()) {
                showToast('Dizin için önce bir metin giriniz.');
                input.focus();
                return;
            }
            try {
                localStorage.setItem(storageKey, text);
            } catch (error) {
                showToast('Metin kaydedilemedi; analiz yine de devam ediyor.');
            }
            render(buildRows(text), text);
            showToast('Dizin ve konkordans analizi tamamlandı.');
        }

        function downloadCsv() {
            if (!latestRows.length) {
                showToast('Önce dizin analizini çalıştırınız.');
                return;
            }
            var csv = '\uFEFFKelime;Sıklık;Bağlam\r\n' + latestRows.map(function(row) {
                var context = row.contexts.map(function(item) {
                    return 's.' + item.line + ': ' + item.text;
                }).join(' | ').replace(/"/g, '""');
                return '"' + row.word.replace(/"/g, '""') + '";' + row.count + ';"' + context + '"';
            }).join('\r\n');
            var link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
            link.download = 'bitigey-dizin-konkordans.csv';
            link.click();
            URL.revokeObjectURL(link.href);
            showToast('Dizin CSV olarak indirildi.');
        }

        function downloadWord() {
            if (!latestRows.length) {
                showToast('Önce dizin analizini çalıştırınız.');
                return;
            }
            var rows = latestRows.map(function(row) {
                var context = row.contexts.map(function(item) {
                    return 's.' + item.line + ': ' + item.text;
                }).join(' | ');
                return '<tr><td>' + escapeHtml(row.word) + '</td><td>' + row.count +
                    '</td><td>' + escapeHtml(context) + '</td></tr>';
            }).join('');
            var html = '<!doctype html><html><head><meta charset="utf-8"><title>Bitigey Dizin</title>' +
                '<style>body{font-family:Calibri,Arial,sans-serif}table{border-collapse:collapse;width:100%}' +
                'th,td{border:1px solid #777;padding:6px;text-align:left}th{background:#eee}</style></head>' +
                '<body><h1>Bitigey Türkiyat — Dizin ve Konkordans</h1>' +
                '<table><thead><tr><th>Kelime</th><th>Frekans</th><th>Bağlam / satır</th></tr></thead>' +
                '<tbody>' + rows + '</tbody></table></body></html>';
            var link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob(['\uFEFF', html], { type: 'application/msword' }));
            link.download = 'bitigey-dizin-konkordans.doc';
            link.click();
            URL.revokeObjectURL(link.href);
            showToast('Dizin Word (.doc) olarak indirildi.');
        }

        analyzeButton.addEventListener('click', analyze);
        exportButton.addEventListener('click', downloadCsv);
        if (wordButton) wordButton.addEventListener('click', downloadWord);
        clearButton.addEventListener('click', function() {
            input.value = '';
            latestRows = [];
            summary.innerHTML = '<div class="dizin-empty"><i class="fa-solid fa-chart-simple"></i><strong>Analiz bekleniyor</strong><span>Metninizi girip “Analiz Et” düğmesine basın.</span></div>';
            results.innerHTML = '';
            try { localStorage.removeItem(storageKey); } catch (error) {}
        });
        input.addEventListener('input', function() {
            try { localStorage.setItem(storageKey, input.value); } catch (error) {}
        });
    }

    function setupResearchShortcuts() {
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.shiftKey && event.key.toLocaleLowerCase() === 'f') {
                event.preventDefault();
                var button = document.querySelector('[data-module="modDizin"]');
                if (button) button.click();
                var input = document.getElementById('dizinInput');
                if (input) input.focus();
            }
            if (event.ctrlKey && event.key === 'Enter' && document.activeElement && document.activeElement.id === 'dizinInput') {
                event.preventDefault();
                var analyze = document.getElementById('btnDizinAnalyze');
                if (analyze) analyze.click();
            }
        });
    }

    function showToast(msg) {
        var toast = document.getElementById('turkiyatToast');
        if (!toast) return;
        toast.innerHTML = '<i class="fa-solid fa-feather" style="color:var(--accent-gold);"></i> ' + escapeHtml(msg);
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
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

    /* ================================================================
       10. BİTİGEY EKLENTİ EKOSİSTEMİ (PLUGIN ECOSYSTEM)
       ================================================================ */
    function setupPluginEcosystem() {

        // Aktif eklentileri sakla
        var activePlugins = {};

        // Modal açma/kapama
        var overlay = document.getElementById('pluginModalOverlay');
        var closeBtn = document.getElementById('pluginModalClose');
        var openBtn  = document.getElementById('btnStationPlugins');

        function openModal() { if (overlay) overlay.classList.add('open'); }
        function closeModal() { if (overlay) overlay.classList.remove('open'); }

        if (openBtn)  openBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay)  overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeModal();
        });

        // --- Plugin Tepsisi Güncelle ---
        function updateTray() {
            var tray = document.getElementById('pluginTray');
            var badge = document.getElementById('pluginBadgeCount');
            if (!tray) return;

            // Eski tray item'larını sil
            var items = tray.querySelectorAll('.plugin-tray-item');
            items.forEach(function(i) { i.remove(); });

            var names = {
                kogradio: ['fa-solid fa-radio',      'KÖG Radyo'],
                musvette: ['fa-solid fa-note-sticky', 'Müsvette'],
                transkeys:['fa-solid fa-keyboard',   'Çev. Klavye'],
                tdvia:    ['fa-solid fa-mosque',      'TDV İA'],
                noktalama:['fa-solid fa-spell-check', 'Noktalama'],
                kafiye:   ['fa-solid fa-music',       'Kafiye']
            };

            var count = 0;
            Object.keys(activePlugins).forEach(function(key) {
                if (!activePlugins[key]) return;
                count++;
                var info = names[key] || ['fa-solid fa-puzzle-piece', key];
                var item = document.createElement('button');
                item.className = 'plugin-tray-item';
                item.setAttribute('data-plugin', key);
                item.innerHTML = '<i class="' + info[0] + '"></i>' + info[1];
                item.title = info[1] + ' eklentisine git';
                item.addEventListener('click', function() { openModal(); });
                tray.appendChild(item);
            });

            tray.classList.toggle('hidden', count === 0);
            if (badge) badge.textContent = count;
        }

        // --- Genel Plugin Toggle Yönetici ---
        function setupToggle(id, pluginKey, onEnable, onDisable) {
            var btn = document.getElementById(id);
            var badge = document.getElementById('badge' + pluginKey.charAt(0).toUpperCase() + pluginKey.slice(1));
            var card = document.getElementById('pc' + pluginKey.charAt(0).toUpperCase() + pluginKey.slice(1));

            if (!btn) return;
            btn.addEventListener('click', function() {
                activePlugins[pluginKey] = !activePlugins[pluginKey];
                var on = activePlugins[pluginKey];
                btn.textContent = on ? 'Devre Dışı Bırak' : 'Etkinleştir';
                btn.classList.toggle('active', on);
                if (badge) {
                    badge.textContent = on ? 'Aktif' : 'Kapalı';
                    badge.className = 'plugin-status-badge ' + (on ? 'on' : 'off');
                }
                if (card) card.classList.toggle('plugin-active', on);
                if (on && onEnable) onEnable();
                if (!on && onDisable) onDisable();
                showToast((on ? '✅ Etkinleştirildi: ' : '⬜ Devre dışı: ') + (badge ? badge.closest('.plugin-card').querySelector('.plugin-name').textContent : pluginKey));
                updateTray();
            });
        }

        // ── 1. KÖG RADYO ──────────────────────────────────────────────
        setupToggle('toggleKogRadio', 'kogradio', function() {
            var w = document.getElementById('kogRadioWidget');
            if (w) { w.style.display = 'flex'; setupKogPlayer(); }
        }, function() {
            var w = document.getElementById('kogRadioWidget');
            if (w) w.style.display = 'none';
            var audio = document.getElementById('kogAudioEl');
            if (audio) { audio.pause(); audio.src = ''; }
        });

        function setupKogPlayer() {
            var audio = document.getElementById('kogAudioEl');
            var playBtn = document.getElementById('kogPlayBtn');
            var playIcon = document.getElementById('kogPlayIcon');
            var trackName = document.getElementById('kogTrackName');
            var trackSub  = document.getElementById('kogTrackSub');
            if (!audio || !playBtn || playBtn._kogInit) return;
            playBtn._kogInit = true;

            // KÖG Radyo stream URL (açık sanat radyosu)
            var streams = [
                { name: '📻 KÖG Radyo — Şarkiyat Yayın İstasyonu', sub: 'Orta Asya & Türklük Bilimi Kanalı', url: 'https://icecast.radiofrance.fr/fip-midfi.mp3' },
                { name: '🎵 Klasik Türk Müziği', sub: 'TRT Müzik Canlı Yayını', url: 'https://radyotvonline.net/radyo/trtmuzik.mp3' }
            ];
            var currentStream = 0;

            function loadStream(idx) {
                audio.src = streams[idx].url;
                if (trackName) trackName.textContent = streams[idx].name;
                if (trackSub)  trackSub.textContent  = streams[idx].sub;
            }

            loadStream(0);

            playBtn.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play().then(function() {
                        if (playIcon) { playIcon.className = 'fa-solid fa-pause'; }
                    }).catch(function() {
                        showToast('Radyo bağlantısı kurulamadı. Ağ bağlantınızı kontrol edin.');
                        if (playIcon) { playIcon.className = 'fa-solid fa-play'; }
                    });
                } else {
                    audio.pause();
                    if (playIcon) { playIcon.className = 'fa-solid fa-play'; }
                }
            });

            var volBtn = document.getElementById('kogVolBtn');
            if (volBtn) {
                volBtn.addEventListener('click', function() {
                    audio.muted = !audio.muted;
                    this.querySelector('i').className = audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
                });
            }
        }

        // ── 2. FİLOLOJİ MÜSVETTESİ ───────────────────────────────────
        setupToggle('toggleMusvette', 'musvette', function() {
            var w = document.getElementById('musvetteWidget');
            if (w) { w.style.display = 'block'; setupMusvette(); }
        }, function() {
            var w = document.getElementById('musvetteWidget');
            if (w) w.style.display = 'none';
        });

        function setupMusvette() {
            var ta     = document.getElementById('musvetteText');
            var status = document.getElementById('musvetteStatus');
            var copyBtn= document.getElementById('btnMusvetteCopy');
            var dlBtn  = document.getElementById('btnMusvetteDownload');
            var clrBtn = document.getElementById('btnMusvetteClear');
            if (!ta || ta._musvetteInit) return;
            ta._musvetteInit = true;

            // LocalStorage'dan yükle
            var saved = localStorage.getItem('bitigey_musvette');
            if (saved) { ta.value = saved; if (status) status.textContent = '💾 Kaydedilmiş not yüklendi.'; }

            var saveTimer;
            ta.addEventListener('input', function() {
                clearTimeout(saveTimer);
                if (status) status.textContent = '⏳ Kaydediliyor...';
                saveTimer = setTimeout(function() {
                    localStorage.setItem('bitigey_musvette', ta.value);
                    if (status) status.textContent = '✅ Otomatik kaydedildi — ' + new Date().toLocaleTimeString('tr-TR');
                }, 800);
            });

            if (copyBtn) copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(ta.value).then(function() { showToast('Notlar kopyalandı.'); });
            });

            if (dlBtn) dlBtn.addEventListener('click', function() {
                var blob = new Blob([ta.value], { type: 'text/plain;charset=utf-8' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'bitigey-musvette-' + new Date().toISOString().slice(0,10) + '.txt';
                a.click();
                showToast('TXT dosyası indirildi.');
            });

            if (clrBtn) clrBtn.addEventListener('click', function() {
                if (!confirm('Tüm notları silmek istediğinize emin misiniz?')) return;
                ta.value = '';
                localStorage.removeItem('bitigey_musvette');
                if (status) status.textContent = '🗑️ Notlar temizlendi.';
                showToast('Müsvette temizlendi.');
            });
        }

        // ── 3. ÇEVİRİYAZI KLAVYE TEPSİSİ ─────────────────────────────
        setupToggle('toggleTransKeys', 'transkeys', function() {
            // Floating tray zaten edisyon modülünde var; burası global kısa yol
            showToast('Çeviriyazı klavyesi etkin — herhangi bir metin alanına odaklandığında aktif olur.');
        }, null);

        // ── 4. TDV İSLÂM ANSİKLOPEDİSİ ──────────────────────────────
        setupToggle('toggleTdvia', 'tdvia', function() {
            var w = document.getElementById('tdviaWidget');
            if (w) { w.style.display = 'block'; setupTdvia(); }
        }, function() {
            var w = document.getElementById('tdviaWidget');
            if (w) w.style.display = 'none';
        });

        function setupTdvia() {
            var input   = document.getElementById('tdviaSearchInput');
            var btn     = document.getElementById('btnTdviaSearch');
            var results = document.getElementById('tdviaResults');
            var citBox  = document.getElementById('tdviaCitationBox');
            var citText = document.getElementById('tdviaCitationText');
            var citCopy = document.getElementById('btnCopyTdviaCitation');
            if (!input || input._tdviaInit) return;
            input._tdviaInit = true;

            // TDV İA Madde Veritabanı (44 cilt — temsili seçki)
            var DB = [
                { madde: 'Fuzûlî', cilt: 13, sayfa: 240, yazar: 'Hasibe Mazıoğlu' },
                { madde: 'Bâkî', cilt: 4, sayfa: 537, yazar: 'Haluk İpekten' },
                { madde: 'Nedim', cilt: 32, sayfa: 502, yazar: 'Müjgân Cunbur' },
                { madde: 'Nef\'î', cilt: 32, sayfa: 526, yazar: 'Haluk İpekten' },
                { madde: 'Şeyh Gâlib', cilt: 39, sayfa: 50, yazar: 'Süleyman Hayri Bolay' },
                { madde: 'Divan Edebiyatı', cilt: 9, sayfa: 389, yazar: 'Mustafa İsen' },
                { madde: 'Aruz', cilt: 3, sayfa: 437, yazar: 'Hasibe Mazıoğlu' },
                { madde: 'Osmanlı Devleti', cilt: 33, sayfa: 440, yazar: 'Halil İnalcık' },
                { madde: 'İstanbul', cilt: 23, sayfa: 181, yazar: 'Semavi Eyice' },
                { madde: 'Mesnevi', cilt: 29, sayfa: 325, yazar: 'Tahsin Yazıcı' },
                { madde: 'Kaside', cilt: 24, sayfa: 564, yazar: 'Ziya Avşar' },
                { madde: 'Gazel', cilt: 13, sayfa: 434, yazar: 'Mustafa İsen' },
                { madde: 'Şiir', cilt: 39, sayfa: 139, yazar: 'Bekir Karlığa' },
                { madde: 'Türk Dili', cilt: 41, sayfa: 470, yazar: 'Günay Karaağaç' },
                { madde: 'Çağatay Edebiyatı', cilt: 8, sayfa: 161, yazar: 'Mustafa İsen' },
                { madde: 'Divân-ı Hümâyun', cilt: 9, sayfa: 376, yazar: 'İsmail Hakkı Uzunçarşılı' },
                { madde: 'Minyatür', cilt: 30, sayfa: 108, yazar: 'Zeren Tanındı' },
                { madde: 'Hat', cilt: 16, sayfa: 427, yazar: 'Muhittin Serin' },
                { madde: 'Ebced', cilt: 10, sayfa: 68, yazar: 'Fikret Sarıcaoğlu' },
                { madde: 'Kodikoloji', cilt: 26, sayfa: 148, yazar: 'Zeren Tanındı' },
                { madde: 'Anadolu', cilt: 3, sayfa: 110, yazar: 'Hakkı Dursun Yıldız' },
                { madde: 'Selçuklular', cilt: 36, sayfa: 365, yazar: 'Erdoğan Merçil' },
                { madde: 'Moğollar', cilt: 30, sayfa: 226, yazar: 'Abdülkadir Yuvalı' },
                { madde: 'Timur', cilt: 41, sayfa: 172, yazar: 'Abdülkadir Yuvalı' },
                { madde: 'Yesevî, Ahmed', cilt: 43, sayfa: 495, yazar: 'Hamid Algar' },
                { madde: 'Yunus Emre', cilt: 43, sayfa: 600, yazar: 'Mustafa Tatcı' },
                { madde: 'Mevlânâ', cilt: 29, sayfa: 441, yazar: 'Mustafa Tahralı' },
                { madde: 'Hacı Bektaş-ı Veli', cilt: 14, sayfa: 455, yazar: 'Ahmet Yaşar Ocak' },
                { madde: 'Kâtib Çelebi', cilt: 25, sayfa: 35, yazar: 'Orhan Şaik Gökyay' },
                { madde: 'Evliya Çelebi', cilt: 11, sayfa: 529, yazar: 'Robert Dankoff' },
                { madde: 'Türkçe', cilt: 41, sayfa: 539, yazar: 'Günay Karaağaç' },
                { madde: 'Türkistan', cilt: 41, sayfa: 556, yazar: 'Abdülkadir Yuvalı' },
                { madde: 'Orta Asya', cilt: 33, sayfa: 391, yazar: 'Bahaeddin Ögel' },
                { madde: 'Göktürkler', cilt: 14, sayfa: 127, yazar: 'Ahmet Taşağıl' },
                { madde: 'Uygurlar', cilt: 42, sayfa: 230, yazar: 'Cengiz Alyılmaz' },
                { madde: 'Karahanlılar', cilt: 24, sayfa: 400, yazar: 'Osman Karatay' },
                { madde: 'Karamanoğulları', cilt: 24, sayfa: 454, yazar: 'Ali Sevim' },
                { madde: 'Edirne', cilt: 10, sayfa: 425, yazar: 'Machiel Kiel' },
                { madde: 'Bursa', cilt: 6, sayfa: 445, yazar: 'Halit Çal' },
                { madde: 'Konya', cilt: 26, sayfa: 184, yazar: 'Mehmet Önder' },
                { madde: 'Semerkand', cilt: 36, sayfa: 480, yazar: 'Thierry Zarcone' },
                { madde: 'Buhara', cilt: 6, sayfa: 362, yazar: 'Omeljan Pritsak' },
                { madde: 'Türkiyat', cilt: 41, sayfa: 575, yazar: 'Hasan Eren' },
                { madde: 'Filoloji', cilt: 13, sayfa: 75, yazar: 'Ahmet Kırkkılıç' },
                { madde: 'Transkripsiyon', cilt: 41, sayfa: 271, yazar: 'Türk Dil Kurumu' },
                { madde: 'Tezkire', cilt: 41, sayfa: 69, yazar: 'Mustafa İsen' },
                { madde: 'Münâcât', cilt: 32, sayfa: 9, yazar: 'Mehmet Demirci' },
                { madde: 'Na\'t', cilt: 32, sayfa: 424, yazar: 'Mustafa Uzun' },
                { madde: 'Tevhid', cilt: 41, sayfa: 24, yazar: 'Süleyman Uludağ' },
                { madde: 'Redd-i Atebât', cilt: 34, sayfa: 524, yazar: 'Orhan Şaik Gökyay' },
                { madde: 'İlm-i Lügat', cilt: 22, sayfa: 144, yazar: 'Ahmet Kırkkılıç' },
                { madde: 'Mecmûa', cilt: 28, sayfa: 265, yazar: 'Hatice Aynur' },
                { madde: 'Münşeât', cilt: 32, sayfa: 19, yazar: 'Mübahat Kütükoğlu' },
                { madde: 'Seyahatnâme', cilt: 37, sayfa: 9, yazar: 'Orhan Şaik Gökyay' },
                { madde: 'Vakfiye', cilt: 42, sayfa: 472, yazar: 'Nazif Öztürk' },
                { madde: 'Ferman', cilt: 12, sayfa: 401, yazar: 'Mübahat Kütükoğlu' },
                { madde: 'Berat', cilt: 5, sayfa: 471, yazar: 'Midhat Sertoğlu' },
                { madde: 'Minyatür', cilt: 30, sayfa: 108, yazar: 'Zeren Tanındı' }
            ];

            function search(q) {
                if (!q) return DB.slice(0, 12);
                q = q.toLowerCase().replace(/[îıiİÎ]/g, 'i').replace(/[şŞ]/g, 's').replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u');
                return DB.filter(function(e) {
                    var norm = (e.madde + ' ' + e.yazar).toLowerCase()
                        .replace(/[îıiİÎ]/g, 'i').replace(/[şŞ]/g, 's').replace(/[çÇ]/g, 'c')
                        .replace(/[ğĞ]/g, 'g').replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u');
                    return norm.includes(q);
                }).slice(0, 12);
            }

            function renderResults(items) {
                if (!results) return;
                if (items.length === 0) {
                    results.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;grid-column:1/-1;">Madde bulunamadı. Farklı anahtar kelime deneyin.</p>';
                    return;
                }
                results.innerHTML = items.map(function(e) {
                    return '<div class="tdvia-entry" data-madde="' + escapeHtml(e.madde) + '" data-cilt="' + e.cilt + '" data-sayfa="' + e.sayfa + '" data-yazar="' + escapeHtml(e.yazar) + '">' +
                        '<div class="tdvia-entry-title">' + escapeHtml(e.madde) + '</div>' +
                        '<div class="tdvia-entry-meta">Cilt ' + e.cilt + ', s. ' + e.sayfa + ' — ' + escapeHtml(e.yazar) + '</div>' +
                        '</div>';
                }).join('');

                results.querySelectorAll('.tdvia-entry').forEach(function(el) {
                    el.addEventListener('click', function() {
                        var madde = this.dataset.madde;
                        var cilt  = this.dataset.cilt;
                        var sayfa = this.dataset.sayfa;
                        var yazar = this.dataset.yazar;
                        var citation = yazar + ', "' + madde + '", Türkiye Diyanet Vakfı İslâm Ansiklopedisi, c. ' + cilt + ' (İstanbul: TDV Yayınları, ' + (1988 + parseInt(cilt)) + '), s. ' + sayfa + '.';
                        if (citText) citText.textContent = citation;
                        if (citBox)  citBox.style.display = 'block';
                        showToast('"' + madde + '" maddesi seçildi. Dipnot hazırlandı.');

                        // Tüm seçimleri kaldır, bunu vurgula
                        results.querySelectorAll('.tdvia-entry').forEach(function(e) { e.style.borderColor = ''; });
                        el.style.borderColor = 'var(--accent-gold)';
                    });
                });
            }

            // İlk yükleme
            renderResults(DB.slice(0, 12));

            function doSearch() { renderResults(search(input.value.trim())); }
            if (btn) btn.addEventListener('click', doSearch);
            input.addEventListener('keydown', function(e) { if (e.key === 'Enter') doSearch(); });

            if (citCopy) {
                citCopy.addEventListener('click', function() {
                    if (!citText) return;
                    navigator.clipboard.writeText(citText.textContent).then(function() {
                        showToast('TDV İA dipnotu panoya kopyalandı.');
                    });
                });
            }
        }

        // ── 5. NOKTALAMA İŞARETLERİ DÜZENLEYİCİ ─────────────────────
        setupToggle('toggleNoktalama', 'noktalama', function() {
            var w = document.getElementById('noktalamaWidget');
            if (w) { w.style.display = 'block'; setupNoktalama(); }
        }, function() {
            var w = document.getElementById('noktalamaWidget');
            if (w) w.style.display = 'none';
        });

        function setupNoktalama() {
            var inputTA  = document.getElementById('noktalamaInput');
            var outputTA = document.getElementById('noktalamaOutput');
            var runBtn   = document.getElementById('btnRunNoktalama');
            var copyBtn  = document.getElementById('btnCopyNoktalama');
            if (!inputTA || inputTA._noktalamaInit) return;
            inputTA._noktalamaInit = true;

            function clean(text) {
                // 1. Çift tırnak → « »
                text = text.replace(/"([^"]+)"/g, '«\u202f$1\u202f»');
                text = text.replace(/''([^'']+)''/g, '«\u202f$1\u202f»');
                // 2. Büyük tırnak → « »
                text = text.replace(/\u201c([^\u201d]+)\u201d/g, '«\u202f$1\u202f»');
                // 3. Tire/çizgi → em-dash (kelimeler arasında)
                text = text.replace(/\s+-\s+/g, ' — ');
                text = text.replace(/\s*--\s*/g, ' — ');
                // 4. Çift boşluk temizle
                text = text.replace(/ {2,}/g, ' ');
                // 5. ... → …
                text = text.replace(/\.\.\./g, '…');
                // 6. ʿAyn / ʾHemze düzelt (yalnızca iki yaygın ASCII gösterimini dönüştür)
                text = text.replace(/`/g, 'ʿ');
                text = text.replace(/\^/g, 'ʾ');
                // 7. Satır başı/sonu boşluk normalize
                text = text.split('\n').map(function(line) { return line.trim(); }).join('\n');
                // 8. Birden fazla boş satır → tek
                text = text.replace(/\n{3,}/g, '\n\n');
                return text;
            }

            if (runBtn) runBtn.addEventListener('click', function() {
                var raw = inputTA.value;
                if (!raw.trim()) { showToast('Lütfen metin giriniz.'); return; }
                var cleaned = clean(raw);
                if (outputTA) outputTA.value = cleaned;
                showToast('✅ Akademik tipografi düzenlemesi tamamlandı.');
            });

            if (copyBtn) copyBtn.addEventListener('click', function() {
                var out = outputTA ? outputTA.value : '';
                if (!out) { showToast('Önce "Tipografiyi Düzenle" butonuna basın.'); return; }
                navigator.clipboard.writeText(out).then(function() {
                    showToast('Düzenlenmiş metin kopyalandı.');
                });
            });
        }

        // ── 6. KAFİYE & REDİF ANALİZ MOTORU ─────────────────────────
        setupToggle('toggleKafiye', 'kafiye', function() {
            var w = document.getElementById('kafiyeWidget');
            if (w) { w.style.display = 'block'; setupKafiye(); }
        }, function() {
            var w = document.getElementById('kafiyeWidget');
            if (w) w.style.display = 'none';
        });

        function setupKafiye() {
            var inputTA = document.getElementById('kafiyeInput');
            var runBtn  = document.getElementById('btnRunKafiye');
            var resDiv  = document.getElementById('kafiyeResult');
            if (!runBtn || runBtn._kafiyeInit) return;
            runBtn._kafiyeInit = true;

            runBtn.addEventListener('click', function() {
                if (!inputTA) return;
                var lines = inputTA.value.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
                if (lines.length < 2) { showToast('En az 2 mısra giriniz.'); return; }

                // Son kelimeleri çıkar
                var lastWords = lines.map(function(l) {
                    var parts = l.split(/\s+/);
                    return parts[parts.length - 1].replace(/[.,;:!?»"]/g, '');
                });

                // Revî harfi (son harf) tespiti
                var sons = lastWords.map(function(w) { return w[w.length - 1] || ''; });
                var reviFreq = {};
                sons.forEach(function(s) { reviFreq[s] = (reviFreq[s] || 0) + 1; });
                var revi = Object.keys(reviFreq).sort(function(a,b) { return reviFreq[b]-reviFreq[a]; })[0];

                // Kafiye türü heuristic
                var rhymeLen = 0;
                var ref = lastWords[0];
                for (var i = 1; i <= 4; i++) {
                    var all = lastWords.every(function(w) { return w.slice(-i) === ref.slice(-i); });
                    if (all) rhymeLen = i; else break;
                }
                var tur = rhymeLen >= 3 ? 'Zengin Kafiye' : rhymeLen === 2 ? 'Tam Kafiye (Mükemmel)' : rhymeLen === 1 ? 'Yarım Kafiye' : 'Cinaslı / Serbest';

                // Redif var mı?
                var refParts = lastWords[0].split('');
                var redifCheck = lastWords.slice(1).every(function(w) { return w === lastWords[0]; });

                var html = '<div style="background:var(--bg-card);border:1px solid var(--border-station);border-radius:var(--radius-md);padding:1rem;">';
                html += '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">';
                html += '<span style="padding:0.3rem 0.75rem;border-radius:20px;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);color:#a855f7;font-weight:700;font-size:0.82rem;">Revî Harfi: ' + revi + '</span>';
                html += '<span style="padding:0.3rem 0.75rem;border-radius:20px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);color:var(--accent-gold);font-weight:700;font-size:0.82rem;">Kafiye Türü: ' + tur + '</span>';
                if (redifCheck) html += '<span style="padding:0.3rem 0.75rem;border-radius:20px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#10b981;font-weight:700;font-size:0.82rem;">Redif: Mevcut ✓</span>';
                html += '</div>';
                html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
                html += '<tr><th style="text-align:left;padding:0.4rem 0.5rem;color:var(--text-secondary);border-bottom:1px solid var(--border-station);">Mısra</th><th style="text-align:left;padding:0.4rem 0.5rem;color:var(--text-secondary);border-bottom:1px solid var(--border-station);">Son Kelime</th><th style="padding:0.4rem 0.5rem;color:var(--text-secondary);border-bottom:1px solid var(--border-station);">Kafiye Son</th></tr>';
                lines.forEach(function(line, idx) {
                    var w = lastWords[idx];
                    var suffix = w.slice(-Math.max(rhymeLen, 1));
                    html += '<tr><td style="padding:0.4rem 0.5rem;color:var(--text-secondary);">' + (idx+1) + '</td>';
                    html += '<td style="padding:0.4rem 0.5rem;font-family:var(--font-serif);color:var(--text-primary);">' + escapeHtml(line.length > 50 ? line.slice(-30) + '…' : line) + '</td>';
                    html += '<td style="padding:0.4rem 0.5rem;text-align:center;"><strong style="color:var(--accent-gold);">' + escapeHtml(suffix) + '</strong></td></tr>';
                });
                html += '</table></div>';

                if (resDiv) resDiv.innerHTML = html;
                showToast('Kafiye & Redif analizi tamamlandı.');
            });
        }

        // İlk güncelleme
        updateTray();
    }

    /**
     * 14. Cihaz Hafızası (LocalStorage Otomatik Kaydetme & Geri Yükleme)
     * Kullanıcının girdiği her türlü veri, sekme ve form aynı cihazda güvenle saklanır.
     */
    function setupStationPersistence() {
        var saveBadge = document.getElementById('turkiyatSaveStatus');

        function flashSaveBadge() {
            if (!saveBadge) return;
            saveBadge.classList.add('saving');
            saveBadge.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> <span class="btn-text">Kaydediliyor...</span>';
            setTimeout(function() {
                saveBadge.classList.remove('saving');
                saveBadge.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> <span class="btn-text">Cihaza Kaydedildi</span>';
            }, 600);
        }

        window.flashSaveBadge = flashSaveBadge;

        function debounceSave(fn, delay) {
            var timer;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                    flashSaveBadge();
                }, delay || 400);
            };
        }

        /* ── A. Aruz Vezni Hafızası ── */
        var aruzM1 = document.getElementById('aruzMisra1');
        var aruzM2 = document.getElementById('aruzMisra2');
        var KEY_ARUZ = 'bitigey_aruz_data';

        if (aruzM1 || aruzM2) {
            try {
                var savedAruz = JSON.parse(localStorage.getItem(KEY_ARUZ) || 'null');
                if (savedAruz) {
                    if (aruzM1 && savedAruz.m1) aruzM1.value = savedAruz.m1;
                    if (aruzM2 && savedAruz.m2) aruzM2.value = savedAruz.m2;
                }
            } catch(e) {}

            var saveAruz = debounceSave(function() {
                try {
                    localStorage.setItem(KEY_ARUZ, JSON.stringify({
                        m1: aruzM1 ? aruzM1.value : '',
                        m2: aruzM2 ? aruzM2.value : ''
                    }));
                } catch(e) {}
            }, 500);

            if (aruzM1) aruzM1.addEventListener('input', saveAruz);
            if (aruzM2) aruzM2.addEventListener('input', saveAruz);
        }

        /* ── B. Çeviriyazı / Transkripsiyon Hafızası ── */
        var transIn = document.getElementById('textTransInput');
        var transOut = document.getElementById('textTransOutput');
        var KEY_TRANS = 'bitigey_trans_data';

        if (transIn) {
            try {
                var savedTrans = JSON.parse(localStorage.getItem(KEY_TRANS) || 'null');
                if (savedTrans) {
                    if (transIn && savedTrans.input) transIn.value = savedTrans.input;
                    if (transOut && savedTrans.output) transOut.value = savedTrans.output;
                }
            } catch(e) {}

            var saveTrans = debounceSave(function() {
                try {
                    localStorage.setItem(KEY_TRANS, JSON.stringify({
                        input: transIn ? transIn.value : '',
                        output: transOut ? transOut.value : ''
                    }));
                } catch(e) {}
            }, 500);

            if (transIn) transIn.addEventListener('input', saveTrans);
        }

        /* ── C. Kodikoloji Formu Hafızası ── */
        var kodFields = [
            'stKodTitle', 'stKodAuthor', 'stKodLibrary',
            'stKodFolios', 'stKodPaper', 'stKodBinding',
            'stKodScript', 'stKodColophon', 'stKodProvenance'
        ];
        var KEY_KODIKOLOJI = 'bitigey_kodikoloji_data';

        try {
            var savedKod = JSON.parse(localStorage.getItem(KEY_KODIKOLOJI) || 'null');
            if (savedKod) {
                kodFields.forEach(function(fid) {
                    var el = document.getElementById(fid);
                    if (el && savedKod[fid] !== undefined) {
                        el.value = savedKod[fid];
                    }
                });
            }
        } catch(e) {}

        var saveKod = debounceSave(function() {
            try {
                var data = {};
                kodFields.forEach(function(fid) {
                    var el = document.getElementById(fid);
                    if (el) data[fid] = el.value;
                });
                localStorage.setItem(KEY_KODIKOLOJI, JSON.stringify(data));
            } catch(e) {}
        }, 500);

        kodFields.forEach(function(fid) {
            var el = document.getElementById(fid);
            if (el) {
                el.addEventListener('input', saveKod);
                el.addEventListener('change', saveKod);
            }
        });

        /* ── D. Ebced Hesabı Hafızası ── */
        var ebcedIn = document.getElementById('stationEbcedInput');
        var KEY_EBCED = 'bitigey_ebced_data';

        if (ebcedIn) {
            try {
                var savedEbced = localStorage.getItem(KEY_EBCED);
                if (savedEbced) {
                    ebcedIn.value = savedEbced;
                    // Giriş değeri varsa Ebced hesaplamasını tetikle
                    ebcedIn.dispatchEvent(new Event('input'));
                }
            } catch(e) {}

            var saveEbced = debounceSave(function() {
                try {
                    localStorage.setItem(KEY_EBCED, ebcedIn.value);
                } catch(e) {}
            }, 500);

            ebcedIn.addEventListener('input', saveEbced);
        }

        /* ── E. Tez Kaynakça Hafızası ── */
        var citeFields = ['citeAuthor', 'citeTitle', 'citeCity', 'citePub', 'citeYear'];
        var KEY_KAYNAKCA = 'bitigey_kaynakca_data';

        try {
            var savedCite = JSON.parse(localStorage.getItem(KEY_KAYNAKCA) || 'null');
            if (savedCite) {
                citeFields.forEach(function(fid) {
                    var el = document.getElementById(fid);
                    if (el && savedCite[fid]) el.value = savedCite[fid];
                });
            }
        } catch(e) {}

        var saveCite = debounceSave(function() {
            try {
                var cData = {};
                citeFields.forEach(function(fid) {
                    var el = document.getElementById(fid);
                    if (el) cData[fid] = el.value;
                });
                localStorage.setItem(KEY_KAYNAKCA, JSON.stringify(cData));
            } catch(e) {}
        }, 500);

        citeFields.forEach(function(fid) {
            var el = document.getElementById(fid);
            if (el) el.addEventListener('input', saveCite);
        });

        /* ── F. Sözlük Arama Hafızası ── */
        var sozlukInput = document.getElementById('sozlukSearchInput');
        var KEY_SOZLUK = 'bitigey_sozluk_query';

        if (sozlukInput) {
            try {
                var savedQuery = localStorage.getItem(KEY_SOZLUK);
                if (savedQuery) {
                    sozlukInput.value = savedQuery;
                    sozlukInput.dispatchEvent(new Event('input'));
                }
            } catch(e) {}

            var saveSozluk = debounceSave(function() {
                try {
                    localStorage.setItem(KEY_SOZLUK, sozlukInput.value);
                } catch(e) {}
            }, 500);

            sozlukInput.addEventListener('input', saveSozluk);
        }

        /* ── G. Noktalama & Kafiye Hafızası ── */
        var nokIn = document.getElementById('noktalamaInput');
        if (nokIn) {
            try {
                var savedNok = localStorage.getItem('bitigey_noktalama_data');
                if (savedNok) nokIn.value = savedNok;
            } catch(e) {}
            nokIn.addEventListener('input', debounceSave(function() {
                try { localStorage.setItem('bitigey_noktalama_data', nokIn.value); } catch(e) {}
            }, 500));
        }

        var kafIn = document.getElementById('kafiyeInput');
        if (kafIn) {
            try {
                var savedKaf = localStorage.getItem('bitigey_kafiye_data');
                if (savedKaf) kafIn.value = savedKaf;
            } catch(e) {}
            kafIn.addEventListener('input', debounceSave(function() {
                try { localStorage.setItem('bitigey_kafiye_data', kafIn.value); } catch(e) {}
            }, 500));
        }
    }

    window.TurkiyatApp = {
        showToast: showToast
    };

})();
