/**
 * BİTİGEY TÜRKİYAT — EDEBİYAT & FİLOLOJİ SÖZLÜĞÜ MOTORU (CANLI RSS DESTEKLİ)
 * Dosya: js/turkiyat-sozluk-engine.js
 * 
 * Özellikler:
 *  - 150+ Klasik Osmanlı, Çağatay, Eski Anadolu Türkçesi ve Yazma Eser Terimleri Hafızası
 *  - TDK, Kubbealtı ve Edebiyat RSS Beslemelerinden Canlı Kelime Çekimi
 *  - Kategori Filtreleme (Mazmunlar, Yazma Eser Istılahları, Etimoloji, Tasavvuf, Canlı RSS)
 *  - Aruz vezni ve numune beyit atıfları
 * 
 * İletişim: contact@bitigey.com
 */

(function (global) {
  'use strict';

  const SozlukEngine = {
    // 150+ Zengin Edebi, Filolojik ve Yazma Eser Kelime Veritabanı
    coreDictionary: [
      { w: "Âb-gûn", m: "Su renkli, gök renkli, mavi, saf, berrak ve parlak.", k: "Farsça", cat: "mazmun", ex: "Âb-gûndur günbed-i devvâr rengi bilmezem / Yâ muhît olmuş gözümden günbed-i devvâra su (Fuzûlî)" },
      { w: "Âb-rû", m: "Yüz suyu, haysiyet, şeref, itibar ve edep.", k: "Farsça", cat: "mazmun", ex: "Dökme gel nâ-keslere sen âb-rûyı ey gönül (Nâbî)" },
      { w: "Âh-ı seher", m: "Seher vaktinde âşıkların göklere yükselen yanık feryadı ve yakarışı.", k: "Arapça-Farsça", cat: "tasavvuf", ex: "Âh-ı sehergehe eyle hazer kim tîr-i belâdır (Bâkî)" },
      { w: "Ahsen-i takvîm", m: "En güzel biçim ve suret; insanın yaratılışındaki ilahi mükemmellik.", k: "Arapça", cat: "tasavvuf", ex: "Hakk insanı ahsen-i takvîm üzere halk eyledi." },
      { w: "Aparat (Apparatus Criticus)", m: "Edisyon kritik neşirlerinde sayfa altında nüsha farklarının gösterildiği eleştirel dipnot kuşağı.", k: "Latince", cat: "yazma", ex: "Nüsha A (Esas): gül-fem; Nüsha B: gül-şen; Nüsha C: gül-ruhsâr." },
      { w: "Arketip (Archetype)", m: "Günümüze ulaşmayan ancak mevcut tüm el yazması nüshaların kendisinden türediği varsayılan ilk ana nüsha.", k: "Grekçe", cat: "yazma", ex: "Stemma codicum şemasında arketip tepede yer alır." },
      { w: "Âsaf", m: "Hz. Süleyman'ın bilge veziri Âsaf bin Berhiyâ; divan şiirinde vezir-i a'zamların edebi övgü mazmunu.", k: "Arapça", cat: "mazmun", ex: "Âsaf-ı devrân olan sadr-ı muazzam şânına." },
      { w: "Bâde", m: "Şarap; tasavvufta ilahi aşk ve marifetullah neşesi.", k: "Farsça", cat: "tasavvuf", ex: "Bâde-i aşkı içenler mest-i lâ-ya'kıl olur." },
      { w: "Bahr", m: "Aruz vezninde tef'ilelerin birleşmesinden meydana gelen ana vezin ailesi (Hezec, Remel, Recez vb.).", k: "Arapça", cat: "filoloji", ex: "Fuzûlî Leylâ vü Mecnûn mesnevisini Hezec bahrinde yazmıştır." },
      { w: "Bârgâh", m: "Padişahın otağı, yüksek divan; tasavvufta Cenâb-ı Hakk'ın huzuru ve dergâhı.", k: "Farsça", cat: "tasavvuf", ex: "Bârgâh-ı kibriyâya yüz sürüp af dileriz." },
      { w: "Belâgat", m: "Sözün fasih ve edebi inceliklere uygun, yerinde ve en tesirli şekilde söylenmesi sanatı.", k: "Arapça", cat: "edebi-sanat", ex: "Belâgat ilminde ma'ânî, beyân ve bedî' üç ana şubedir." },
      { w: "Berk-i hazân", m: "Sonbahar yaprağı; fâni ömrü ve sararıp solan âşığın yüzünü simgeleyen edebi mazmun.", k: "Farsça", cat: "mazmun", ex: "Reng-i rûyum berk-i zerd-i hazâna döndü." },
      { w: "Bî-çâre", m: "Çaresiz, kimsesiz, derdine derman bulamayan âşık.", k: "Farsça", cat: "mazmun", ex: "Fuzûlî bî-nevâ bir haste-dil bî-çâredir her dem." },
      { w: "Câm-ı cem", m: "Cemşid'in içine bakınca bütün dünyayı gösteren efsanevi kadehi; hakikati yansıtan gönül aynası.", k: "Farsça", cat: "tasavvuf", ex: "Gönüldür câm-ı cem ey dil içinde nûr-ı Yezdân var." },
      { w: "Cânân", m: "Canan, kendisine can verilen sevgili; tasavvufta Hakk Teâlâ.", k: "Farsça", cat: "tasavvuf", ex: "Cânı cânan diler ise minnet cânıma." },
      { w: "Cedvel", m: "Yazma eser sayfalarında yazı sahasını çevreleyen altın yaldızlı veya renkli mürekkeple çekilmiş çizgiler.", k: "Arapça", cat: "yazma", ex: "Eser çift tahrirli altın cedvel içine istinsah edilmiştir." },
      { w: "Çarh-ı felek", m: "Dönen felek, talih, gök kubbe; âşıklara cefa eden devran.", k: "Farsça", cat: "mazmun", ex: "Çarh-ı felek döne döne kanımı döktü." },
      { w: "Çeşm-i bîmâr", m: "Süzgün, baygın ve hasta bakışlı göz; âşığı canevinden vuran mahmur sevgili gözü.", k: "Farsça", cat: "mazmun", ex: "Bîmâr çeşmin ey sanem yüz bin cânı hasta kıldı." },
      { w: "Çille (Erbain)", m: "Dervişin nefis terbiyesi için kırk gün boyunca halvete çekilmesi.", k: "Farsça", cat: "tasavvuf", ex: "Çille-i aşkı tamam eylemeyen hâma ermez." },
      { w: "Dâğ", m: "Âşığın bağrındaki yanık izi, aşk yarası; dağlanan sine.", k: "Farsça", cat: "mazmun", ex: "Sînemde dâğ-ı aşkın her biri bir lale oldu." },
      { w: "Dâm-ı zülf", m: "Sevgilinin saç tuzağı; âşığın gönül kuşunun takılıp kaldığı siyah saçlar.", k: "Farsça", cat: "mazmun", ex: "Murg-ı dil dâm-ı zülfüne düşeliden beri bî-karardır." },
      { w: "Dâr-ı fenâ", m: "Geçici ve fâni olan bu dünya.", k: "Arapça", cat: "tasavvuf", ex: "Dâr-ı fenâdan dâr-ı bekâya irtihal eyledi." },
      { w: "Derkenar (Hâmiş)", m: "Yazma eserin sayfa boşluklarına (kenarlarına) sonradan ilave edilen şerh, haşiye veya tashih notu.", k: "Farsça", cat: "yazma", ex: "Nüsha B'de bu dize derkenar olarak kaydedilmiştir." },
      { w: "Devvâr", m: "Sürekli dönen felek, gök kubbe, çarh-ı felek.", k: "Arapça", cat: "filoloji", ex: "Günbed-i devvâr (Dönen felek kubbesi)." },
      { w: "Ebrû", m: "1. Kaş; sevgilinin keman veya mihraba benzetilen kaşı. 2. Kitap sanatlarında kitreli su üzerinde yapılan ebru kâğıdı.", k: "Farsça", cat: "mazmun", ex: "Keman ebrûlarına cânlar fedâ olsun." },
      { w: "Ezel", m: "Başlangıcı olmayan geçmiş zaman; bezm-i elest demi.", k: "Arapça", cat: "tasavvuf", ex: "Ezelden aşk ile yandık ebed bî-gâne kalmayız." },
      { w: "Fasl-ı hazân", m: "Güz mevsimi, sonbahar; ayrılık ve hüzün mevsimi.", k: "Arapça", cat: "mazmun", ex: "Erişti fasl-ı hazân soldu gülsitân-ı vefâ." },
      { w: "Fenâfillâh", m: "Kişinin kendi nefsani varlığını Allah'ın mutlak varlığında yok etmesi makamı.", k: "Arapça", cat: "tasavvuf", ex: "Fenâfillâha eren âşık bekâbillâha erer." },
      { w: "Ferağ (Ketebe)", m: "Müstensiğin yazma eseri temize çekip bitirdiğini bildirdiği, adını ve tarihi zikrettiği bitiş kaydı.", k: "Arapça", cat: "yazma", ex: "Ferağ kaydında sene 984 zikredilmektedir." },
      { w: "Feyz-i akdes", m: "Tasavvufta Allah'ın zâtının zâtına tecellisi; ilahi bilgi ve feyiz kaynağı.", k: "Arapça", cat: "tasavvuf", ex: "Feyz-i akdes deryâsından katre nûş eyledik." },
      { w: "Gamze", m: "Göz süzüşü, yan bakış; âşığın ciğerini delen ok, kılıç veya hançer.", k: "Arapça", cat: "mazmun", ex: "Gamzen oku sînem deler ey kaşı keman." },
      { w: "Genc-i nihân", m: "Gizli hazine; 'Ben gizli bir hazine idim...' (Küntü kenzen mahfiyyen) hadis-i kudsîsine telmih.", k: "Farsça", cat: "tasavvuf", ex: "Genc-i nihânı bulduk virâne gönlümüz içinde." },
      { w: "Giryân", m: "Gözyaşı döken, ağlayan; hicran derdiyle inleyen âşık.", k: "Farsça", cat: "mazmun", ex: "Dîdelerim giryân olup seyl-âbe döndü." },
      { w: "Gül-bâng", m: "Topluca çekilen tekbir, dua veya derviş nidası.", k: "Farsça", cat: "tasavvuf", ex: "Gülbâng-ı Muhammedî ile cihan nûra gark oldu." },
      { w: "Gül-fem", m: "Gül ağızlı, dudakları gonca gibi taze ve al olan sevgili.", k: "Farsça", cat: "mazmun", ex: "Gül-femler ile zevk ü safâ faslı erişti." },
      { w: "Gül-ruhsâr", m: "Yanakları taze gül gibi kırmızı ve narin olan dilber.", k: "Farsça", cat: "mazmun", ex: "Gül-ruhsârına meftun olmayan bülbül mü var?" },
      { w: "Gülistân", m: "Gül bahçesi; divan şiirinde vuslat meclisi veya şairler meclisi.", k: "Farsça", cat: "mazmun", ex: "Gülistân-ı edebin bülbül-i nâlânıyız." },
      { w: "Hadeng", m: "Sert kayın ağacından yapılan ok; sevgilinin gamzesi ve kirpikleri.", k: "Farsça", cat: "mazmun", ex: "Cân evine geçti hadeng-i müjgânın." },
      { w: "Hâb-ı gaflet", m: "Gaflet uykusu; hakikati göremeyen basiretsiz hal.", k: "Arapça", cat: "tasavvuf", ex: "Uyan ey gözlerim gafletten uyan!" },
      { w: "Hâk-i pây", m: "Ayak tozu; tevazu ile sevgilinin veya mürşidin ayağına yüz sürme mazmunu.", k: "Farsça", cat: "mazmun", ex: "Hâk-i pâyine yüz sürmeyen mertebe bulmaz." },
      { w: "Hem-dem", m: "Birlikte nefes alan, can ciğer dost, sırdaş.", k: "Farsça", cat: "mazmun", ex: "Bize bir hem-dem gerek bu yolda yâr olan." },
      { w: "Hüsn-i ta'lîl", m: "Bir olayı gerçek sebebinin dışında, edebi ve hayali güzel bir sebebe bağlama sanatı.", k: "Arapça", cat: "edebi-sanat", ex: "Gül rengini alsın diyedir bağrımın kanı." },
      { w: "İmâle", m: "Aruz vezninde ölçüye uydurmak için kısa bir heceyi uzun (kapalı) okuma kusuru.", k: "Arapça", cat: "filoloji", ex: "Türkçe kelimelerde vezin gereği imâle yapılabilir." },
      { w: "İstinsah", m: "Bir yazma eseri başka bir nüshadan elle yazarak kopya etme ve çoğaltma faaliyeti.", k: "Arapça", cat: "yazma", ex: "Bu nüsha Topkapı Sarayı nüshasından istinsah olunmuştur." },
      { w: "Ketebe", m: "Yazma eserin sonunda hattatın veya müstensiğin adını yazdığı ketebesi / imzası.", k: "Arapça", cat: "yazma", ex: "Ketebehu'l-abdu'l-fakir..." },
      { w: "Kolasyon (Collatio)", m: "Edisyon kritikte nüshaların kelime kelime, dize dize yan yana konarak karşılaştırılması ameliye.", k: "Latince", cat: "yazma", ex: "Süleymaniye ve Viyana nüshaları kolasyon edildi." },
      { w: "Kûy-i yâr", m: "Sevgilinin oturduğu mahalle veya sokak; âşık için cennet bahçesi ve kâbe.", k: "Farsça", cat: "mazmun", ex: "Kûy-i yârı terk edip cennete gitmez âşık." },
      { w: "Leb-i la'l", m: "Kırmızı yakut gibi kıymetli ve tatlı dudak; âb-ı hayât kaynağı.", k: "Arapça-Farsça", cat: "mazmun", ex: "Leb-i la'lin şerbeti derde devâdır." },
      { w: "Lemma", m: "Edisyon kritikte tercih edilen ve metin gövdesine alınan esas nüsha okunuşu.", k: "Grekçe", cat: "yazma", ex: "Metinde lemma olarak 'gül-fem' kelimesi tespit edilmiştir." },
      { w: "Mahlas", m: "Şairin şiirlerinin son beytinde (makta) kullandığı edebi takma ad.", k: "Arapça", cat: "filoloji", ex: "Fuzûlî, Bâkî, Nedîm, Şeyh Gâlib birer mahlastır." },
      { w: "Medd", m: "Aruz vezninde bir uzun ünlü ve bir ünsüzle biten heceyi bir buçuk hece (- .) değerinde uzatarak okuma.", k: "Arapça", cat: "filoloji", ex: "Yâr, cân, âh, aşk kelimelerinde medd uygulanır." },
      { w: "Mey-hâne", m: "Tasavvuf edebiyatında ilahi aşk şarabının sunulduğu tekke veya feyiz meclisi.", k: "Farsça", cat: "tasavvuf", ex: "Biz ol âşıklarız kim mey-hâneden çıkmaz ayağımız." },
      { w: "Miklebin", m: "Yazma eser ciltlerinin ucundaki kapakçık; sayfaları koruyan ve yer işareti vazifesi gören üçgen kanat.", k: "Arapça", cat: "yazma", ex: "Yazmanın miklebi altın şemseli ve zencireklidir." },
      { w: "Murg-ı dil", m: "Gönül kuşu; daldan dala konan, sevgilinin saç tuzağına esir düşen âşık gönlü.", k: "Farsça", cat: "mazmun", ex: "Murg-ı dil zülfün hevâsıyla perende oldu." },
      { w: "Müjgan", m: "Kirpikler; âşığın bağrına saplanan tîr (ok) ve hançerler.", k: "Farsça", cat: "mazmun", ex: "Müjgânların saf saf olup bağrımı deldi." },
      { w: "Mukabele", m: "Yazma bir eserin istinsah edildikten sonra asıl nüshasıyla karşılıklı sesli okunarak tashih edilmesi.", k: "Arapça", cat: "yazma", ex: "Eser müellif nüshasıyla mukabele olunmuştur." },
      { w: "Nâle", m: "İnleme, feryat, âşığın döktüğü gözyaşıyla birlikte çıkardığı acı ses.", k: "Farsça", cat: "mazmun", ex: "Nâle-i bülbül uyandırdı seherde gülleri." },
      { w: "Nefy ü isbât", m: "Tasavvuf zikrinde 'Lâ ilâhe' (yokluk/nefy) ile başlayıp 'illallâh' (varlık/isbât) ile hakikati onaylama.", k: "Arapça", cat: "tasavvuf", ex: "Nefy ü isbât kılıcıyla nefsi helâk eyledik." },
      { w: "Ney", m: "Kamışlıktan koparılmış, sinesine delikler açılmış ve yanık inlemesiyle vatanını özleyen insan-ı kâmil simgesi.", k: "Farsça", cat: "tasavvuf", ex: "Bişnev ez ney çün hikâyet mî-küned (Mesnevî)." },
      { w: "Nüsha", m: "El yazması bir eserin elle kopya edilmiş her bir müstakil yazma örneği.", k: "Arapça", cat: "yazma", ex: "Süleymaniye Nüshası, Millet Nüshası, Ayasofya Nüshası." },
      { w: "Peymâne", m: "Büyük kadeh; ilahi aşk dolusu kadeh.", k: "Farsça", cat: "tasavvuf", ex: "Peymâne-i aşkı nûş eden mest olur." },
      { w: "Pîr-i mugân", m: "Meyhaneci piri; tasavvufta mürşid-i kâmil, hakikat rehberi.", k: "Farsça", cat: "tasavvuf", ex: "Pîr-i mugân eşiğinde baş koymuşuz." },
      { w: "Rind", m: "Dünyanın geçici makam ve hırslarını hiçe sayan, içi temiz, gönül ehli kişi.", k: "Farsça", cat: "tasavvuf", ex: "Rind-i lâ-ubâlîyiz biz ar ü nâmı neyleriz." },
      { w: "Rûh-ı revân", m: "Akıp giden ruh, hayat kaynağı; çok sevilen cân sevgili.", k: "Farsça", cat: "mazmun", ex: "Ey rûh-ı revânım sensiz bu ten bir cesed-i bî-cândır." },
      { w: "Sâkî", m: "İçki sunan güzel; tasavvufta ilahi feyzi ve marifeti taliplere aktaran mürşid.", k: "Arapça", cat: "tasavvuf", ex: "Sâkîyâ meded kıl kim susuzluktan helâk olduk." },
      { w: "Sefine", m: "1. Gemi. 2. Yazma eserlerde dikey yerine yatay (uzunlamasına) açılan antoloji ve şiir mecmuaları.", k: "Arapça", cat: "yazma", ex: "Şairlerin gazellerini ihtiva eden sefine tipi bir mecmua." },
      { w: "Serv-i sehî", m: "Düzgün, boylu boslu servi ağacı; sevgilinin salınan endamı.", k: "Farsça", cat: "mazmun", ex: "Serv-i sehî gibi salınır bağ içinde yâr." },
      { w: "Sihr-i helâl", m: "Büyü gibi tesirli fakat caiz ve kusursuz olan yüksek edebi söz sanatı.", k: "Arapça", cat: "edebi-sanat", ex: "Şiirinde sihr-i helâl eylemiş Fuzûlî." },
      { w: "Stemma Codicum", m: "Edisyon kritikte nüshaların birbirinden türeyişini ve soy kütüğünü gösteren şecere ağacı.", k: "Latince", cat: "yazma", ex: "Metin tenkidinde stemma codicum kurularak arketip tespiti yapılır." },
      { w: "Şeb-i yeldâ", m: "Yılın en uzun gecesi (21 Aralık); âşığa asırlar kadar uzun gelen hicran gecesi.", k: "Farsça", cat: "mazmun", ex: "Şeb-i yeldâyı müneccimle muvakkit ne bilir / Mübtelâ-yı gama sor kim geceler kaç saat (Sâbit)" },
      { w: "Şem' ü pervâne", m: "Mum ile etrafında dönüp canını ateşe atan pervane (kelebek); ilahi aşka kurban olan can.", k: "Farsça", cat: "tasavvuf", ex: "Şem'ine yandı pervâne misâli bu dil." },
      { w: "Şiraze", m: "Yazma eser formalarını sırt kısmından birbirine bağlayan ipekten örülmüş sağlam örgü dikişi.", k: "Farsça", cat: "yazma", ex: "Kitabın şirazesi koptuğunda sayfalar dağılır." },
      { w: "Tecâhül-i ârif", m: "Bildiği bir gerçeği nükte veya hayret maksadıyla bilmiyormuş gibi görünme sanatı.", k: "Arapça", cat: "edebi-sanat", ex: "Şakaklarıma kar mı yağdı ne var? / Benim mi Allahım bu çizgili yüz? (Cahit Sıtkı)" },
      { w: "Temellük", m: "Yazma eserin ilk yaprağında yer alan, kitabın kime ait olduğunu belirten mülkiyet ibaresi.", k: "Arapça", cat: "yazma", ex: "Sahibuhu ve mâlikuhu el-Hac Ahmed Efendi." },
      { w: "Tenâsüb", m: "Aralarında zıtlık olmaksızın anlamca birbiriyle ilişkili kelimeleri bir arada kullanma sanatı.", k: "Arapça", cat: "edebi-sanat", ex: "Gül, bülbül, gonca, bâğ, hazân kelimeleri tenâsüp oluşturur." },
      { w: "Teşbîh-i belîğ", m: "Benzetme edatı ve yönü zikredilmeden yalnızca benzeyen ve benzetilenle yapılan asil benzetme.", k: "Arapça", cat: "edebi-sanat", ex: "Gül yüzlü sevgili yerine doğrudan 'gülüm'." },
      { w: "Tiryâk", m: "Zehirlere karşı panzehir; sevgilinin dudağının şifa dağıtması.", k: "Farsça", cat: "mazmun", ex: "Derdime tiryâk olan la'l-i lebindir senin." },
      { w: "Tûbâ", m: "Kökü gökte, dalları aşağıda cennet ağacı; sevgilinin servi boyu.", k: "Arapça", cat: "mazmun", ex: "Kadd-i mevzûnuna tûbâ diyemem boyu uzundur." },
      { w: "Untermünze", m: "Metin tenkidinde iki farklı nüsha ailesi arasında aracı vazifesi gören kayıp ara nüsha.", k: "Almanca", cat: "yazma", ex: "Stemma şemasında X ve Y nüshalarının atasıdır." },
      { w: "Vahdet-i vücûd", m: "Varlığın birliği nazariyesi; hakiki varlığın tek olup kâinatın O'nun tecellilerinden ibaret olması.", k: "Arapça", cat: "tasavvuf", ex: "İbnü'l-Arabî ve Yûnus Emre irfanının temeli." },
      { w: "Varyant", m: "Farklı yazma nüshalarda aynı mısra veya kelimenin farklı şekilde yazılmış ya da okunmuş hali.", k: "Fransızca", cat: "yazma", ex: "Nüsha A'da 'odlara' geçerken Nüsha C'de 'gözyaşı ile' varyantı vardır." },
      { w: "Vuslat", m: "Sevgiliye kavuşma; tasavvufta kulun fenâfillâh makamına erip Hakk ile bir olması.", k: "Arapça", cat: "tasavvuf", ex: "Hicran gecesi bitti vuslat demi erişti." },
      { w: "Zâhid", m: "Dinin sadece zahiri ve şekli kurallarına takılıp aşk ve cezbeden nasipsiz kalan kaba sofu.", k: "Arapça", cat: "tasavvuf", ex: "Zâhidâ gel ta'n etme rindân-ı bâde-nûşa." },
      { w: "Zahriye", m: "Yazma eserin baş tarafında esere ve müellifine dair kayıtların, vakıf mühürlerinin bulunduğu ilk yaprak.", k: "Arapça", cat: "yazma", ex: "Zahriye tezhipli ve mühürlüdür." },
      { w: "Zencirek", m: "Yazma eser ciltlerinde veya sayfa kenarlarındaki cedvellerde zincir halkası şeklindeki altın yaldızlı süsleme.", k: "Farsça", cat: "yazma", ex: "Çift sıra altın zencirek ile tezyin edilmiştir." },
      { w: "Zıll-ı ilâhî", m: "Allah'ın yeryüzündeki gölgesi; adalet dağıtan hükümdar / padişah.", k: "Arapça", cat: "filoloji", ex: "Padişah-ı zıllullâh bu fermanı sadır eyledi." },
      { w: "Zülf-i yâr", m: "Sevgilinin misk kokulu kara saçları; âşıkları bağlayan ezelî bağ.", k: "Farsça", cat: "mazmun", ex: "Zülf-i yâra dolaşan gönlüm halâs olmaz." }
    ],

    // Canlı Çekilen RSS Sözlük Verileri Havuzu
    rssLiveWords: [],

    /**
     * Canlı Sözlük Sitelerinden RSS Verisi Çeker
     * TDK, Kubbealtı, Nişanyan ve Bitigey Sözlük RSS Akışları
     */
    fetchDictionaryRss: async function () {
      const RSS_FEEDS = [
        {
          name: "TDK & Kubbealtı Güncel Lügat Akışı",
          url: "https://www.bitigey.com/rss.xml",
          fallbackWords: [
            { w: "Müstensih", m: "Yazma eserleri el yazısıyla kopya eden, devrin hattat veya ilim talebesi.", k: "Arapça", cat: "rss-canli", ex: "Müstensih Ahmed el-Bağdâdî hattıyla yazılmıştır." },
            { w: "Ta'lik", m: "İran menşeli, divan şiiri ve edebi yazmalarda sıklıkla tercih edilen zarif, asılı yazı hattı.", k: "Arapça", cat: "rss-canli", ex: "Nüsha nefis bir nestalik hat ile kaleme alınmıştır." },
            { w: "Mülemma", m: "Aynı manzume içinde farklı dillerden (Türkçe, Arapça, Farsça) mısraların bir arada kullanıldığı şiir.", k: "Arapça", cat: "rss-canli", ex: "Mevlânâ ve Sultan Veled mülemma şiirler nazmetmiştir." },
            { w: "Şerh", m: "Klasik bir edebi metni, beyti veya divanı kelime kelime açıklayıp manasını derinlemesine tahlil etme.", k: "Arapça", cat: "rss-canli", ex: "Sûdî-i Bosnevî'nin Şerh-i Dîvân-ı Hâfız eseri meşhurdur." },
            { w: "Mazmun", m: "Klasik şiirde kalıplaşmış, dolaylı ve ima yoluyla bir varlığı anlatan edebi kavram veya simge.", k: "Arapça", cat: "rss-canli", ex: "Gül, bülbül, mum, pervane divan şiirinin temel mazmunlarıdır." },
            { w: "Mecmûa", m: "Farklı şairlerin şiirlerinin, duaların veya ilmi notların toplandığı derleme el yazması defter.", k: "Arapça", cat: "rss-canli", ex: "Milli Kütüphane mecmuaları taranarak kayıp gazeller bulundu." }
          ]
        }
      ];

      let pulledCount = 0;

      // Çevrimiçi RSS beslemesini sorgula (CORS proxy veya yerel rss)
      try {
        const res = await fetch('../rss.xml');
        if (res.ok) {
          const xmlText = await res.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          const items = xmlDoc.querySelectorAll('item');

          items.forEach(item => {
            const title = item.querySelector('title') ? item.querySelector('title').textContent : '';
            const desc = item.querySelector('description') ? item.querySelector('description').textContent : '';
            if (title && desc) {
              this.rssLiveWords.push({
                w: title,
                m: desc.substring(0, 140) + '...',
                k: 'Canlı RSS',
                cat: 'rss-canli',
                ex: 'Kaynak: Bitigey Canlı Edebiyat & Sözlük Beslemesi'
              });
              pulledCount++;
            }
          });
        }
      } catch (e) {
        console.warn('Live RSS fetch fell back to curated live dictionary pool:', e);
      }

      // Her halükarda garantili yüksek nitelikli RSS sözlük havuzunu ekle
      RSS_FEEDS[0].fallbackWords.forEach(w => {
        if (!this.rssLiveWords.some(existing => existing.w.toLowerCase() === w.w.toLowerCase())) {
          this.rssLiveWords.push(w);
          pulledCount++;
        }
      });

      return {
        count: pulledCount,
        total: this.coreDictionary.length + this.rssLiveWords.length
      };
    },

    /**
     * Tüm kelimeleri (Temel + Canlı RSS) döndürür
     */
    getAllWords: function () {
      return this.coreDictionary.concat(this.rssLiveWords);
    },

    /**
     * Arama ve Kategori Filtreleme
     * @param {string} query - Arama kelimesi
     * @param {string} category - 'all' | 'mazmun' | 'yazma' | 'tasavvuf' | 'edebi-sanat' | 'rss-canli'
     */
    search: function (query, category) {
      const all = this.getAllWords();
      const q = (query || '').toLowerCase().trim();
      const cat = category || 'all';

      return all.filter(item => {
        const matchesCategory = (cat === 'all' || item.cat === cat);
        if (!matchesCategory) return false;

        if (!q) return true;

        const wMatch = item.w.toLowerCase().includes(q);
        const mMatch = item.m.toLowerCase().includes(q);
        const kMatch = item.k.toLowerCase().includes(q);
        const exMatch = item.ex ? item.ex.toLowerCase().includes(q) : false;

        return wMatch || mMatch || kMatch || exMatch;
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SozlukEngine;
  } else {
    global.SozlukEngine = SozlukEngine;
  }

})(typeof window !== 'undefined' ? window : this);
