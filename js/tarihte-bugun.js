/**
 * BITIGEY - TARİHTE BUGÜN EDEBİYAT & GÜNÜN ŞİİRİ MOTORU (js/tarihte-bugun.js)
 * Canlı RSS & Wikipedia Otomatik Güncelleme Motoru + Gelecek Günler İçin Gizemli Mühürlü Takvim.
 */

(function() {
    'use strict';

    var MONTH_NAMES = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    // Aktif görüntülenen tarih (varsayılan: kullanıcının bugünü)
    var activeDate = new Date();
    var countdownInterval = null;
    var liveRssCache = {};

    function isFutureDate(date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return checkDate.getTime() > today.getTime();
    }

    function initTarihteBugun() {
        renderTarihteBugun();
        setupEventListeners();
        startRssAutoUpdater();
    }

    function renderTarihteBugun() {
        if (typeof TarihteBugunAPI === 'undefined') {
            console.warn('TarihteBugunAPI yüklenemedi.');
            return;
        }

        // Varsa eski geri sayımı temizle
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        var month = activeDate.getMonth() + 1; // 1 - 12
        var day = activeDate.getDate();        // 1 - 31
        var year = activeDate.getFullYear();
        var monthName = MONTH_NAMES[month - 1];
        var dateFormatted = day + ' ' + monthName;

        var isFuture = isFutureDate(activeDate);

        // 1. Ana Sayfa Widget'ını Güncelle (varsa)
        var container = document.getElementById('tarihte-bugun-widget');
        if (container) {
            if (isFuture) {
                container.innerHTML = generateSealedMysteryHTML(dateFormatted, activeDate, false);
            } else {
                var data = getMergedDayData(month, day);
                container.innerHTML = generateWidgetHTML(data, dateFormatted, year);
            }
        }

        // 2. Tam Sayfa Portalını Güncelle (varsa)
        var fullContainer = document.getElementById('tarihte-bugun-full-page');
        if (fullContainer) {
            if (isFuture) {
                fullContainer.innerHTML = generateSealedMysteryHTML(dateFormatted, activeDate, true);
            } else {
                var data = getMergedDayData(month, day);
                fullContainer.innerHTML = generateFullPageHTML(data, dateFormatted, year);
            }
        }

        // Gelecek gün için geri sayımı başlat
        if (isFuture) {
            startMidnightCountdown();
        } else {
            // 3. Google SEO Schema.org JSON-LD Yapılandırılmış Verisini Enjekte Et
            var data = getMergedDayData(month, day);
            updateSchemaOrg(data, dateFormatted, year);
        }
    }

    /**
     * Canlı RSS veya Önbellekten Gelen Zenginleştirilmiş Veriyi Döndür
     */
    function getMergedDayData(month, day) {
        var baseData = TarihteBugunAPI.getDayData(month, day);
        var cacheKey = 'tb_rss_' + month + '_' + day;

        // Önbellekte canlı RSS güncellemesi var mı?
        var cached = liveRssCache[cacheKey] || localStorage.getItem(cacheKey);
        if (cached) {
            try {
                var parsed = typeof cached === 'string' ? JSON.parse(cached) : cached;
                if (parsed && parsed.liveEvent) {
                    baseData.event = parsed.liveEvent;
                    baseData.sourceUrl = parsed.sourceUrl || '';
                    baseData.isLiveRss = true;
                }
            } catch (e) {}
        }

        return baseData;
    }

    function getSmartInsight(data, dateFormatted) {
        var period = (data.poetPeriod || '').toLowerCase();
        var focus = period.indexOf('divan') !== -1 || period.indexOf('klasik') !== -1
            ? 'Klasik metin ve söz varlığı'
            : period.indexOf('tiyatro') !== -1 || period.indexOf('roman') !== -1
                ? 'Anlatı ve sahne dili'
                : 'Şiir, ritim ve imge';
        return '<div class="tb-smart-strip" aria-label="Günün akıllı önerileri">' +
            '<div><i class="fa-solid fa-compass"></i><span><b>Bugünün rotası</b>' + focus + '</span></div>' +
            '<div><i class="fa-solid fa-hourglass-half"></i><span><b>Okuma önerisi</b>3 dakikalık odaklı okuma</span></div>' +
            '<div><i class="fa-solid fa-book-open-reader"></i><span><b>Arşiv ipucu</b>' + dateFormatted + ' kaydını paylaş veya kaydet</span></div>' +
            '</div>';
    }

    function getDatePickerHTML() {
        var isoDate = activeDate.getFullYear() + '-' +
            String(activeDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(activeDate.getDate()).padStart(2, '0');
        return '<label class="tb-date-picker" title="Takvimden bir tarih seç">' +
            '<i class="fa-solid fa-calendar-days"></i>' +
            '<input id="tb-date-picker" type="date" value="' + isoDate + '" aria-label="Tarih seç">' +
            '</label>';
    }

    /**
     * GİZEMLİ MÜHÜRLÜ TAKVİM (YARIN VE GELECEK GÜNLER İÇİN)
     * Yarın ne paylaşılacağı önceden görünmez, saat 00:00'da canlı açılır.
     */
    function generateSealedMysteryHTML(dateFormatted, targetDate, isFullPage) {
        return '' +
            '<div class="tb-glass-card tb-sealed-card">' +
                '<div class="tb-header" style="justify-content:space-between;">' +
                    '<div class="tb-badge-group">' +
                        '<span class="tb-badge-pill" style="border-color:#a29bfe;color:#dcd6ff;"><i class="fa-solid fa-hourglass-half" style="color:#ffd700;"></i> ' + dateFormatted + '</span>' +
                        '<span class="tb-sub-badge"><i class="fa-solid fa-lock"></i> Mühürlü Edebi Takvim</span>' +
                    '</div>' +
                    '<div class="tb-nav-controls">' +
                        getDatePickerHTML() +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-prev" title="Önceki Gün"><i class="fa-solid fa-chevron-left"></i> <span class="tb-hide-mobile">Geri</span></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-today" id="tb-btn-today" title="Bugüne Dön"><i class="fa-solid fa-clock-rotate-left"></i> Bugün</button>' +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-next" title="Sonraki Gün"><span class="tb-hide-mobile">İleri</span> <i class="fa-solid fa-chevron-right"></i></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-random" id="tb-btn-random" title="Rastgele Güne Git"><i class="fa-solid fa-shuffle"></i></button>' +
                    '</div>' +
                '</div>' +

                '<div class="tb-sealed-lock-icon">' +
                    '<i class="fa-solid fa-lock"></i>' +
                '</div>' +

                '<h2 class="tb-sealed-title">Yarının Edebi Sürprizi Henüz Mühürlü</h2>' +
                '<p class="tb-sealed-desc">' +
                    'Edebiyatın yaşayan hafızasında her gün yeni bir doğuştur. ' + dateFormatted + ' tarihinin günün şiiri, şairi ve edebi olayı gece yarısı <strong>00:00</strong>\'da canlı RSS ve otonom edebiyat akışlarımızdan derlenerek bu ekranda açılacaktır.' +
                '</p>' +

                '<!-- Canlı Geri Sayım Sayacı -->' +
                '<div class="tb-countdown-container">' +
                    '<i class="fa-solid fa-stopwatch" style="color:#ffd700;font-size:1.2rem;"></i>' +
                    '<span style="font-size:0.85rem;color:#cbd5e1;text-transform:uppercase;letter-spacing:1px;">Açılışa Kalan Süre:</span>' +
                    '<span class="tb-countdown-timer" id="tb-midnight-countdown">--:--:--</span>' +
                '</div>' +

                '<!-- Bulanık Merak Uyandırıcı Şiir Silüeti -->' +
                '<div class="tb-blur-teaser">' +
                    '“Ne içindeyim zamanın, ne de büsbütün dışında...<br>' +
                    'Yarın bu satırlarda Türk edebiyatının bir başka ulu sesi yankılanacak...<br>' +
                    'Söz uçar, yazı kalır; vakti gelince mısralar çözülür.”' +
                '</div>' +

                '<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">' +
                    '<button type="button" class="tb-action-btn tb-btn-today-action" id="tb-btn-back-today" style="background:#7c3aed;color:#fff;border:none;padding:10px 24px;border-radius:50px;cursor:pointer;font-weight:700;">' +
                        '<i class="fa-solid fa-calendar-day"></i> Bugünün Şiirine Dön' +
                    '</button>' +
                    '<button type="button" class="tb-action-btn" id="tb-btn-random-action" style="background:rgba(255,255,255,0.08);color:#eceff4;border:1px solid rgba(255,255,255,0.2);padding:10px 24px;border-radius:50px;cursor:pointer;font-weight:600;">' +
                        '<i class="fa-solid fa-shuffle"></i> Geçmişten Bir Güne Işınlan' +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    /**
     * Gece Yarısına Doğru Canlı Geri Sayım
     */
    function startMidnightCountdown() {
        function updateTimer() {
            var now = new Date();
            var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            var diff = tomorrow.getTime() - now.getTime();

            if (diff <= 0) {
                // Gece yarısı oldu, mühür kalktı!
                activeDate = new Date();
                renderTarihteBugun();
                return;
            }

            var hours = Math.floor(diff / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            var timerEl = document.getElementById('tb-midnight-countdown');
            if (timerEl) {
                timerEl.textContent = 
                    (hours < 10 ? '0' : '') + hours + ':' +
                    (minutes < 10 ? '0' : '') + minutes + ':' +
                    (seconds < 10 ? '0' : '') + seconds;
            }
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    /**
     * STANDART AÇIK GÜN HTML'İ (BUGÜN VEYA GEÇMİŞ GÜNLER)
     */
    function generateWidgetHTML(data, dateFormatted, year) {
        var poemLines = data.poemExcerpt.replace(/\n/g, '<br>');
        var shareText = encodeURIComponent('📅 ' + dateFormatted + " Tarihte Bugün Edebiyat:\n\n" + data.event + "\n\n📖 Günün Şiiri: " + data.poetName + " - " + data.poemTitle + "\n\nBitigey'de Keşfet: " + window.location.href);

        var liveBadge = data.isLiveRss ? 
            '<span class="tb-live-rss-pill"><span class="tb-live-dot-green"></span> Canlı kaynak güncel</span>' : '';

        return '' +
            '<div class="tb-glass-card">' +
                '<div class="tb-header">' +
                    '<div class="tb-badge-group">' +
                        '<span class="tb-badge-pill"><i class="fa-solid fa-calendar-day" style="color:#ffd700;"></i> ' + dateFormatted + '</span>' +
                        '<span class="tb-sub-badge"><i class="fa-solid fa-feather-pointed"></i> Edebiyatta Bugün</span>' +
                        liveBadge +
                    '</div>' +
                    '<div class="tb-nav-controls">' +
                        getDatePickerHTML() +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-prev" title="Önceki Güne Git"><i class="fa-solid fa-chevron-left"></i> <span class="tb-hide-mobile">Dün</span></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-today" id="tb-btn-today" title="Bugüne Dön"><i class="fa-solid fa-clock-rotate-left"></i> Bugün</button>' +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-next" title="Sonraki Güne Git"><span class="tb-hide-mobile">Yarın (Mühürlü)</span> <i class="fa-solid fa-chevron-right"></i></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-random" id="tb-btn-random" title="Rastgele Bir Güne Işınlan"><i class="fa-solid fa-shuffle"></i></button>' +
                    '</div>' +
                '</div>' +
                getSmartInsight(data, dateFormatted) +

                '<div class="tb-body-grid">' +
                    '<div class="tb-event-col">' +
                        '<div class="tb-event-box">' +
                            '<div class="tb-box-label"><i class="fa-solid fa-landmark-dome"></i> EDEBİYAT TARİHİNDE BUGÜN</div>' +
                            '<h3 class="tb-event-title">' + data.event + '</h3>' +
                        '</div>' +

                        '<div class="tb-rare-word-card">' +
                            '<div class="tb-word-header">' +
                                '<span class="tb-word-icon"><i class="fa-solid fa-book-bookmark"></i></span>' +
                                '<div>' +
                                    '<span class="tb-word-label">GÜNÜN EDEBİ SÖZCÜĞÜ</span>' +
                                    '<h4 class="tb-word-title">' + data.rareWord + '</h4>' +
                                '</div>' +
                            '</div>' +
                            '<p class="tb-word-desc">' + data.rareWordMeaning + '</p>' +
                        '</div>' +

                        '<div class="tb-quote-box">' +
                            '<i class="fa-solid fa-quote-left tb-quote-icon"></i>' +
                            '<p class="tb-quote-text">"' + data.quote + '"</p>' +
                            '<span class="tb-quote-author">— ' + data.poetName + '</span>' +
                        '</div>' +
                    '</div>' +

                    '<div class="tb-poem-col">' +
                        '<div class="tb-poem-wrapper">' +
                            '<div class="tb-poem-badge"><i class="fa-solid fa-scroll"></i> GÜNÜN SEÇİLEN ŞİİRİ</div>' +
                            '<h2 class="tb-poem-title">' + data.poemTitle + '</h2>' +
                            '<div class="tb-poet-meta">' +
                                '<img src="' + data.poetImage + '" alt="' + data.poetName + '" class="tb-poet-avatar" onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.poetName) + '&background=7C3AED&color=fff\'">' +
                                '<div>' +
                                    '<span class="tb-poet-name">' + data.poetName + '</span>' +
                                    '<span class="tb-poet-period">' + data.poetPeriod + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<blockquote class="tb-poem-content">' + poemLines + '</blockquote>' +
                            '<p class="tb-poet-bio"><i class="fa-solid fa-circle-info"></i> ' + data.poetBio + '</p>' +
                        '</div>' +

                        '<div class="tb-actions-row">' +
                            '<button type="button" class="tb-action-btn" id="tb-copy-btn" title="Dizeleri Kopyala">' +
                                '<i class="fa-regular fa-copy"></i> Kopyala' +
                            '</button>' +
                            '<a href="https://api.whatsapp.com/send?text=' + shareText + '" target="_blank" rel="noopener" class="tb-action-btn tb-btn-wa" title="WhatsApp\'ta Paylaş">' +
                                '<i class="fa-brands fa-whatsapp"></i> Paylaş' +
                            '</a>' +
                            '<a href="https://twitter.com/intent/tweet?text=' + shareText + '" target="_blank" rel="noopener" class="tb-action-btn tb-btn-x" title="X (Twitter)\'da Paylaş">' +
                                '<i class="fa-brands fa-x-twitter"></i>' +
                            '</a>' +
                            '<a href="html/tarihte-bugun.html" class="tb-action-btn tb-btn-archive">' +
                                '365 Gün Arşivi <i class="fa-solid fa-arrow-right"></i>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function generateFullPageHTML(data, dateFormatted, year) {
        var poemLines = data.poemExcerpt.replace(/\n/g, '<br>');
        var shareText = encodeURIComponent('📅 ' + dateFormatted + " Tarihte Bugün Edebiyat:\n\n" + data.event + "\n\n📖 Günün Şiiri: " + data.poetName + " - " + data.poemTitle + "\n\nBitigey: " + window.location.href);

        var liveBadge = data.isLiveRss ? 
            '<span class="tb-live-rss-pill"><span class="tb-live-dot-green"></span> Canlı kaynak güncel</span>' : '';

        return '' +
            '<div class="tb-glass-card tb-portal-card">' +
                '<div class="tb-header">' +
                    '<div class="tb-badge-group">' +
                        '<span class="tb-badge-pill"><i class="fa-solid fa-calendar-day" style="color:#ffd700;"></i> ' + dateFormatted + '</span>' +
                        '<span class="tb-sub-badge"><i class="fa-solid fa-feather-pointed"></i> Edebi Takvim</span>' +
                        liveBadge +
                    '</div>' +
                    '<div class="tb-nav-controls">' +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-prev" title="Önceki Gün"><i class="fa-solid fa-chevron-left"></i> <span class="tb-hide-mobile">Dün</span></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-today" id="tb-btn-today" title="Bugüne Dön"><i class="fa-solid fa-clock-rotate-left"></i> Bugün</button>' +
                        '<button type="button" class="tb-btn-nav" id="tb-btn-next" title="Sonraki Gün"><span class="tb-hide-mobile">Yarın (Mühürlü)</span> <i class="fa-solid fa-chevron-right"></i></button>' +
                        '<button type="button" class="tb-btn-nav tb-btn-random" id="tb-btn-random" title="Rastgele Güne Git"><i class="fa-solid fa-shuffle"></i></button>' +
                    '</div>' +
                '</div>' +
                (data.sourceUrl ? '<div class="tb-source-line"><i class="fa-solid fa-link"></i> Canlı olay kaynağı: <a href="' + data.sourceUrl + '" target="_blank" rel="noopener noreferrer">Türkçe Wikipedia On This Day</a></div>' : '') +

                '<div class="tb-body-grid">' +
                    '<div class="tb-event-col">' +
                        '<div class="tb-event-box">' +
                            '<div class="tb-box-label"><i class="fa-solid fa-landmark-dome"></i> EDEBİYAT TARİHİNDE BUGÜN</div>' +
                            '<h2 class="tb-event-title" style="font-size:1.25rem;">' + data.event + '</h2>' +
                        '</div>' +

                        '<div class="tb-rare-word-card">' +
                            '<div class="tb-word-header">' +
                                '<span class="tb-word-icon"><i class="fa-solid fa-book-bookmark"></i></span>' +
                                '<div>' +
                                    '<span class="tb-word-label">GÜNÜN EDEBİ SÖZCÜĞÜ</span>' +
                                    '<h3 class="tb-word-title">' + data.rareWord + '</h3>' +
                                '</div>' +
                            '</div>' +
                            '<p class="tb-word-desc">' + data.rareWordMeaning + '</p>' +
                        '</div>' +

                        '<div class="tb-quote-box">' +
                            '<i class="fa-solid fa-quote-left tb-quote-icon"></i>' +
                            '<p class="tb-quote-text">"' + data.quote + '"</p>' +
                            '<span class="tb-quote-author">— ' + data.poetName + '</span>' +
                        '</div>' +
                    '</div>' +

                    '<div class="tb-poem-col">' +
                        '<div class="tb-poem-wrapper">' +
                            '<div class="tb-poem-badge"><i class="fa-solid fa-scroll"></i> GÜNÜN SEÇİLEN ŞİİRİ</div>' +
                            '<h2 class="tb-poem-title">' + data.poemTitle + '</h2>' +
                            '<div class="tb-poet-meta">' +
                                '<img src="' + data.poetImage + '" alt="' + data.poetName + '" class="tb-poet-avatar" onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.poetName) + '&background=7C3AED&color=fff\'">' +
                                '<div>' +
                                    '<span class="tb-poet-name">' + data.poetName + '</span>' +
                                    '<span class="tb-poet-period">' + data.poetPeriod + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<blockquote class="tb-poem-content" style="font-size:1.02rem;line-height:1.85;">' + poemLines + '</blockquote>' +
                            '<p class="tb-poet-bio"><i class="fa-solid fa-circle-info"></i> ' + data.poetBio + '</p>' +
                        '</div>' +

                        '<div class="tb-actions-row">' +
                            '<button type="button" class="tb-action-btn" id="tb-copy-btn" title="Dizeleri Kopyala">' +
                                '<i class="fa-regular fa-copy"></i> Dizeleri Kopyala' +
                            '</button>' +
                            '<a href="https://api.whatsapp.com/send?text=' + shareText + '" target="_blank" rel="noopener" class="tb-action-btn tb-btn-wa" title="WhatsApp\'ta Paylaş">' +
                                '<i class="fa-brands fa-whatsapp"></i> WhatsApp' +
                            '</a>' +
                            '<a href="https://twitter.com/intent/tweet?text=' + shareText + '" target="_blank" rel="noopener" class="tb-action-btn tb-btn-x" title="X (Twitter)\'da Paylaş">' +
                                '<i class="fa-brands fa-x-twitter"></i> X Paylaş' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                (data.sourceUrl ? '<div class="tb-source-line"><i class="fa-solid fa-link"></i> Canlı olay kaynağı: <a href="' + data.sourceUrl + '" target="_blank" rel="noopener noreferrer">Türkçe Wikipedia On This Day</a></div>' : '') +
            '</div>';
    }

    /**
     * CANLI RSS & WIKIPEDIA EDEBİYAT AKIŞI MOTORU
     * Sayfa açık kaldıkça veya kullanıcı girdikçe arka planda günceller.
     */
    function startRssAutoUpdater() {
        fetchTodayRssEvent();

        // 15 dakikada bir otomatik canlı kontrol
        setInterval(function() {
            fetchTodayRssEvent();
        }, 15 * 60 * 1000);
    }

    function fetchTodayRssEvent() {
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var cacheKey = 'tb_rss_' + month + '_' + day;

        // Wikipedia Tarihte Bugün API (Türkçe)
        var wikiUrl = 'https://tr.wikipedia.org/api/rest_v1/feed/onthisday/all/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day);

        fetch(wikiUrl)
            .then(function(res) {
                if (!res.ok) {
                    throw new Error('Canlı kaynak HTTP ' + res.status);
                }
                return res.json();
            })
            .then(function(data) {
                if (data && (data.selected || data.events || data.births)) {
                    var candidateList = (data.selected || []).concat(data.events || []).concat(data.births || []);

                    var literaryKeywords = ['edebiyat', 'şair', 'yazar', 'şiir', 'kitap', 'roman', 'tiyatro', 'sanat', 'dergi', 'gazete', 'akım'];
                    var rankedCandidates = candidateList.map(function(candidate) {
                        var text = String(candidate.text || '').trim();
                        var lower = text.toLocaleLowerCase('tr-TR');
                        var score = literaryKeywords.reduce(function(total, keyword) {
                            return total + (lower.indexOf(keyword) !== -1 ? 2 : 0);
                        }, 0);
                        if (candidate.year) score += 1;
                        if (text.length >= 45 && text.length <= 280) score += 1;
                        return { candidate: candidate, text: text, score: score };
                    }).filter(function(item) {
                        return item.text.length > 0;
                    }).sort(function(left, right) {
                        return right.score - left.score;
                    });

                    var best = rankedCandidates[0];
                    if (best) {
                        var selected = best.candidate;
                        var year = selected.year ? selected.year + ' - ' : '';
                        var matchedEvent = day + ' ' + MONTH_NAMES[month - 1] + ' ' + year + best.text;
                        var sourceUrl = 'https://tr.wikipedia.org/api/rest_v1/feed/onthisday/all/' +
                            (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day);
                        var payload = { liveEvent: matchedEvent, sourceUrl: sourceUrl, updated: Date.now() };
                        liveRssCache[cacheKey] = payload;
                        localStorage.setItem(cacheKey, JSON.stringify(payload));

                        // Eğer kullanıcı şu an bugünü izliyorsa arayüzü canlı güncelle
                        var activeIsToday = !isFutureDate(activeDate) && activeDate.getDate() === day && (activeDate.getMonth() + 1) === month;
                        if (activeIsToday) {
                            renderTarihteBugun();
                        }
                    }
                }
            })
            .catch(function(err) {
                console.warn('Tarihte Bugün canlı kaynak güncellenemedi; yerel kayıt korunuyor.', err);
            });
    }

    function setupEventListeners() {
        document.addEventListener('click', function(e) {
            // Önceki Gün
            if (e.target.closest('#tb-btn-prev')) {
                activeDate.setDate(activeDate.getDate() - 1);
                renderTarihteBugun();
            }
            // Sonraki Gün (Yarın)
            else if (e.target.closest('#tb-btn-next')) {
                activeDate.setDate(activeDate.getDate() + 1);
                renderTarihteBugun();
            }
            // Bugün
            else if (e.target.closest('#tb-btn-today') || e.target.closest('#tb-btn-back-today')) {
                activeDate = new Date();
                renderTarihteBugun();
            }
            // Rastgele Gün (Yalnızca geçmiş günlerden seçer, yarını ifşa etmez!)
            else if (e.target.closest('#tb-btn-random') || e.target.closest('#tb-btn-random-action')) {
                var randomMonth = Math.floor(Math.random() * 12);
                var randomDay = Math.floor(Math.random() * 28) + 1;
                var randDate = new Date(new Date().getFullYear(), randomMonth, randomDay);

                // Eğer rastgele seçilen gün geleceğe düşüyorsa geçen yıla atayarak geçmişten seçer
                var now = new Date();
                if (randDate.getTime() > now.getTime()) {
                    randDate.setFullYear(now.getFullYear() - 1);
                }

                activeDate = randDate;
                renderTarihteBugun();
            }
            // Kopyalama Butonu
            else if (e.target.closest('#tb-copy-btn')) {
                copyPoemToClipboard();
            }
        });

        document.addEventListener('change', function(e) {
            if (!e.target.matches('#tb-date-picker') || !e.target.value) {
                return;
            }

            var parts = e.target.value.split('-').map(Number);
            if (parts.length !== 3 || parts.some(function(part) { return !Number.isFinite(part); })) {
                return;
            }

            activeDate = new Date(parts[0], parts[1] - 1, parts[2]);
            renderTarihteBugun();
        });
    }

    function copyPoemToClipboard() {
        var month = activeDate.getMonth() + 1;
        var day = activeDate.getDate();
        var data = getMergedDayData(month, day);
        var textToCopy = data.poemTitle + ' — ' + data.poetName + '\n\n' + data.poemExcerpt + '\n\nKaynak: bitigey.com';

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(function() {
                showToast('Şiir panoya kopyalandı! ✨');
            }).catch(function() {
                showToast('Kopyalama yapılamadı.');
            });
        } else {
            showToast('Şiir seçildi, manuel kopyalayabilirsiniz.');
        }
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.className = 'tb-toast-msg';
        toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#ffd700;"></i> ' + msg;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.classList.add('show');
        }, 50);
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 2800);
    }

    /**
     * GOOGLE SEO: Dinamik Schema.org (JSON-LD) Yapılandırılmış Verisi
     */
    function updateSchemaOrg(data, dateFormatted, year) {
        var scriptId = 'tarihte-bugun-ld-json';
        var script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }

        var schemaData = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": data.poemTitle + " - " + dateFormatted + " Tarihte Bugün Edebiyat",
            "headline": data.event,
            "description": data.poemExcerpt.substring(0, 160) + "...",
            "datePublished": activeDate.toISOString(),
            "inLanguage": "tr-TR",
            "author": {
                "@type": "Person",
                "name": data.poetName,
                "description": data.poetBio
            },
            "publisher": {
                "@type": "EducationalOrganization",
                "name": "Bitigey",
                "url": "https://www.bitigey.com/"
            },
            "keywords": ["tarihte bugün edebiyat", "günün şiiri", data.poetName, data.poemTitle, "türk edebiyatı takvimi"]
        };

        script.textContent = JSON.stringify(schemaData);
    }

    // Sayfa Yüklendiğinde Başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTarihteBugun);
    } else {
        initTarihteBugun();
    }

    // Dışarıya fonksiyon sağla (Takvimden seçim için)
    window.setTarihteBugunDate = function(month, day) {
        activeDate = new Date(new Date().getFullYear(), month - 1, day);
        renderTarihteBugun();
    };

})();
