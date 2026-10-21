# Changelog — Legislativní prohlížeč

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/), verze podle sémantického verzování.

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
