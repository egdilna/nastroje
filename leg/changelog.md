# Changelog — Legislativní prohlížeč

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/), verze podle sémantického verzování.

## [1.16.0] — 2026-10-31

### Přidáno
- Pořadí předpisů v knihovně: nová stránka „Pořadí předpisů“ (z přehledu odkazem „Změnit pořadí předpisů“, jen v režimu úprav). U každého předpisu tlačítka Nahoru, Dolů, Na začátek a Na konec; fokus zůstává na přesunutém předpisu a ohlásí se jeho nové místo. Tlačítko „Seřadit podle roku a čísla“ vrátí výchozí řazení. Pořadí platí všude — v přehledu, v oblastech, v seznamech vyznačených ustanovení, komentářů a štítků, v hledání i v exportech. Nově přidaný předpis se zařadí na konec.
- Přepínač znění na stránce ustanovení (když je staženo víc znění předpisu) — totéž ustanovení jde zobrazit v jiném znění bez návratu na předpis.

## [1.15.1] — 2026-10-31

### Opraveno
- Čtečka obrazovky u ustanovení s vyznačením, komentáři či štítky četla nejdřív velmi dlouhý název odkazu a samotný text ustanovení zanikal. Odkaz na ustanovení má teď krátký přístupný název (označení, případně citace) a informace o vyznačení, komentářích a štítcích se čtou až za textem ustanovení, jednou větou v závorce; viditelné značky ★ 💬 🏷 jsou tamtéž.
- Po uložení vyznačení celého paragrafu či článku se mylně hlásilo, že se text ustanovení od vyznačení změnil. Úprava textu do souvislé věty je nově při opakování stabilní (odstavce se znovu neslepí) a porovnání nezávisí na mezerách a zalomení řádků.

## [1.15.0] — 2026-10-30

### Přidáno
- Přepínač „Úpravy“ v záhlaví stránky. Ve výchozím stavu je aplikace jen ke čtení: text předpisů, vyznačení, komentáře, štítky, poznámky, hledání a exporty jsou vidět, ale formuláře a tlačítka, která něco mění, ne — správa předpisu, oblastí, skupin a štítků, vyznačování, psaní a úpravy komentářů, štítky ustanovení, poznámka k předpisu, přidání předpisu, kontrola aktualizací, import dat a hromadné úpravy. Po zapnutí se vše ukáže; volbu si prohlížeč pamatuje.

## [1.14.1] — 2026-10-29

### Změněno
- Export vyznačení a štítků do Markdownu: odkazy v odrážkách jsou pojmenované Markdown odkazy „Odkaz na ustanovení § … zákona …“ a „Odkaz do e-Sbírky na § … zákona …“ místo holých adres.

## [1.14.0] — 2026-10-29

### Změněno
- Nová podoba exportu komentářů do Markdownu: pod nadpisem název knihovny, čas exportu s počtem komentářů, poznámka skupiny a odkaz na skupinu (či přehled komentářů); u každého předpisu odkaz na předpis; u ustanovení tučně citace s textem ustanovení, odkaz na ustanovení a pod ním jen texty komentářů (bez data a skupin).

## [1.13.1] — 2026-10-28

### Změněno
- Oblasti, skupiny vyznačení a skupiny komentářů se stejně jako štítky všude řadí podle české abecedy bez ohledu na velikost písmen (přehledy, výběry, souhrny, filtry, přenos dat i exporty).

## [1.13.0] — 2026-10-28

### Změněno
- Text ustanovení pro kopírování, ukládání a exporty (Markdown, TSV, DKM) je souvislá česká věta: bez označení odstavců, písmen a bodů a bez nadpisů struktury; návětí se s písmenem či bodem a se společnou částí za výčtem spojí do jedné věty. U celého paragrafu zůstávají odstavce na samostatných řádcích. Platí i pro dříve uložené texty. Detail ustanovení na obrazovce zůstává strukturovaný.

## [1.12.0] — 2026-10-22

### Přidáno
- Filtr textu předpisu má volbu „Bez kontextu“: zobrazí jen nalezená ustanovení v pořadí předpisu, každé pod nadpisem s citací (v pohledu s odkazy jako odkaz na detail), bez nadřazených částí, paragrafů a návětí. Volba je v adrese (`kontext=ne|ano`) a prohlížeč si ji pamatuje.

## [1.11.0] — 2026-10-21

### Přidáno
- Souhrn u každého předpisu v přehledu knihovny i v oblasti: počet vyznačených ustanovení, ustanovení s komentáři a komentářů celkem, štítky předpisu, odkazy na skupiny vyznačení a skupiny komentářů, které předpis obsahují (vedou na celé skupiny), a oblasti.

## [1.10.0] — 2026-10-21

### Přidáno
- Komentáře přímo v textu předpisu v čtecím pohledu (komentované a výkladové znění): u každého předpisu se zapínají po skupinách komentářů (i „bez skupiny“), výchozí stav je vypnuto. Komentář se zobrazí pod celým ustanovením, u odstavce až za jeho písmeny.
- Filtr textu předpisu umí „Jen ustanovení s komentářem“ (ze zapnutých skupin, když nějaké jsou) a „Jen vyznačená ustanovení“; kombinují se s textem i štítkem.

## [1.9.1] — 2026-10-21

### Opraveno
- Export do DKM: ústavní zákon má typ předpisu Zákon (dříve Předpis).

## [1.9.0] — 2026-10-21

### Přidáno
- Popis předpisu (krátký text) ve Správě předpisu, zobrazený v informacích o předpisu a přenášený v balíčku.
- Popisný název ustanovení u vyznačení; zobrazuje se v detailu ustanovení, v přehledech vyznačených a v exportech („Popisný název (citace)“).
- Export do DKM jako balíček `.dkmpkg` ve všech exportních panelech vyznačení, komentářů a štítků. Nese typ Právní předpis ze šablony `vsechnosablona.dkmdata` (stejná id typu, atributů i číselníků, navíc Odkaz do LEG prohlížeče) a nový typ Ustanovení předpisu; exportovaná ustanovení se složeným textem, poznámkou a komentáři, jejich předpisy a odkazovaná ustanovení a předpisy (i EU) s vazbou „odkazuje na“. Stálá id: `leg2000365`, `leg2000365_par_3_odst_1`, `legeu2016679`. Štítky, skupiny a účinnost se nepřenášejí.

## [1.8.1] — 2026-10-21

### Změněno
- Štítky se vždy ukládají malými písmeny a všude se řadí podle české abecedy (č za c, ch za h). Starší štítky se při načtení převedou; štítky, které se tím shodují, se sloučí. I importované štítky se převádějí.

## [1.8.0] — 2026-10-21

### Změněno
- Hromadné úpravy jsou standardně skryté. Zaškrtávátka u položek a panel akcí se ukážou až po zapnutí přepínače „Hromadné úpravy“ pod seznamem; volba platí pro všechny přehledy a prohlížeč si ji pamatuje.

## [1.7.0] — 2026-10-21

### Změněno
- Text ustanovení se skládá: u písmene nebo bodu se připojí návětí nadřazeného odstavce (a písmene) a společná část za výčtem, takže např. § 6 odst. 1 písm. b) se čte celé. Platí pro detail ustanovení (návětí je vidět, ustanovení je podbarvené), kopírování, vyznačení, komentáře, štítky i exporty.
- Z kopírování a z exportu do Markdownu zmizel údaj „ve znění…“; formát „Citace, znění a text“ byl odstraněn.

## [1.6.0] — 2026-10-20

### Přidáno
- Přepínač na stránce předpisu „Zobrazit“: text předpisu, vyznačená ustanovení, komentáře, nebo ustanovení se štítky — vše přímo v detailu předpisu, s počty, hromadnými úpravami a exportem. Volba je v adrese (`cast=vyznacena|komentare|stitky`).

## [1.5.0] — 2026-10-20

### Přidáno
- Štítky pro předpisy i jednotlivá ustanovení (jeden společný slovník). Výběr zaškrtávátky s polem pro nové štítky — na stránce předpisu (Správa předpisu), při přidání předpisu a na stránce ustanovení.
- Stránka Štítky s počty a stránka štítku s poznámkou v Markdownu, předpisy a ustanoveními se štítkem, exportem Markdown a TSV a správou štítku.
- Značka 🏷 v textu předpisu a štítky v přístupném názvu označení ustanovení; filtr textu předpisu podle štítku (samostatně i s hledaným textem); hledání v předpisech se štítkem.
- Hromadné úpravy se zaškrtávátky: předpisy (štítek, oblast) v přehledu a na stránce štítku, vyznačení a komentáře (skupina, štítek ustanovení, zrušení či smazání), ustanovení na stránce štítku.
- Štítky v exportu vyznačení a komentářů a v přenosu dat (volba „Přenést štítky“, párování podle názvu).

## [1.4.0] — 2026-10-20

### Přidáno
- Přepínač pohledu na text předpisu: čtecí pohled (čistý text bez odkazů na ustanovení a bez značek) a pohled s odkazy na ustanovení a značkami vyznačení a komentářů. Volba je v adrese (`zobrazeni=cteni|odkazy`) a prohlížeč si ji pamatuje.

## [1.3.0] — 2026-10-20

### Přidáno
- Filtr textu na stránce předpisu: zobrazí jen ustanovení, která obsahují všechna zadaná slova, i s kontextem (nadřazené části, hlavy, paragrafy a úvodní věty odstavců), s vyznačenými výskyty a počtem nalezených míst. Obsah předpisu se filtruje také, filtr má vlastní adresu a jde zrušit odkazem.

## [1.2.1] — 2026-10-20

### Změněno
- Přenos dat: výběr skupin vyznačení a komentářů teď určuje, co se přenese. Standardně se přenesou jen vyznačení a komentáře z vybraných skupin; volitelně i ty bez skupiny, všechny u vybraných předpisů, nebo žádné.

## [1.2.0] — 2026-10-20

### Přidáno
- Poznámka v Markdownu ke skupině vyznačení, ke skupině komentářů i k oblasti; zobrazuje se na jejich stránce a je součástí exportu.
- Export vyznačených ustanovení (skupina, předpis, oblast, vše) a komentářů jako Markdown a TSV — do schránky i do souboru. TSV soubor má BOM, aby ho Excel otevřel správně v UTF-8.
- Přenos dat mezi úložišti (stránka Přenos dat): export vybraného obsahu do balíčku (soubor nebo schránka), import z balíčku nebo přímo z jiného úložiště, s výběrem předpisů, oblastí a skupin a s volbou, co dělat při shodě (sloučit, ponechat, přepsat). Chybějící předpisy se při importu stáhnou z e-Sbírky.

## [1.1.0] — 2026-10-20

### Přidáno
- Poznámka k celému předpisu v Markdownu na vlastní stránce s náhledem; ukládá se jako samostatný soubor `predpisy/<rok>-<číslo>/poznamka.md` a zobrazuje se nad textem předpisu.
- Komentáře k ustanovením — libovolně mnoho k jednomu ustanovení, v Markdownu, s úpravou a mazáním; značka 💬 s počtem v textu předpisu a v přístupném názvu označení.
- Skupiny komentářů s přehledy komentářů podle skupiny, předpisu, oblasti i všech dohromady a s kopírováním přehledu.
- Kopírování ustanovení i s komentáři; hledání i v komentářích a poznámkách k předpisům.
- Upozornění při odchodu ze stránky s rozepsaným a neuloženým textem.

## [1.0.0] — 2026-10-19

### Přidáno
- Pracovní prostor ve složce GitHub repozitáře (`legprohlizec.json` a složka `predpisy`), token jen v prohlížeči, úložiště předatelné odkazem.
- Oblasti jako uživatelské složky předpisů; jeden předpis může být ve více oblastech.
- Přidání předpisu podle čísla (110/2019, citace, ELI nebo adresa z e-Sbírky) se stažením aktuálního a volitelně i budoucích znění; každé znění v samostatných souborech do zhruba 600 kB.
- Strukturované vykreslení celého předpisu: části, hlavy, díly, paragrafy a články jako nadpisy, odstavce, písmena a body jako vnořené seznamy, tabulky, poznámky pod čarou, obsah předpisu.
- Detail ustanovení s umístěním v předpisu, kontextem celého paragrafu, sousedními ustanoveními, odkazy a kopírováním v několika tvarech.
- Vyznačená ustanovení ve skupinách (neomezeně) s poznámkami, značka v textu, přehledy podle předpisu, oblasti, skupiny i celkový.
- Odkazy mezi předpisy; předpis mimo knihovnu se nabídne k zařazení.
- Hledání v předpisu, oblasti nebo celé knihovně (i bez diakritiky a v poznámkách), přechod na ustanovení podle citace.
- Kontrola a stažení nových znění, historie a obnova pracovního prostoru.
